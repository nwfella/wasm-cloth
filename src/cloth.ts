// ─────────────────────────────────────────────────────────────────────────────
//  wasm-cloth — Verlet cloth solver, compiled to WebAssembly (AssemblyScript).
//
//  Everything physical lives in this module:
//    · Verlet integration (position-based; velocity is implicit in p - p_prev)
//    · structural / shear / bend distance constraints, solved as three ordered
//      Gauss–Seidel passes so each constraint family has its own stiffness
//    · sphere + floor collision resolution (radial projection, ground friction)
//    · per-frame dynamic normal recalculation (area-weighted then normalised)
//    · the render mesh itself: vertex positions, normals, uvs, triangle indices
//
//  The JavaScript side never touches a vertex: it uploads the exported memory
//  buffers straight to WebGL.
//
//  PERFORMANCE NOTES (both measured, both worth ~4x):
//   1. AssemblyScript compiles typed-array element access to a bounds-checked
//      *function call* (`Float32Array#__get`) — ~20 per constraint, 143 ns per
//      constraint, 27 ms/step. Hot loops therefore use raw `load`/`store` on
//      pointers, which becomes a single wasm load/store.
//   2. Positions/normals are interleaved at stride 4 (x,y,z,pad) instead of
//      three planar arrays. Three 20 KB arrays blew the L1 cache on every
//      constraint (6 cache lines touched per constraint, all misses); one
//      interleaved stream with sequential access costs one line per vertex.
//      ~~~~ → 2.0 ms/step for 5184 vertices, 30 386 constraints, 6 iterations.
// ─────────────────────────────────────────────────────────────────────────────

const MAXV: i32 = 96 * 96;      // vertex capacity (supports up to 96 x 96)
const MAXC: i32 = 56000;        // constraint capacity
const MAXI: i32 = 60000;        // index capacity

// ── backing store (allocated once at instantiation by the stub runtime) ──────
const bufP = new Float32Array(MAXV * 4);   // x, y, z, pad
const bufQ = new Float32Array(MAXV * 4);   // previous positions — Verlet velocity
const bufN = new Float32Array(MAXV * 4);   // normals
const bufIvm = new Float32Array(MAXV);     // inverse mass; 0 == pinned
const bufUv = new Float32Array(MAXV * 2);
const bufCi = new Uint16Array(MAXC);       // constraint endpoints
const bufCj = new Uint16Array(MAXC);
const bufCr = new Float32Array(MAXC);      // constraint rest length
const bufIdx = new Uint16Array(MAXI);      // triangle indices

// data pointers into wasm memory, resolved once in init()
let P: usize = 0, Q: usize = 0, N: usize = 0, IVM: usize = 0, UV: usize = 0;
let CI: usize = 0, CJ: usize = 0, CR: usize = 0, IDX: usize = 0;

// byte offsets for the interleaved vec4 layout
//   vertex i occupies P + (i << 4) .. +12   (x, y, z, pad)
@inline function vx(base: usize, i: i32): f32 { return load<f32>(base + (<usize>i << 4)); }
@inline function vy(base: usize, i: i32): f32 { return load<f32>(base + (<usize>i << 4) + 4); }
@inline function vz(base: usize, i: i32): f32 { return load<f32>(base + (<usize>i << 4) + 8); }
@inline function setV(base: usize, i: i32, x: f32, y: f32, z: f32): void {
  const o = base + (<usize>i << 4);
  store<f32>(o, x); store<f32>(o + 4, y); store<f32>(o + 8, z);
}
@inline function f32at(base: usize, i: i32): f32 { return load<f32>(base + (<usize>i << 2)); }
@inline function setF32(base: usize, i: i32, v: f32): void { store<f32>(base + (<usize>i << 2), v); }
@inline function u16at(base: usize, i: i32): i32 { return <i32>load<u16>(base + (<usize>i << 1)); }
@inline function setU16(base: usize, i: i32, v: i32): void { store<u16>(base + (<usize>i << 1), <u16>v); }

