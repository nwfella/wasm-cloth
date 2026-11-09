#!/usr/bin/env node
/**
 * verify_wasm.js — tier 1 gate.
 *
 * Everything below runs against the WebAssembly bytes EMBEDDED IN index.html,
 * not against build/cloth.wasm: the module that ships is the module under test.
 * The physics is exercised purely through the wasm API, so a claim like "the
 * solver is in WebAssembly" is checked by measurement rather than by reading
 * the source: no JavaScript participates in these assertions.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const HTML = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const WASM_FILE = path.join(ROOT, "build", "cloth.wasm");

let pass = 0, fail = 0, group = "";
const fails = [];

function section(name) { group = name; console.log(`\n\x1b[1m${name}\x1b[0m`); }
function check(name, ok, detail) {
  const tag = ok ? "\x1b[32mPASS\x1b[0m" : "\x1b[31mFAIL\x1b[0m";
  console.log(`  ${tag}  ${name}${detail ? `  \x1b[2m${detail}\x1b[0m` : ""}`);
  if (ok) pass++; else { fail++; fails.push(name); }
}
const num = (n, d = 0) => Number(n).toFixed(d);

/* ── extract the embedded module ─────────────────────────────────────────── */
const START = "<!--WASM-B64-->", END = "<!--/WASM-B64-->";
const a = HTML.indexOf(START), b = HTML.indexOf(END);
const b64 = a >= 0 && b > a
  ? (HTML.slice(a + START.length, b).match(/<script[^>]*>([\s\S]*?)<\/script>/) || [, ""])[1].trim()
  : "";
const bytes = b64 ? Uint8Array.from(Buffer.from(b64, "base64")) : new Uint8Array(0);

const imports = { env: { abort: () => { throw new Error("wasm aborted"); } } };
const load = (buf) => WebAssembly.instantiate(buf, imports).then((r) => (r.instance || r).exports);