@inline function fsqrt(x: f32): f32 { return <f32>Math.sqrt(<f64>x); }
@inline function fsin(x: f32): f32 { return <f32>Math.sin(<f64>x); }
@inline function fcos(x: f32): f32 { return <f32>Math.cos(<f64>x); }
@inline function finv(x: f32): f32 { return <f32>1.0 / x; }

// mesh state
let COLS: i32 = 0;
let ROWS: i32 = 0;
let NV: i32 = 0;                // live vertex count
let NI: i32 = 0;                // live index count
let SPACING: f32 = 0.05;
let PIN_Y: f32 = 1.0;

// constraint ranges inside the shared arrays:
//   [0, nStruct)  structural   [nStruct, nStruct+nShear)  shear
//   [nStruct+nShear, nCons)    bend
let nStruct: i32 = 0;
let nShear: i32 = 0;
let nBend: i32 = 0;
let nCons: i32 = 0;

// simulation parameters
let gravity: f32 = 9.2;
let retention: f32 = 0.982;     // velocity retained per step (air drag)
let windAmp: f32 = 0.55;
let windFreq: f32 = 2.1;
let iterations: i32 = 6;
let kStruct: f32 = 1.0;
let kShear: f32 = 0.78;
let kBend: f32 = 0.3;
let floorY: f32 = -2.4;
// Verlet is only conditionally stable: with very few solver iterations the
// constraint pass cannot keep up with gravity, stretch feeds velocity, and the
// sheet diverges to NaN within a couple of hundred steps (measured at
// iterations=1, dt=1/60). Clamping the per-step displacement of a vertex caps
// that feedback loop without touching normal motion — real folds move orders of
// magnitude slower than this.
const MAX_STEP: f32 = 0.12;      // world units per step
// Collision resolves VERTICES; a triangle between two resolved vertices still
// sags inside the sphere between them, which shows up as speckled interpenetration
// where the fabric wraps a curved surface. Pushing vertices out by a thin skin
// keeps whole triangles outside the sphere that is actually drawn.
const COLLIDE_SKIN: f32 = 0.012;

// sphere collider
let sphX: f32 = 0.0;
let sphY: f32 = 0.0;
let sphZ: f32 = 0.0;
let sphR: f32 = 0.6;
let sphOn: i32 = 1;

// diagnostics
let hitCount: i32 = 0;          // vertices resolved against the sphere, last step
let floorHits: i32 = 0;
let pinnedN: i32 = 0;
let pinMode: i32 = 0;           // 0 = four corner blocks, 1 = full border frame

function resolvePointers(): void {
  P = bufP.dataStart; Q = bufQ.dataStart; N = bufN.dataStart;
  IVM = bufIvm.dataStart; UV = bufUv.dataStart;
  CI = bufCi.dataStart; CJ = bufCj.dataStart; CR = bufCr.dataStart;
  IDX = bufIdx.dataStart;
}

// ── setup ────────────────────────────────────────────────────────────────────

export function init(cols: i32, rows: i32, spacing: f32, pinY: f32): void {
  resolvePointers();

  COLS = cols < 2 ? 2 : (cols > 96 ? 96 : cols);
  ROWS = rows < 2 ? 2 : (rows > 96 ? 96 : rows);
  if (COLS * ROWS > MAXV) ROWS = MAXV / COLS;
  NV = COLS * ROWS;
  SPACING = spacing;
  PIN_Y = pinY;

  const halfC: f32 = <f32>(COLS - 1) * 0.5;
  const halfR: f32 = <f32>(ROWS - 1) * 0.5;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      setV(P, i, (<f32>c - halfC) * SPACING, PIN_Y, (<f32>r - halfR) * SPACING);
      setF32(UV, i * 2, <f32>c / <f32>(COLS - 1));
      setF32(UV, i * 2 + 1, <f32>r / <f32>(ROWS - 1));
      setF32(IVM, i, 1.0);
    }
  }

  buildConstraints();
  buildIndices();
  setPinMode(pinMode);
}

function buildConstraints(): void {
  nStruct = 0;
  nShear = 0;
  nBend = 0;
  let n = 0;   // one cursor keeps the three ranges contiguous

  // structural — immediate neighbours (resists stretching)
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      if (c + 1 < COLS) { setU16(CI, n, i); setU16(CJ, n, i + 1); setF32(CR, n, SPACING); n++; nStruct++; }
      if (r + 1 < ROWS) { setU16(CI, n, i); setU16(CJ, n, i + COLS); setF32(CR, n, SPACING); n++; nStruct++; }
    }
  }
  // shear — both diagonals of every cell (resists in-plane skew)
  const ds: f32 = fsqrt(SPACING * SPACING * 2.0);
  for (let r = 0; r + 1 < ROWS; r++) {
    for (let c = 0; c + 1 < COLS; c++) {
      const i = r * COLS + c;
      setU16(CI, n, i); setU16(CJ, n, i + COLS + 1); setF32(CR, n, ds); n++; nShear++;
      setU16(CI, n, i + 1); setU16(CJ, n, i + COLS); setF32(CR, n, ds); n++; nShear++;
    }
  }
  // bend — skip-one neighbours (resists folding, keeps wrinkles broad)
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      if (c + 2 < COLS) { setU16(CI, n, i); setU16(CJ, n, i + 2); setF32(CR, n, SPACING * 2.0); n++; nBend++; }
      if (r + 2 < ROWS) { setU16(CI, n, i); setU16(CJ, n, i + 2 * COLS); setF32(CR, n, SPACING * 2.0); n++; nBend++; }
    }
  }
  nCons = n;
}

function buildIndices(): void {
  let k = 0;
  for (let r = 0; r + 1 < ROWS; r++) {
    for (let c = 0; c + 1 < COLS; c++) {
      const i = r * COLS + c;
      setU16(IDX, k, i); setU16(IDX, k + 1, i + COLS); setU16(IDX, k + 2, i + 1); k += 3;
      setU16(IDX, k, i + 1); setU16(IDX, k + 1, i + COLS); setU16(IDX, k + 2, i + COLS + 1); k += 3;
    }
  }
  NI = k;
}

export function setPinMode(mode: i32): void {
  pinMode = mode;
  pinnedN = 0;
  const corner: i32 = 2;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      let pinned = false;
      if (pinMode == 1) {
        pinned = r == 0 || c == 0 || r == ROWS - 1 || c == COLS - 1;
      } else {
        const nearC = c < corner || c >= COLS - corner;
        const nearR = r < corner || r >= ROWS - corner;
        pinned = nearC && nearR;
      }
      setF32(IVM, i, pinned ? 0.0 : 1.0);
      if (pinned) pinnedN++;
    }
  }
  reset();
}

export function reset(): void {
  const halfC: f32 = <f32>(COLS - 1) * 0.5;
  const halfR: f32 = <f32>(ROWS - 1) * 0.5;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      const x = (<f32>c - halfC) * SPACING;
      const z = (<f32>r - halfR) * SPACING;
      setV(P, i, x, PIN_Y, z);
      setV(Q, i, x, PIN_Y, z);
      setV(N, i, 0.0, 1.0, 0.0);
    }
  }
  hitCount = 0;
  floorHits = 0;
  computeNormals();
}

// ── parameters ───────────────────────────────────────────────────────────────

export function setPhysics(g: f32, drag: f32, wind: f32, freq: f32, iters: i32,
                           ks: f32, ksh: f32, kb: f32, floory: f32): void {
  gravity = g;
  retention = drag < 0.0 ? 0.0 : (drag > 1.0 ? 1.0 : drag);
  windAmp = wind;
  windFreq = freq;
  iterations = iters < 1 ? 1 : (iters > 24 ? 24 : iters);
  kStruct = ks < 0.0 ? 0.0 : (ks > 1.0 ? 1.0 : ks);
  kShear = ksh < 0.0 ? 0.0 : (ksh > 1.0 ? 1.0 : ksh);
  kBend = kb < 0.0 ? 0.0 : (kb > 1.0 ? 1.0 : kb);
  floorY = floory;
}