/* ═════════════════════════════════════════════════════════════════════════ */
(async () => {
  section("artifact");
  check("index.html carries the WASM base64 payload", bytes.length > 2000,
    `${num(bytes.length)} bytes decoded`);
  check("payload is a valid wasm module", bytes.length > 0 && WebAssembly.validate(bytes));
  const onDisk = fs.existsSync(WASM_FILE) ? fs.readFileSync(WASM_FILE) : Buffer.alloc(0);
  check("embedded payload === build/cloth.wasm (build in sync)",
    onDisk.length === bytes.length && Buffer.compare(Buffer.from(bytes), onDisk) === 0,
    `${onDisk.length} vs ${bytes.length} bytes`);
  check("module fits the 'small' claim", bytes.length < 64 * 1024,
    `${num(bytes.length / 1024, 2)} KB < 64 KB`);

  const mod = new WebAssembly.Module(bytes);
  const imps = WebAssembly.Module.imports(mod).map((i) => `${i.module}.${i.name}`);
  check("only import is env.abort (no JS math helpers)", imps.length === 1 && imps[0] === "env.abort",
    imps.join(", ") || "none");
  const exps = WebAssembly.Module.exports(mod).map((e) => e.name);
  const required = ["init", "step", "setPhysics", "setSphere", "setPinMode", "computeNormals",
    "constraintError", "nearestToSphere", "extentY", "posPtr", "normPtr", "idxPtr", "memory"];
  const missing = required.filter((r) => !exps.includes(r));
  check("exports the full solver API", missing.length === 0,
    missing.length ? "missing: " + missing.join(",") : `${exps.length} exports`);

  const e = await load(bytes);

  /* ── mesh topology ─────────────────────────────────────────────────────── */
  section("mesh topology");
  const N = 72, SPACING = 3.2 / (N - 1);
// the ball sections use the SHIPPED sheet width (2.8), so the launch numbers
// printed here are the ones the page actually produces
const GSP = 2.8 / (N - 1);
  e.init(N, N, SPACING, 1.15);
  e.setPinMode(0);
  const NV = e.getVertexCount();
  check("grid is at least 64x64 vertices", NV >= 64 * 64, `${e.getCols()}x${e.getRows()} = ${NV} vertices`);
  check("triangle count = 2*(n-1)^2", e.getIndexCount() === 2 * (N - 1) * (N - 1) * 3,
    `${e.getIndexCount() / 3} triangles`);

  const nStruct = e.getStructCount(), nShear = e.getShearCount(), nBend = e.getBendCount();
  check("structural constraints = 2n(n-1)", nStruct === 2 * N * (N - 1), `${nStruct}`);
  check("shear constraints = 2(n-1)^2", nShear === 2 * (N - 1) * (N - 1), `${nShear}`);
  check("bend constraints = 2n(n-2)", nBend === 2 * N * (N - 2), `${nBend}`);
  check("three distinct constraint families exist", nStruct > 0 && nShear > 0 && nBend > 0,
    `total ${e.getConstraintCount()}`);
  check("corner pinning holds 4 blocks of 2x2", e.getPinnedCount() === 16, `${e.getPinnedCount()} pinned`);
  e.setPinMode(1);
  check("frame pinning holds the border ring", e.getPinnedCount() === 4 * N - 4, `${e.getPinnedCount()} pinned`);
  e.setPinMode(0);

  /* ── buffer layout the renderer depends on ─────────────────────────────── */
  const mem = e.memory.buffer;
  const ptrs = [e.posPtr(), e.normPtr(), e.uvPtr(), e.idxPtr()];
  check("buffer pointers are in-bounds and 4-byte aligned",
    ptrs.every((p) => p > 0 && p + NV * 16 <= mem.byteLength && p % 4 === 0),
    ptrs.join(", "));

  /* ── physics ───────────────────────────────────────────────────────────── */
  section("physics");
  const readPos = () => {
    const v = new Float32Array(e.memory.buffer, e.posPtr(), NV * 4);
    return v;
  };
  const rest = (() => { e.reset(); return Float32Array.from(readPos()); })();

  e.setPhysics(9.2, 0.982, 0.55, 2.1, 6, 1.0, 0.78, 0.3, -1.35);
  e.setSphere(0.5, 0.3, 0.2, 0.62, 1);
  const DT = 1 / 60;
  let t = 0;
  const runSteps = (n) => { for (let i = 0; i < n; i++) { t += DT; e.step(DT, t); } };

  runSteps(240);
  const settled = Float32Array.from(readPos());
  let nan = 0, moved = 0, pinnedMoved = 0, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < NV; i++) {
    const x = settled[i * 4], y = settled[i * 4 + 1], z = settled[i * 4 + 2];
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) nan++;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    const d = Math.hypot(x - rest[i * 4], y - rest[i * 4 + 1], z - rest[i * 4 + 2]);
    if (d > 1e-4) moved++;
  }
  check("no NaN / infinite vertices after 240 steps", nan === 0, `${nan} bad of ${NV}`);
  check("the sheet actually deforms", moved > NV * 0.9, `${moved}/${NV} vertices moved`);

  // the 4 corner blocks (16 vertices) must not have moved a single bit
  let still = 0;
  for (let i = 0; i < NV; i++) {
    const d = Math.hypot(settled[i * 4] - rest[i * 4], settled[i * 4 + 1] - rest[i * 4 + 1],
      settled[i * 4 + 2] - rest[i * 4 + 2]);
    if (d === 0) still++;
  }
  check("pinned vertices are exactly immobile", still === 16, `${still} vertices never moved (16 anchors)`);

  check("the sheet drapes (vertical extent grows)", maxY - minY > 0.3, `extentY ${num(maxY - minY, 3)}`);
  check("no vertex falls through the floor", minY >= -1.35 - 1e-4, `min y ${num(minY, 3)} vs floor -1.35`);

  const gap = e.nearestToSphere();
  check("collider separates the cloth from the sphere", gap >= 0.62 - 1e-3, `nearest ${num(gap, 4)} vs r 0.62`);
  check("the sphere is actually in contact", e.getHitCount() > 0, `${e.getHitCount()} contacts`);

  const err6 = e.constraintError();
  check("constraint error is small at the shipped setting", err6 < 0.10, `mean |Δl|/l = ${err6.toExponential(2)}`);

  /* convergence must improve with iterations — the slider has to mean something */
  section("solver convergence");
  const errAt = {};
  for (const it of [1, 2, 3, 6, 12]) {
    e.init(N, N, SPACING, 1.15); e.setPinMode(0); e.reset();
    e.setPhysics(9.2, 0.982, 0.55, 2.1, it, 1.0, 0.78, 0.3, -1.35);
    e.setSphere(0.5, 0.3, 0.2, 0.62, 1);
    t = 0;
    runSteps(240);
    errAt[it] = e.constraintError();
  }
  const order = [1, 2, 3, 6, 12];
  const monotone = order.every((it, i) => i === 0 || errAt[it] <= errAt[order[i - 1]] + 1e-6);
  check("error falls monotonically with iterations", monotone,
    order.map((i) => `${i}:${errAt[i].toExponential(1)}`).join("  "));

  /* closed-form check: border-pinned flat sheet is the exact equilibrium */
  e.init(3, 3, 1.0, 0);
  e.setPinMode(1);
  e.setPhysics(0, 0.982, 0, 2.1, 12, 1, 0.78, 0.3, -1.35);
  e.setSphere(0, 0, 0, 0.6, 0);
  e.poke(4, 0, 0.6, 0);
  for (let k = 0; k < 400; k++) e.step(1 / 60, k / 60);
  const settleY = Math.abs(e.vertexY(4));
  check("a perturbed free vertex returns to the analytic equilibrium",
    settleY < 0.01 && e.constraintError() < 1e-5,
    `center y=${settleY.toExponential(2)}, err=${e.constraintError().toExponential(1)}`);

  /* stability across the whole slider range (regression: iterations=1 → NaN) */
  section("stability sweep");
  let finiteAll = true, worstIt = 0;
  for (const it of [1, 2, 3, 4, 6, 8, 12]) {
    e.init(N, N, SPACING, 1.15); e.setPinMode(0);
    e.setPhysics(9.2, 0.982, 1.4, 2.1, it, 1.0, 0.78, 0.3, -1.35);
    e.setSphere(0.5, 0.3, 0.2, 0.85, 1);
    t = 0;
    for (let k = 0; k < 400; k++) { t += DT; e.step(DT, t); }
    const p = readPos();
    for (let i = 0; i < p.length; i++) {
      if (!Number.isFinite(p[i]) || Math.abs(p[i]) > 50) { finiteAll = false; worstIt = it; }
    }
  }
  check("iterations 1..12 stay finite and bounded (dt=1/60, heavy wind)", finiteAll,
    finiteAll ? "no NaN, |p| < 50" : `diverged at iterations=${worstIt}`);

  let clampOk = true;
  e.init(200, 200, 0.05, 1);
  clampOk = clampOk && e.getCols() <= 96 && e.getVertexCount() <= 96 * 96;
  const bigVerts = e.getVertexCount(), bigCons = e.getConstraintCount();
  e.init(1, 1, 0.05, 1);
  clampOk = clampOk && e.getCols() >= 2 && e.getVertexCount() >= 4;
  check("init() clamps out-of-range resolutions", clampOk,
    `200² → ${bigVerts} verts / ${bigCons} constraints, 1² → ${e.getVertexCount()} verts`);

  /* ── dynamic normals ───────────────────────────────────────────────────── */
  section("normals");
  e.init(N, N, SPACING, 1.15); e.setPinMode(0);
  e.setPhysics(9.2, 0.982, 0.55, 2.1, 6, 1.0, 0.78, 0.3, -1.35);
  e.setSphere(0.5, 0.3, 0.2, 0.62, 1);
  t = 0; runSteps(120);
  const nv1 = e.getVertexCount();
  const nrm = new Float32Array(e.memory.buffer, e.normPtr(), nv1 * 4);
  let nonUnit = 0;
  for (let i = 0; i < nv1; i++) {
    const l = Math.hypot(nrm[i * 4], nrm[i * 4 + 1], nrm[i * 4 + 2]);
    if (Math.abs(l - 1) > 1e-3) nonUnit++;
  }
  check("every normal is unit length", nonUnit === 0, `${nonUnit} off-unit of ${nv1}`);

  const before = Float32Array.from(nrm);
  runSteps(30);
  const after = new Float32Array(e.memory.buffer, e.normPtr(), nv1 * 4);
  let changed = 0, maxDelta = 0;
  for (let i = 0; i < nv1; i++) {
    const d = Math.abs(after[i * 4] - before[i * 4]) + Math.abs(after[i * 4 + 1] - before[i * 4 + 1]);
    if (d > 1e-4) changed++;
    maxDelta = Math.max(maxDelta, d);
  }
  check("normals are recalculated as the fabric moves", changed > nv1 * 0.5,
    `${changed}/${nv1} changed, max Δ ${num(maxDelta, 3)}`);

  /* normals must respond to the collision, not just to gravity */
  e.reset(); e.setSphere(0.5, 0.3, 0.2, 0.62, 1);
  t = 0; runSteps(60);
  const nTop = new Float32Array(e.memory.buffer, e.normPtr(), nv1 * 4);
  let flatNormals = 0;
  for (let i = 0; i < nv1; i++) if (Math.abs(nTop[i * 4 + 1] - 1) < 1e-3) flatNormals++;
  check("normals deviate from flat once the sheet folds", flatNormals < nv1 * 0.5,
    `${flatNormals}/${nv1} still (0,1,0)`);

  /* ── determinism + performance ─────────────────────────────────────────── */
  section("determinism & performance");
  const snap = () => Float32Array.from(new Float32Array(e.memory.buffer, e.posPtr(), nv1 * 4));
  e.init(N, N, SPACING, 1.15); e.setPinMode(0);
  e.setPhysics(9.2, 0.982, 0.55, 2.1, 6, 1.0, 0.78, 0.3, -1.35);
  t = 0; runSteps(90);
  const A = snap();
  e.reset(); t = 0; runSteps(90);
  const B = snap();
  let maxDiff = 0;
  for (let i = 0; i < A.length; i++) maxDiff = Math.max(maxDiff, Math.abs(A[i] - B[i]));
  check("identical inputs give bit-identical output", maxDiff === 0, `max Δ ${maxDiff}`);

  e.init(N, N, SPACING, 1.15); e.setPinMode(0); e.reset();
  e.setPhysics(9.2, 0.982, 0.55, 2.1, 6, 1.0, 0.78, 0.3, -1.35);
  e.setSphere(0.5, 0.3, 0.2, 0.62, 1);
  t = 0; runSteps(120);            // warm up
  const STEPS = 240;
  const t0 = process.hrtime.bigint();
  runSteps(STEPS);
  const ms = Number(process.hrtime.bigint() - t0) / 1e6 / STEPS;
  check("one step fits in a 60 fps frame budget", ms < 16.6,
    `${num(ms, 2)} ms/step  (${num(NV)} verts, ${e.getConstraintCount()} constraints, 6 iterations)`);

  /* ── dynamic ball: the momentum-exchange contract ─────────────────────── */
  section("dynamic ball: contact");
  const ballSteps = (n) => { for (let i = 0; i < n; i++) { t += DT; e.step(DT, t); } };
  const ballPos = () => [e.ballX(), e.ballY(), e.ballZ()];

  function ballSetup({ pin = 0, wind = 0, ks = 1.0, mass = 2.0, rad = 0.16, rest = 0.25, drop = 1.45 } = {}) {
    e.init(N, N, GSP, 1.15);
    e.setPinMode(pin);
    e.setPhysics(9.2, 0.982, wind, 2.1, 6, ks, 0.78, 0.3, -1.35);
    e.setSphere(0, 0, 0, 0.6, 0);
    e.setBallPhysics(9.2, 0.9985, rest, 12.0);
    t = 0;
    e.setBall(0, drop, 0, 0, 0, 0, rad, mass, 1);
  }

  /* the contract from the brief: a ball at rest on a taut sheet stays put */
  ballSetup({ pin: 1 });
  ballSteps(600);
  const restP = ballPos();
  let worstDrift = 0;
  for (let k = 0; k < 300; k++) {
    ballSteps(1);
    const p = ballPos();
    worstDrift = Math.max(worstDrift, Math.hypot(p[0] - restP[0], p[1] - restP[1], p[2] - restP[2]));
  }
  check("a ball at rest on a taut sheet stays within 1 mm for 300 steps", worstDrift < 0.001,
    `worst excursion ${(worstDrift * 1000).toFixed(3)} mm at y ${restP[1].toFixed(3)}`);

  /* no input and no wind: contact may remove kinetic energy, never add it */
  ballSetup({ pin: 1, wind: 0 });
  ballSteps(600);
  const ke0 = e.ballKinetic();
  let keMax = 0, keBad = false;
  for (let k = 0; k < 600; k++) {
    ballSteps(1);
    const ke = e.ballKinetic();
    if (!Number.isFinite(ke)) { keBad = true; break; }
    if (ke > keMax) keMax = ke;
  }
  check("no input, no wind: ball KE stays inside +2 % for 600 steps",
    !keBad && keMax <= ke0 * 1.02 + 1e-3,
    `KE ${ke0.toExponential(2)} → max ${keMax.toExponential(2)} J`);

  /* a dropped ball must not come back higher than it fell */
  ballSetup({ pin: 1, drop: 1.6 });
  let contactAt = -1, rebound = -9;
  for (let k = 0; k < 400; k++) {
    ballSteps(1);
    if (contactAt < 0 && e.ballContactCount() > 0) contactAt = k;
    if (contactAt >= 0 && e.ballY() > rebound) rebound = e.ballY();
  }
  check("a dropped ball's first bounce rises less than its drop height",
    contactAt >= 0 && rebound < 1.6 - 0.05,
    `dropped from 1.600, contact at step ${contactAt}, rebound apex ${rebound.toFixed(3)}`);

  /* the whole iteration range the UI exposes, with the ball live */
  section("dynamic ball: stability sweep");
  let nanHits = 0, nanAt = "", ballPeak = 0;
  for (let it = 2; it <= 12; it++) {
    e.init(N, N, GSP, 1.15); e.setPinMode(0);
    e.setPhysics(9.2, 0.982, 0.55, 2.1, it, 1.0, 0.78, 0.3, -1.35);
    e.setSphere(0, 0, 0, 0.6, 0);
    e.setBallPhysics(9.2, 0.9985, 0.25, 12.0);
    t = 0;
    e.setBall(0, 1.45, 0, 0, 0, 0, 0.17, 2, 1);
    for (let k = 0; k < 1200; k++) {
      t += DT; e.step(DT, t);
      const sp = e.ballSpeed();
      if (!Number.isFinite(sp) || sp > 13) { nanHits++; nanAt = `iters ${it}`; }
      if (sp > ballPeak) ballPeak = sp;
    }
    const p = readPos();
    for (let i = 0; i < p.length; i++) {
      if (!Number.isFinite(p[i]) || Math.abs(p[i]) > 50) { nanHits++; nanAt = `iters ${it}`; }
    }
    if (!Number.isFinite(e.ballX()) || !Number.isFinite(e.ballY()) || !Number.isFinite(e.ballZ())) {
      nanHits++; nanAt = `ball at iters ${it}`;
    }
  }
  check("1200 steps at every iteration count 2..12: no NaN, bounded", nanHits === 0,
    nanHits ? `bad at ${nanAt}` : `ball peak ${ballPeak.toFixed(2)} u/s, |p| < 50`);

  /* two identical runs must agree bit for bit, launch included */
  section("dynamic ball: determinism");
  const detRun = () => {
    ballSetup({ pin: 0, wind: 0.55 });
    ballSteps(300);
    for (let f = 0; f < 60; f++) {
      const g = Math.min(1, (f + 1) / 60);
      for (let k = 0; k < 4; k++) e.setAnchor(k, 0.6 * g, -0.5 * g, 0);
      ballSteps(1);
    }
    for (let f = 0; f < 120; f++) {
      const g = Math.max(0, 1 - f / 14);
      for (let k = 0; k < 4; k++) e.setAnchor(k, 0.6 * g, -0.5 * g, 0);
      ballSteps(1);
    }
    return {
      p: Float32Array.from(readPos()),
      b: [e.ballX(), e.ballY(), e.ballZ(), e.ballVelX(), e.ballVelY(), e.ballVelZ()],
      ke: e.ballKinetic(),
    };
  };
  const detA = detRun(), detB = detRun();
  let detDiff = 0;
  for (let i = 0; i < detA.p.length; i++) detDiff = Math.max(detDiff, Math.abs(detA.p[i] - detB.p[i]));
  for (let i = 0; i < 6; i++) detDiff = Math.max(detDiff, Math.abs(detA.b[i] - detB.b[i]));
  check("two identical shots are bit-identical (cloth and ball)", detDiff === 0,
    `max Δ ${detDiff}, ball KE ${detA.ke.toExponential(2)}`);

  /* ── scoring ──────────────────────────────────────────────────────────── */
  section("scoring");
  e.setTarget(1.0, 1.0, 0.0, 0.4);
  e.setBall(1.0, 1.0, 0.0, 0, 0, 0, 0.16, 2, 1);
  check("scored() = 1 with the ball centre on the target centre", e.scored() === 1, `dist ${e.targetDist().toFixed(3)}`);
  e.setBall(1.30, 1.0, 0.0, 0, 0, 0, 0.16, 2, 1);
  check("scored() = 1 well inside the target sphere", e.scored() === 1, `dist ${e.targetDist().toFixed(3)} vs r 0.400`);
  e.setBall(1.4, 1.0, 0.0, 0, 0, 0, 0.16, 2, 1);
  check("a graze exactly on the surface is a MISS", e.scored() === 0 && Math.abs(e.targetDist() - 0.4) < 1e-5,
    `dist ${e.targetDist().toFixed(6)}, scored ${e.scored()}`);
  e.setBall(1.5, 1.0, 0.0, 0, 0, 0, 0.16, 2, 1);
  check("scored() = 0 outside the target sphere", e.scored() === 0, `dist ${e.targetDist().toFixed(3)}`);
  e.setBall(0, 1.45, 0, 0, 0, 0, 0.16, 2, 0);
  check("a switched-off ball never scores", e.scored() === 0, `ballOn ${e.ballOn()}`);

  /* ── the mechanic's lever: sheet tension and draw depth ────────────────── */
  section("launch mechanics");
  function launch({ ks = 1.0, dx = 0.6, dz = 0, down = 0.5, pin = 0, mass = 2, rad = 0.17 } = {}) {
    e.init(N, N, GSP, 1.15); e.setPinMode(pin);
    e.setPhysics(9.2, 0.982, 0.55, 2.1, 6, ks, 0.78, 0.3, -1.35);
    e.setSphere(0, 0, 0, 0.6, 0);
    e.setBallPhysics(9.2, 0.9985, 0.25, 12.0);
    t = 0;
    e.setBall(0, 1.45, 0, 0, 0, 0, rad, mass, 1);
    ballSteps(300);
    for (let f = 0; f < 60; f++) {
      const g = Math.min(1, (f + 1) / 60);
      for (let k = 0; k < 4; k++) e.setAnchor(k, dx * g, -down * g, dz * g);
      ballSteps(1);
    }
    let vmax = 0, apex = -9, peak = null;
    for (let f = 0; f < 130; f++) {
      const g = Math.max(0, 1 - f / 14);
      for (let k = 0; k < 4; k++) e.setAnchor(k, dx * g, -down * g, dz * g);
      ballSteps(1);
      if (e.ballSpeed() > vmax) { vmax = e.ballSpeed(); peak = ballPos(); }
      if (e.ballY() > apex) apex = e.ballY();
    }
    return { vmax, apex, peak };
  }
  const taut = launch({ ks: 1.0 });
  const slack = launch({ ks: 0.25 });
  const tensionGap = Math.abs(taut.vmax - slack.vmax) / Math.max(taut.vmax, slack.vmax);
  check("taut and slack sheets launch at measurably different speeds", tensionGap > 0.05,
    `taut(ks 1.0) ${taut.vmax.toFixed(2)} u/s vs slack(ks 0.25) ${slack.vmax.toFixed(2)} u/s — ${(100 * tensionGap).toFixed(1)} % apart`);
  const weak = launch({ dx: 0.35 });
  const strong = launch({ dx: 0.6 });
  check("draw depth is a real power lever", strong.vmax > weak.vmax * 1.15,
    `draw 0.35 → ${weak.vmax.toFixed(2)} u/s (apex ${weak.apex.toFixed(2)}), draw 0.60 → ${strong.vmax.toFixed(2)} u/s (apex ${strong.apex.toFixed(2)})`);
  check("the ball leaves the sheet, it is not carried by a scripted impulse",
    strong.vmax > 2.0 && strong.apex > 0.5 && strong.peak[0] > 0.3,
    `peak speed ${strong.vmax.toFixed(2)} u/s at (${strong.peak.map((v) => v.toFixed(2)).join(", ")})`);

  /* an anchor draw must move the module's own pin, not a copy in JS */
  e.init(N, N, GSP, 1.15); e.setPinMode(0);
  const a0 = [e.anchorX(0), e.anchorY(0), e.anchorZ(0)];
  e.setAnchor(0, 0.4, -0.2, 0.1);
  const a1 = [e.anchorX(0), e.anchorY(0), e.anchorZ(0)];
  e.setAnchor(0, 0, 0, 0);
  const a2 = [e.anchorX(0), e.anchorY(0), e.anchorZ(0)];
  check("setAnchor moves that block and reset anchors restores it",
    Math.abs(a1[0] - a0[0] - 0.4) < 1e-5 && Math.abs(a1[1] - a0[1] + 0.2) < 1e-5 &&
    Math.abs(a1[2] - a0[2] - 0.1) < 1e-5 && Math.abs(a2[0] - a0[0]) < 1e-5,
    `(${a0.map((v) => v.toFixed(2)).join(",")}) → (${a1.map((v) => v.toFixed(2)).join(",")}) → (${a2.map((v) => v.toFixed(2)).join(",")})`);

  /* additive: a parked, switched-off ball leaves the cloth bit-identical */
  section("additive mode");
  e.init(N, N, GSP, 1.15); e.setPinMode(0);
  e.setPhysics(9.2, 0.982, 0.55, 2.1, 6, 1.0, 0.78, 0.3, -1.35);
  e.setSphere(0.5, 0.3, 0.2, 0.62, 1);
  t = 0; e.reset(); runSteps(240);
  const noBall = Float32Array.from(readPos());
  e.init(N, N, GSP, 1.15); e.setPinMode(0);
  e.setPhysics(9.2, 0.982, 0.55, 2.1, 6, 1.0, 0.78, 0.3, -1.35);
  e.setSphere(0.5, 0.3, 0.2, 0.62, 1);
  t = 0; e.reset();
  e.setBall(0.2, 0.4, 0, 0, 0, 0, 0.3, 4, 0);      // parked inside the drape, disabled
  runSteps(240);
  const withBall = Float32Array.from(readPos());
  let additiveDiff = 0;
  for (let i = 0; i < noBall.length; i++) additiveDiff = Math.max(additiveDiff, Math.abs(noBall[i] - withBall[i]));
  check("a disabled ball changes nothing (free play is untouched)", additiveDiff === 0 && e.ballOn() === 0,
    `max Δ ${additiveDiff} over ${noBall.length / 4} vertices`);

  /* ── page wiring (static) ──────────────────────────────────────────────── */
  section("page wiring");
  const resourceLoad = /<(script|img|iframe|source|video|audio|link)\b[^>]*\b(src|href)\s*=\s*["']\s*(https?:)?\/\//i;
  check("no network-fetched resources (offline single file)",
    !/\bfetch\s*\(|XMLHttpRequest/.test(HTML) && !resourceLoad.test(HTML),
    "no fetch/XHR/CDN; outbound links are navigations only");
  check("page instantiates from embedded bytes", /WebAssembly\.instantiate/.test(HTML) &&
    /wasm-b64/.test(HTML));
  check("page drives the solver through its exports",
    /sim\.step\(/.test(HTML) && /sim\.setPhysics\(/.test(HTML) && /sim\.setSphere\(/.test(HTML));
  check("renderer requests WebGL2", /getContext\(\s*["']webgl2["']/.test(HTML));
  check("aspect + viewport are refit on resize", /addEventListener\(\s*["']resize["']/.test(HTML));
  const iterSlider = (HTML.match(/id="c-iters"[^>]*min="(\d+)"[^>]*max="(\d+)"/) || []);
  check("iteration slider matches the solver's stable range",
    iterSlider[1] === "2" && iterSlider[2] === "12", `min=${iterSlider[1]} max=${iterSlider[2]}`);

  /* ── verdict ───────────────────────────────────────────────────────────── */
  console.log(`\n${fail === 0 ? "\x1b[32m" : "\x1b[31m"}${pass}/${pass + fail} assertions passed\x1b[0m`);
  if (fail) {
    console.log("failed:\n  - " + fails.join("\n  - "));
    process.exit(1);
  }
  console.log(`wasm ${bytes.length} bytes · ${NV} vertices · ${e.getConstraintCount()} constraints · ${num(ms, 2)} ms/step`);
})().catch((err) => {
  console.error("\nharness error:", err);
  process.exit(1);
});