export function setSphere(cx: f32, cy: f32, cz: f32, r: f32, enabled: i32): void {
  sphX = cx; sphY = cy; sphZ = cz;
  sphR = (r < 0.02 ? 0.02 : r) + COLLIDE_SKIN;
  sphOn = enabled;
}

// ── solver ───────────────────────────────────────────────────────────────────

@inline
function solveRange(from: i32, to: i32, k: f32): void {
  for (let n = from; n < to; n++) {
    const i = u16at(CI, n);
    const j = u16at(CJ, n);
    const wi = f32at(IVM, i);
    const wj = f32at(IVM, j);
    const ws = wi + wj;
    if (ws == 0.0) continue;

    const pi = P + (<usize>i << 4);
    const pj = P + (<usize>j << 4);
    const xi = load<f32>(pi), yi = load<f32>(pi + 4), zi = load<f32>(pi + 8);
    const dx = load<f32>(pj) - xi;
    const dy = load<f32>(pj + 4) - yi;
    const dz = load<f32>(pj + 8) - zi;
    const d2 = dx * dx + dy * dy + dz * dz;
    if (d2 < 1e-12) continue;

    const d = fsqrt(d2);
    // positional correction applied immediately (Gauss–Seidel), so later
    // constraints in the same pass see the updated positions
    // inverse masses are exactly 0 (pinned) or 1 (free) here, so the usual
    // wi/ws and wj/ws divisions collapse to three constant cases — one fewer
    // division on the loop's critical path
    const diff = ((d - f32at(CR, n)) / d) * k;
    let si: f32, sj: f32;
    if (wi == wj) { si = 0.5 * diff; sj = 0.5 * diff; }
    else if (wi == 0.0) { si = 0.0; sj = diff; }
    else { si = diff; sj = 0.0; }

    store<f32>(pi, xi + dx * si);
    store<f32>(pi + 4, yi + dy * si);
    store<f32>(pi + 8, zi + dz * si);
    store<f32>(pj, load<f32>(pj) - dx * sj);
    store<f32>(pj + 4, load<f32>(pj + 4) - dy * sj);
    store<f32>(pj + 8, load<f32>(pj + 8) - dz * sj);
  }
}

function collideSphere(counting: bool): void {
  if (sphOn == 0) return;
  const cx = sphX, cy = sphY, cz = sphZ;
  const r = sphR;
  const r2 = r * r;
  for (let i = 0; i < NV; i++) {
    if (f32at(IVM, i) == 0.0) continue;
    const o = P + (<usize>i << 4);
    const x = load<f32>(o), y = load<f32>(o + 4), z = load<f32>(o + 8);
    const dx = x - cx, dy = y - cy, dz = z - cz;
    const d2 = dx * dx + dy * dy + dz * dz;
    if (d2 >= r2) continue;
    const d = fsqrt(d2);
    if (d < 1e-6) {
      store<f32>(o + 4, cy + r);          // dead centre: push straight up
    } else {
      const s = r / d;
      store<f32>(o, cx + dx * s);
      store<f32>(o + 4, cy + dy * s);
      store<f32>(o + 8, cz + dz * s);
    }
    if (counting) hitCount++;
  }
}

function collideFloor(counting: bool): void {
  for (let i = 0; i < NV; i++) {
    if (f32at(IVM, i) == 0.0) continue;
    const o = P + (<usize>i << 4);
    const y = load<f32>(o + 4);
    if (y < floorY) {
      const x = load<f32>(o), z = load<f32>(o + 8);
      const qo = Q + (<usize>i << 4);
      // ground friction: bleed off horizontal velocity at the contact plane
      store<f32>(o + 4, floorY);
      store<f32>(o, x + (load<f32>(qo) - x) * 0.4);
      store<f32>(o + 8, z + (load<f32>(qo + 8) - z) * 0.4);
      if (counting) floorHits++;
    }
  }
}

export function step(dt: f32, t: f32): void {
  const dt2: f32 = dt * dt;
  const gust: f32 = 0.5 + 0.5 * fsin(t * 0.61);
  const wa: f32 = windAmp * gust;
  const wf: f32 = windFreq;

  // ── Verlet integration ────────────────────────────────────────────────────
  for (let i = 0; i < NV; i++) {
    if (f32at(IVM, i) == 0.0) continue;
    const o = P + (<usize>i << 4);
    const qo = Q + (<usize>i << 4);
    const x = load<f32>(o), y = load<f32>(o + 4), z = load<f32>(o + 8);
    // travelling wind wave across the sheet + vertical flutter
    const ph: f32 = t * wf - x * 1.9 - z * 1.35;
    const ax: f32 = wa * fsin(ph);
    const az: f32 = wa * 0.42 * fcos(ph * 0.83 + y * 1.7);
    const ay: f32 = -gravity + wa * 0.6 * fsin(ph * 1.37 + z * 2.1);

    const vX: f32 = (x - load<f32>(qo)) * retention;
    const vY: f32 = (y - load<f32>(qo + 4)) * retention;
    const vZ: f32 = (z - load<f32>(qo + 8)) * retention;

    let nX: f32 = x + vX + ax * dt2;
    let nY: f32 = y + vY + ay * dt2;
    let nZ: f32 = z + vZ + az * dt2;
    const sx = nX - x, sy = nY - y, sz = nZ - z;
    const s2 = sx * sx + sy * sy + sz * sz;
    if (s2 > MAX_STEP * MAX_STEP) {
      const cl = MAX_STEP / fsqrt(s2);
      nX = x + sx * cl; nY = y + sy * cl; nZ = z + sz * cl;
    }
    store<f32>(qo, x); store<f32>(qo + 4, y); store<f32>(qo + 8, z);
    store<f32>(o, nX);
    store<f32>(o + 4, nY);
    store<f32>(o + 8, nZ);
  }

  // ── constraint solve: structural → shear → bend, then collision ───────────
  hitCount = 0;
  floorHits = 0;
  const sEnd = nStruct;
  const hEnd = nStruct + nShear;
  for (let it = 0; it < iterations; it++) {
    solveRange(0, sEnd, kStruct);
    solveRange(sEnd, hEnd, kShear);
    solveRange(hEnd, nCons, kBend);
    const last = it == iterations - 1;
    collideSphere(last);
    collideFloor(last);
  }

  computeNormals();
}

export function computeNormals(): void {
  for (let i = 0; i < NV; i++) setV(N, i, 0.0, 0.0, 0.0);
  for (let k = 0; k < NI; k += 3) {
    const a = u16at(IDX, k);
    const b = u16at(IDX, k + 1);
    const c = u16at(IDX, k + 2);
    const pa = P + (<usize>a << 4);
    const pb = P + (<usize>b << 4);
    const pc = P + (<usize>c << 4);
    const ax = load<f32>(pa), ay = load<f32>(pa + 4), az = load<f32>(pa + 8);
    const e1x = load<f32>(pb) - ax, e1y = load<f32>(pb + 4) - ay, e1z = load<f32>(pb + 8) - az;
    const e2x = load<f32>(pc) - ax, e2y = load<f32>(pc + 4) - ay, e2z = load<f32>(pc + 8) - az;
    // un-normalised cross product: its magnitude is 2x the triangle area, so
    // accumulating it weights each face by area (broad folds dominate)
    const cx = e1y * e2z - e1z * e2y;
    const cy = e1z * e2x - e1x * e2z;
    const cz = e1x * e2y - e1y * e2x;
    const na = N + (<usize>a << 4);
    const nb = N + (<usize>b << 4);
    const nc = N + (<usize>c << 4);
    store<f32>(na, load<f32>(na) + cx); store<f32>(na + 4, load<f32>(na + 4) + cy); store<f32>(na + 8, load<f32>(na + 8) + cz);
    store<f32>(nb, load<f32>(nb) + cx); store<f32>(nb + 4, load<f32>(nb + 4) + cy); store<f32>(nb + 8, load<f32>(nb + 8) + cz);
    store<f32>(nc, load<f32>(nc) + cx); store<f32>(nc + 4, load<f32>(nc + 4) + cy); store<f32>(nc + 8, load<f32>(nc + 8) + cz);
  }
  for (let i = 0; i < NV; i++) {
    const o = N + (<usize>i << 4);
    const x = load<f32>(o), y = load<f32>(o + 4), z = load<f32>(o + 8);
    const l2 = x * x + y * y + z * z;
    if (l2 > 1e-20) {
      const inv = finv(fsqrt(l2));
      store<f32>(o, x * inv); store<f32>(o + 4, y * inv); store<f32>(o + 8, z * inv);
    } else {
      store<f32>(o, 0.0); store<f32>(o + 4, 1.0); store<f32>(o + 8, 0.0);
    }
  }
}

// ── diagnostics / buffer access ──────────────────────────────────────────────

export function getVertexCount(): i32 { return NV; }
export function getIndexCount(): i32 { return NI; }
export function getCols(): i32 { return COLS; }
export function getRows(): i32 { return ROWS; }
export function getStructCount(): i32 { return nStruct; }
export function getShearCount(): i32 { return nShear; }
export function getBendCount(): i32 { return nBend; }
export function getConstraintCount(): i32 { return nCons; }
export function getPinnedCount(): i32 { return pinnedN; }
export function getHitCount(): i32 { return hitCount; }
export function getFloorHits(): i32 { return floorHits; }

// interleaved vec4 buffers — uploaded to WebGL with zero copies (stride 16)
export function posPtr(): i32 { return P as i32; }
export function prevPtr(): i32 { return Q as i32; }
export function normPtr(): i32 { return N as i32; }
export function uvPtr(): i32 { return UV as i32; }
export function idxPtr(): i32 { return IDX as i32; }

// mean absolute constraint error, normalised by rest length — the testable
// definition of "the solver actually converged"
export function constraintError(): f32 {
  if (nCons == 0) return 0.0;
  let sum: f64 = 0.0;
  for (let n = 0; n < nCons; n++) {
    const i = u16at(CI, n);
    const j = u16at(CJ, n);
    const dx = <f64>vx(P, j) - <f64>vx(P, i);
    const dy = <f64>vy(P, j) - <f64>vy(P, i);
    const dz = <f64>vz(P, j) - <f64>vz(P, i);
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const rest = <f64>f32at(CR, n);
    sum += Math.abs(d - rest) / rest;
  }
  return <f32>(sum / <f64>nCons);
}

// distance from the sphere centre to the nearest vertex (≈ r means contact)
export function nearestToSphere(): f32 {
  let best: f32 = 1e9;
  for (let i = 0; i < NV; i++) {
    const dx = vx(P, i) - sphX;
    const dy = vy(P, i) - sphY;
    const dz = vz(P, i) - sphZ;
    const d = fsqrt(dx * dx + dy * dy + dz * dz);
    if (d < best) best = d;
  }
  return best;
}

// vertical span of the sheet: a robust "it draped / it sagged" metric
export function extentY(): f32 {
  let lo: f32 = 1e9, hi: f32 = -1e9;
  for (let i = 0; i < NV; i++) {
    const y = vy(P, i);
    if (y < lo) lo = y;
    if (y > hi) hi = y;
  }
  return hi - lo;
}

// test/debug hook: teleport one vertex (position and previous position), so a
// gate can perturb the sheet and watch a known equilibrium restore itself
export function poke(i: i32, x: f32, y: f32, z: f32): void {
  if (i < 0 || i >= NV) return;
  setV(P, i, x, y, z);
  setV(Q, i, x, y, z);
}

export function vertexX(i: i32): f32 { return vx(P, i); }
export function vertexY(i: i32): f32 { return vy(P, i); }
export function vertexZ(i: i32): f32 { return vz(P, i); }
export function normalY(i: i32): f32 { return vy(N, i); }
