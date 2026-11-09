#!/usr/bin/env node
/**
 * browser_check.js — tier 2 gate: drive a real Chrome over the DevTools
 * Protocol and assert what the page actually rendered.
 *
 * No dependencies: Node's built-in fetch + global WebSocket are enough to speak
 * CDP, so the repo stays zero-install for verification. WebGL is forced through
 * SwiftShader (--enable-unsafe-swiftshader) so this runs on machines with no GPU.
 *
 * Usage:  node scripts/browser_check.js [--url=...] [--keep] [--slow]
 */
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn, spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "screenshots");
const argUrl = (process.argv.find((a) => a.startsWith("--url=")) || "").slice(6);
const URL = argUrl || "file:///" + path.join(ROOT, "index.html").replace(/\\/g, "/");

const CHROME_CANDIDATES = [
  process.env.CHROME_BIN,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
].filter(Boolean);

let pass = 0, fail = 0;
const fails = [];
function section(n) { console.log(`\n\x1b[1m${n}\x1b[0m`); }
function check(name, ok, detail) {
  console.log(`  ${ok ? "\x1b[32mPASS\x1b[0m" : "\x1b[31mFAIL\x1b[0m"}  ${name}` +
    (detail ? `  \x1b[2m${detail}\x1b[0m` : ""));
  if (ok) pass++; else { fail++; fails.push(name); }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── minimal CDP client ──────────────────────────────────────────────────── */
class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.exceptions = [];
    this.consoleErrors = [];
    this.logErrors = [];
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
        return;
      }
      if (msg.method === "Runtime.exceptionThrown") {
        const d = msg.params.exceptionDetails;
        this.exceptions.push((d.exception && d.exception.description) || d.text);
      } else if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
        this.consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description ?? a.type).join(" "));
      } else if (msg.method === "Log.entryAdded" && msg.params.entry.level === "error") {
        this.logErrors.push(msg.params.entry.text + " " + (msg.params.entry.url || ""));
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP timeout: ${method}`));
        }
      }, 30000);
    });
  }
  async eval(expr, awaitPromise = false) {
    const r = await this.send("Runtime.evaluate", {
      expression: `(() => { ${expr} })()`,
      returnByValue: true,
      awaitPromise,
    });
    if (r.exceptionDetails) {
      throw new Error("page threw: " + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
    }
    return r.result.value;
  }
  /* serialise AFTER resolution — JSON.stringify(promise) is "{}" */
  async evalAsync(expr) {
    const r = await this.send("Runtime.evaluate", {
      expression: `Promise.resolve((async () => { ${expr} })()).then(v => JSON.stringify(v))`,
      returnByValue: true,
      awaitPromise: true,
    });
    if (r.exceptionDetails) {
      throw new Error("page threw: " + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
    }
    return JSON.parse(r.result.value);
  }
  async waitFor(expr, ms = 20000, label = expr) {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      try { if (await this.eval(`return !!(${expr})`)) return true; } catch { /* page may not be ready */ }
      await sleep(100);
    }
    throw new Error(`waitFor timed out after ${ms}ms: ${label}`);
  }
  async shot(file, clip) {
    const params = { format: "png", captureBeyondViewport: !!clip };
    if (clip) params.clip = { ...clip, scale: 1 };
    const r = await this.send("Page.captureScreenshot", params);
    fs.writeFileSync(file, Buffer.from(r.data, "base64"));
    return file;
  }
}

function findChrome() {
  for (const c of CHROME_CANDIDATES) if (fs.existsSync(c)) return c;
  throw new Error("no Chrome found; set CHROME_BIN");
}

/* Kill the browser we spawned and its children, by PID only. A parent
   chrome.exe kill on Windows leaves the profile locked, and deleting a locked
   profile dir is what makes the next run die with EPERM. */
function killTree(proc) {
  if (!proc) return;
  try {
    if (process.platform === "win32") {
      spawnSync("taskkill", ["/F", "/PID", String(proc.pid), "/T"], { stdio: "ignore" });
    } else {
      proc.kill("SIGKILL");
    }
  } catch { /* already gone */ }
}

async function launch() {
  const bin = findChrome();
  // unique per launch: reusing a directory that a previous browser still holds
  // open fails with EBUSY/EPERM before the browser has done anything wrong
  const userDir = path.join(os.tmpdir(),
    `wasm-cloth-cdp-${process.pid}-${Date.now().toString(36)}`).replace(/\\/g, "/");
  const proc = spawn(bin, [
    "--headless=new",
    "--disable-gpu",
    "--enable-unsafe-swiftshader",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--disable-background-timer-throttling",
    "--remote-debugging-port=0",
    `--user-data-dir=${userDir}`,
    "--window-size=1440,900",
    "about:blank",
  ], { stdio: "ignore" });

  const portFile = path.join(userDir, "DevToolsActivePort");
  for (let i = 0; i < 120; i++) {
    if (fs.existsSync(portFile)) {
      const txt = fs.readFileSync(portFile, "utf8").split("\n");
      const port = parseInt(txt[0], 10);
      if (port > 0) return { proc, port, userDir, bin };
    }
    await sleep(100);
  }
  proc.kill();
  throw new Error("Chrome never wrote DevToolsActivePort (launch flake)");
}

async function connect(port) {
  // the about:blank page target
  let list = [];
  for (let i = 0; i < 60; i++) {
    try {
      list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page && page.webSocketDebuggerUrl) {
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((res, rej) => {
          ws.addEventListener("open", res, { once: true });
          ws.addEventListener("error", () => rej(new Error("ws error")), { once: true });
          setTimeout(() => rej(new Error("ws open timeout")), 5000);
        });
        return new CDP(ws);
      }
    } catch { /* not up yet */ }
    await sleep(100);
  }
  throw new Error("could not attach to a page target");
}

const num = (n, d = 0) => Number(n).toFixed(d);

/* ═════════════════════════════════════════════════════════════════════════ */
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  let chrome;
  for (let attempt = 1; ; attempt++) {
    try { chrome = await launch(); break; } catch (e) {
      if (attempt >= 3) throw e;
      console.log(`  \x1b[2mlaunch attempt ${attempt} failed (${e.message}), retrying…\x1b[0m`);
      await sleep(700);
    }
  }
  const cdp = await connect(chrome.port);

  const cleanup = () => {
    killTree(chrome.proc);
    // the profile dir may stay locked briefly; leave it to the cache's pruning
    setTimeout(() => { try { fs.rmSync(chrome.userDir, { recursive: true, force: true }); } catch { /* locked */ } }, 800);
  };
  process.on("exit", cleanup);

  // subscribe BEFORE navigating, or the error you need is the one you never see
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Log.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
  });
  await cdp.send("Page.navigate", { url: URL });
  await cdp.waitFor("window.ClothApp && window.ClothApp.ready", 30000, "ClothApp.ready");

  section("boot");
  const info = await cdp.eval("return window.ClothApp.info()");
  check("page title names the project", (await cdp.eval("return document.title")).includes("wasm-cloth"));
  check("WebGL2 context is live", /WebGL 2/.test(info.glVersion || ""), info.glVersion);
  check("wasm module booted from the embedded bytes", info.wasmBytes > 2000, `${info.wasmBytes} bytes`);
  check("climbs to a 72x72 grid by default", info.cols === 72 && info.verts === 5184,
    `${info.cols}² = ${info.verts} verts`);
  check("three constraint families are live in the browser",
    info.struct > 0 && info.shear > 0 && info.bend > 0,
    `structural ${info.struct} · shear ${info.shear} · bend ${info.bend} = ${info.constraints}`);
  check("no renderer banner is showing", await cdp.eval("return document.getElementById('banner').hidden"));

  const f0 = await cdp.eval("return window.ClothApp.frameCount()");
  await sleep(600);
  const f1 = await cdp.eval("return window.ClothApp.frameCount()");
  check("the requestAnimationFrame loop is actually running", f1 > f0, `${f0} → ${f1} frames in 600 ms`);

  /* ── the simulation, through the page's own hook ───────────────────────── */
  section("simulation in the browser");
  const sim1 = await cdp.eval("return window.ClothApp.advance(180)");
  check("3000 ms of simulation ran without blowing up",
    Number.isFinite(sim1.err) && sim1.err < 0.12, `constraint error ${Number(sim1.err).toExponential(2)}`);
  const contact = await cdp.eval(`
    let frames = 0, maxHits = 0;
    for (let k = 0; k < 12; k++) { const r = window.ClothApp.advance(5); if (r.hits > 0) frames++; maxHits = Math.max(maxHits, r.hits); }
    return { frames, of: 12, maxHits };
  `);
  check("cloth is in contact with the sphere", contact.frames >= 10 && contact.maxHits > 50,
    `${contact.frames}/${contact.of} sampled windows touching, up to ${contact.maxHits} vertices`);
  const radius = await cdp.eval("return window.ClothApp.state.sphereR");
  const gap = await cdp.eval("return window.ClothApp.sphereGap()");
  // the collider carries a ~12 mm skin so whole TRIANGLES stay outside the drawn
  // sphere, not just vertices: the gap must therefore be strictly greater than
  // the rendered radius, or the fabric speckles through the surface
  check("no vertex is inside the sphere", gap >= radius,
    `nearest vertex ${num(gap, 4)} from centre (r=${radius}, skin pushes it clear)`);
  const ext = await cdp.eval("return window.ClothApp.extentY()");
  check("fabric has draped into a 3D fold", ext > 0.3, `vertical extent ${num(ext, 3)} world units`);

  const nstats = await cdp.eval("return window.ClothApp.normalStats()");
  check("all normals are unit length in GPU-bound buffers", nstats.unit === nstats.n,
    `${nstats.unit}/${nstats.n}`);
  const h0 = await cdp.eval("return window.ClothApp.normalHash()");
  await cdp.eval("window.ClothApp.advance(8)");
  const h1 = await cdp.eval("return window.ClothApp.normalHash()");
  check("normal field changes when the cloth moves (lighting stays correct)", h0 !== h1,
    `${h0} → ${h1}`);

  /* ── pixels, not state ─────────────────────────────────────────────────── */
  section("what was rendered");
  await cdp.eval("window.ClothApp.setCamera({yaw:0.62,pitch:0.42,dist:5.15}); window.ClothApp.render()");
  const inkOf = () => cdp.eval(`
    const src = document.getElementById('gl');
    const c = document.createElement('canvas');
    c.width = 320; c.height = 200;
    const g = c.getContext('2d');
    g.drawImage(src, 0, 0, c.width, c.height);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let lit = 0, bright = 0, sum = 0;
    const total = c.width * c.height;
    const px = new Float32Array(total);
    for (let i = 0, p = 0; i < d.length; i += 4, p++) {
      const l = 0.2126*d[i] + 0.7152*d[i+1] + 0.0722*d[i+2];
      px[p] = l; sum += l;
      if (l > 24) lit++;
      if (l > 110) bright++;
    }
    return { lit: lit/total, bright: bright/total, mean: sum/total, px: Array.from(px) };
  `);
  const ink = await inkOf();
  check("canvas contains a lit 3D scene", ink.lit > 0.12, `${(ink.lit * 100).toFixed(1)}% of pixels above background`);
  check("lighting is not flat (shading gradient across the fabric)", ink.mean > 6 && ink.bright > 0.002,
    `mean luminance ${num(ink.mean, 1)}, ${(ink.bright * 100).toFixed(2)}% bright`);
  check("the sphere carries a specular highlight", ink.bright > 0.002, `${(ink.bright * 100).toFixed(2)}% bright pixels`);

  /* sphere on/off must change the picture: proves the obstacle is drawn */
  // Change ONLY the sphere: the auto-orbit was moving the camera between the two
  // captures, so the delta it measured was partly camera motion (measured flake:
  // 0.6 % on one run, under the threshold on another).
  await cdp.eval("window.ClothApp.setState({autoOrbit:false, paused:true}); window.ClothApp.render()");
  const withSphere = await inkOf();
  await cdp.eval("window.ClothApp.setState({sphereOn:false}); window.ClothApp.render()");
  const noSphere = await inkOf();
  // Count PIXELS THAT CHANGED, not the change in "lit" fraction. The obstacle is a
  // dark ceramic sphere: it is unmistakably on screen, but most of its pixels sit
  // below the lit threshold, so the lit-fraction delta measured 0.3-0.6 % against a
  // 0.4 % bound and flipped between runs on a correct render.
  let spherePx = 0;
  for (let i = 0; i < withSphere.px.length; i++) {
    if (Math.abs(noSphere.px[i] - withSphere.px[i]) > 8) spherePx++;
  }
  const sphereFrac = spherePx / withSphere.px.length;
  check("hiding the obstacle changes the render", sphereFrac > 0.02,
    `${(sphereFrac * 100).toFixed(1)}% of pixels changed (${(withSphere.lit * 100).toFixed(1)}% → ${(noSphere.lit * 100).toFixed(1)}% lit)`);
  await cdp.eval("window.ClothApp.setState({sphereOn:true, autoOrbit:true, paused:false})");

  /* ── UI wiring: paired views of one state must never disagree ──────────── */
  section("controls");
  await cdp.eval(`
    const el = document.getElementById('c-wind');
    el.value = '1.40';
    el.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  `);
  const windState = await cdp.eval("return window.ClothApp.state.wind");
  const windOut = await cdp.eval("return document.getElementById('o-wind').textContent");
  check("wind slider moves state and its own readout together",
    Math.abs(windState - 1.4) < 1e-6 && windOut === "1.40", `state ${windState} · readout ${windOut}`);

  await cdp.eval("window.ClothApp.setState({wind:0.55})");
  const beforeRes = await cdp.eval("return window.ClothApp.info()");
  await cdp.eval("document.querySelector('#res button[data-res=\"88\"]').click()");
  await sleep(150);
  const afterRes = await cdp.eval("return window.ClothApp.info()");
  const dom = await cdp.eval("return window.ClothApp.dom()");
  check("mesh rebuild switches to 88x88", afterRes.cols === 88 && afterRes.verts === 7744,
    `${beforeRes.cols}² → ${afterRes.cols}²`);
  check("badges, stats and the hook agree after the rebuild",
    dom.grid === "88×88" && dom.verts === "7,744" && dom.cons === afterRes.constraints.toLocaleString("en-US"),
    `${dom.grid} · ${dom.verts} verts · ${dom.cons} constraints`);

  await cdp.eval("document.querySelector('#res button[data-res=\"72\"]').click()");
  await sleep(150);
  check("mesh returns to 72x72", (await cdp.eval("return window.ClothApp.info().verts")) === 5184);

  const pin0 = await cdp.eval("return window.ClothApp.dom().pin");
  await cdp.eval("document.getElementById('b-pin').click()");
  const pinnedFrame = await cdp.eval("return window.ClothApp.pinned()");
  const pin1 = await cdp.eval("return window.ClothApp.dom().pin");
  check("pin mode toggles to a border frame", pinnedFrame === 284 && pin0 !== pin1, `${pin0} → ${pin1}`);
  await cdp.eval("document.getElementById('b-pin').click()");
  check("pin mode returns to four corners", (await cdp.eval("return window.ClothApp.pinned()")) === 16);

  await cdp.eval("window.ClothApp.setState({wire:false}); window.ClothApp.advance(240); window.ClothApp.render()");
  const solidInk = await inkOf();
  await cdp.eval("document.getElementById('b-wire').click(); window.ClothApp.render()");
  const wireInk = await inkOf();
  let changedPx = 0;
  for (let i = 0; i < solidInk.px.length; i++) if (Math.abs(wireInk.px[i] - solidInk.px[i]) > 8) changedPx++;
  check("mesh overlay actually draws lines on screen",
    (await cdp.eval("return document.getElementById('b-wire').getAttribute('aria-pressed')")) === "true" &&
    changedPx / solidInk.px.length > 0.02,
    `${(100 * changedPx / solidInk.px.length).toFixed(1)}% of pixels changed`);
  const wireShot = path.join(OUT, "mesh-wireframe.png");
  await cdp.shot(wireShot);
  await cdp.eval("document.getElementById('b-wire').click(); window.ClothApp.render()");

  await cdp.eval("document.getElementById('b-pause').click()");
  const pausedView = await cdp.eval(`
    return {
      paused: window.ClothApp.state.paused,
      text: document.getElementById('b-pause').textContent,
      aria: document.getElementById('b-pause').getAttribute('aria-pressed'),
      clock: window.ClothApp.clock(),
    };
  `);
  await sleep(500);
  const stillFrozen = await cdp.eval("return window.ClothApp.clock()");
  await cdp.eval("document.getElementById('b-pause').click()");
  const resumed = await cdp.eval(`return { paused: window.ClothApp.state.paused,
    text: document.getElementById('b-pause').textContent };`);
  check("pause button reflects its state", pausedView.paused === true && /play/i.test(pausedView.text) &&
    pausedView.aria === "true", `label "${pausedView.text}" · aria-pressed ${pausedView.aria}`);
  check("pause actually freezes the clock", stillFrozen.simTime === pausedView.clock.simTime,
    `simTime ${pausedView.clock.simTime}s → ${stillFrozen.simTime}s over 500 ms`);
  check("resume restores playback", resumed.paused === false && /pause/i.test(resumed.text),
    `label "${resumed.text}"`);

  /* ── pointer interaction ───────────────────────────────────────────────── */
  section("interaction");
  const camA = await cdp.eval("return window.ClothApp.camera()");
  await cdp.eval(`
    const cv = document.getElementById('gl');
    const r = cv.getBoundingClientRect();
    const opts = (x, y) => ({ clientX: r.left + x, clientY: r.top + y, bubbles: true,
      pointerId: 1, pointerType: 'mouse', isPrimary: true });
    cv.dispatchEvent(new PointerEvent('pointerdown', opts(r.width * 0.4, r.height * 0.5)));
    cv.dispatchEvent(new PointerEvent('pointermove', opts(r.width * 0.62, r.height * 0.42)));
    cv.dispatchEvent(new PointerEvent('pointerup', opts(r.width * 0.62, r.height * 0.42)));
    cv.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true }));
    return true;
  `);
  const camB = await cdp.eval("return window.ClothApp.camera()");
  check("drag orbits the camera", Math.abs(camB.yaw - camA.yaw) > 0.05,
    `yaw ${num(camA.yaw, 3)} → ${num(camB.yaw, 3)}`);
  check("wheel zooms", Math.abs(camB.dist - camA.dist) > 0.01, `dist ${num(camA.dist, 2)} → ${num(camB.dist, 2)}`);

  /* ── responsive layout ─────────────────────────────────────────────────── */
  section("responsive");
  for (const [w, h, label] of [[390, 844, "phone"], [320, 568, "small phone"], [1024, 768, "tablet"]]) {
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: false });
    await cdp.eval("window.dispatchEvent(new Event('resize'))");
    await sleep(220);
    const m = await cdp.eval(`
      const cv = document.getElementById('gl');
      const r = cv.getBoundingClientRect();
      const panel = document.getElementById('panel').getBoundingClientRect();
      const stats = document.getElementById('stats').getBoundingClientRect();
      const hudR = document.getElementById('hud').getBoundingClientRect().right;
      const cells = Array.from(document.querySelectorAll('#stats .cell'))
        .map(el => Math.round(el.getBoundingClientRect().bottom));
      return {
        iw: window.innerWidth, ih: window.innerHeight,
        canvasW: Math.round(r.width), canvasH: Math.round(r.height),
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        panelH: Math.round(panel.height), panelBottom: Math.round(panel.bottom),
        statsRight: Math.round(stats.right), statsBottom: Math.round(stats.bottom),
        cellBottoms: cells, hud: hudR,
      };
    `);
    const ok = m.iw === w && m.overflow <= 0 && m.canvasW === w && m.panelH > 40 &&
      m.statsRight <= w + 1 && m.hud <= w + 1;
    check(`${label} ${w}×${h} fits without overflow`, ok,
      `innerWidth ${m.iw} · canvas ${m.canvasW}×${m.canvasH} · overflow ${m.overflow}px · panel ${m.panelH}px`);
    const clipped = m.cellBottoms.filter((b) => b > m.ih + 0.5);
    check(`${label} stat strip is fully inside the viewport`, clipped.length === 0,
      clipped.length ? `cells end at ${clipped.join(",")} vs ${m.ih}px` : `lowest cell bottom ${Math.max(...m.cellBottoms)} of ${m.ih}px`);
    // screenshot at the width it claims to be: capture inside the emulation
    if (w === 390) {
      await cdp.eval("window.ClothApp.advance(120); window.ClothApp.render()");
      const freeInk = await cdp.eval(`
        const src = document.getElementById('gl');
        const panel = document.getElementById('panel').getBoundingClientRect();
        const freeH = Math.max(40, Math.round(panel.top));
        const c = document.createElement('canvas'); c.width = 200; c.height = 120;
        const g = c.getContext('2d');
        g.drawImage(src, 0, 0, src.width, freeH * (src.height / src.clientHeight), 0, 0, c.width, c.height);
        const d = g.getImageData(0, 0, c.width, c.height).data;
        let lit = 0;
        for (let i = 0; i < d.length; i += 4) {
          const l = 0.2126*d[i] + 0.7152*d[i+1] + 0.0722*d[i+2];
          if (l > 24) lit++;
        }
        return { lit: lit / (c.width * c.height), freeH };
      `);
      check("subject is framed in the uncovered area above the sheet",
        freeInk.lit > 0.05, `${(freeInk.lit * 100).toFixed(1)}% of the free ${freeInk.freeH}px strip is lit`);
      const phoneCam = await cdp.eval("return window.ClothApp.camera()");
      check("portrait framing offsets the aim point below the subject",
        phoneCam.covered > 0.2, `${(phoneCam.covered * 100).toFixed(0)}% of the viewport is covered by controls`);
      check("portrait view backs the camera off to fit the sheet",
        phoneCam.effDist > 6.5 && phoneCam.effDist > phoneCam.dist,
        `effective distance ${num(phoneCam.effDist, 2)} vs ${phoneCam.dist}`);
      await cdp.shot(path.join(OUT, "phone.png"));
    }
  }
  const phoneShot = path.join(OUT, "phone.png");
  const phoneSize = (() => {
    const b = fs.readFileSync(phoneShot);
    return `${Math.round(b.readUInt32BE(16))}×${Math.round(b.readUInt32BE(20))}`;
  })();
  check("phone screenshot is a phone-sized capture", phoneSize === "390×844", phoneSize);

  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await cdp.eval("window.dispatchEvent(new Event('resize')); window.ClothApp.setCamera({yaw:0.62,pitch:0.42,dist:5.15}); window.ClothApp.advance(240); window.ClothApp.render()");
  await sleep(200);
  const heroShot = path.join(OUT, "hero.png");
  await cdp.shot(heroShot);

  /* ── the sport: a second mode on the same wasm module ──────────────────── */
  section("sling mode");
  const freePanel = await cdp.eval("return !document.getElementById('pane-free').hidden");
  const modeOk = await cdp.eval("return window.ClothApp.mode('sling')");
  const switched = await cdp.eval(`return {
    mode: window.ClothApp.sling().mode,
    freeHidden: document.getElementById('pane-free').hidden,
    slingShown: !document.getElementById('pane-sling').hidden,
    hud: !document.getElementById('slinghud').hidden,
    hudH: document.getElementById('slinghud').getBoundingClientRect().height,
    sphereOn: window.ClothApp.state.sphereOn,
    ballOn: window.ClothApp.ball().on,
  }`);
  check("the sport is a second mode, not a replacement", freePanel && modeOk === "sling" &&
    switched.freeHidden && switched.slingShown && switched.hud && switched.hudH > 20,
    `free pane before ${freePanel ? "shown" : "hidden"} → sling pane shown, HUD ${num(switched.hudH)}px tall`);
  check("switching modes swaps the collider for the dynamic ball",
    switched.sphereOn === false && switched.ballOn === 1,
    `kinematic sphere ${switched.sphereOn ? "on" : "off"}, dynamic ball ${switched.ballOn ? "on" : "off"}`);

  await cdp.waitFor("window.ClothApp.sling().phase === 'ready'", 30000, "ball settled in the pocket");
  // Freeze before sampling: the RAF loop keeps stepping, so a sample taken a few
  // hundred ms after `ready` can catch the ball bobbing on the wind-driven sheet
  // and report motion that has nothing to do with the landing.
  await cdp.eval("window.ClothApp.setState({paused:true})");
  const settled = await cdp.eval("return { s: window.ClothApp.sling(), b: window.ClothApp.ball() }");
  await cdp.eval("window.ClothApp.setState({paused:false})");
  check("the ball drops, lands in the pocket and comes to rest there",
    settled.s.phase === "ready" && settled.b.contacts > 0 && settled.b.speed < 0.4,
    `y ${num(settled.b.y, 3)}, ${settled.b.contacts} vertices in contact, speed ${num(settled.b.speed, 3)} u/s`);

  /* a real pointer drag on an anchor handle must move the module's pin */
  const drag = await cdp.eval(`
    const a = window.ClothApp.anchorScreen(0);
    const cv = document.getElementById('gl');
    const opts = (x, y) => ({ clientX: x, clientY: y, bubbles: true, pointerId: 7, pointerType: 'mouse', isPrimary: true });
    window.__pre = { anchor: window.ClothApp.anchors()[0], pos: window.ClothApp.positions() };
    if (!a) return { err: 'no projection' };
    cv.dispatchEvent(new PointerEvent('pointerdown', opts(a.x, a.y)));
    cv.dispatchEvent(new PointerEvent('pointermove', opts(a.x + 150, a.y + 86)));
    return { press: { x: Math.round(a.x), y: Math.round(a.y) }, phase: window.ClothApp.sling().phase };
  `);
  await cdp.eval("window.ClothApp.advance(70)");
  const dragState = await cdp.eval(`
    const post = window.ClothApp.anchors()[0];
    const pos = window.ClothApp.positions();
    let moved = 0;
    for (let i = 0; i < pos.length; i++) if (Math.abs(pos[i] - window.__pre.pos[i]) > 1e-4) moved++;
    return {
      before: window.__pre.anchor, after: post, moved, of: pos.length,
      gain: window.ClothApp.sling().gain,
      power: getComputedStyle(document.getElementById('powerwrap')).opacity,
      barW: document.getElementById('powerfill').style.width,
    };
  `);
  const anchorDelta = Math.hypot(dragState.after[0] - dragState.before[0],
    dragState.after[1] - dragState.before[1], dragState.after[2] - dragState.before[2]);
  check("dragging an anchor moves that anchor inside the module", anchorDelta > 0.05,
    `anchor 0 moved ${num(anchorDelta, 3)} world units from (${dragState.before.map((v) => num(v, 2)).join(",")})`);
  check("the drag deforms the fabric that is uploaded to the GPU", dragState.moved > 0,
    `${dragState.moved}/${dragState.of} sampled vertex components changed`);
  check("the charge meter reports the draw", dragState.gain > 0.2 && dragState.barW !== "0%",
    `gain ${num(dragState.gain, 2)} → meter ${dragState.barW}`);

  /* release and catch the ball in the air */
  await cdp.eval("document.getElementById('gl').dispatchEvent(new PointerEvent('pointerup',{clientX:200,clientY:200,bubbles:true,pointerId:7,pointerType:'mouse',isPrimary:true})); return 1;");
  let airborne = null;
  for (let i = 0; i < 40; i++) {
    await cdp.eval("window.ClothApp.advance(4)");
    const b = await cdp.eval("return { b: window.ClothApp.ball(), phase: window.ClothApp.sling().phase }");
    if (b.phase === "flight" && b.b.contacts === 0 && b.b.speed > 0.6) { airborne = b; break; }
  }
  check("releasing the draw throws the ball out of the sheet", !!airborne,
    airborne ? `ball at (${num(airborne.b.x, 2)}, ${num(airborne.b.y, 2)}, ${num(airborne.b.z, 2)}) moving ${num(airborne.b.speed, 2)} u/s, no contact` : "ball never left the fabric");
  await cdp.eval("window.ClothApp.render()");
  const flightShot = path.join(OUT, "sling-flight.png");
  await cdp.shot(flightShot);

  /* a deterministic full-power shot must score, and the HUD must agree */
  const shot1 = await cdp.eval("return window.ClothApp.slingShoot(0.6, 0)");
  const after1 = await cdp.eval("return { s: window.ClothApp.sling(), dom: window.ClothApp.slingScores() }");
  check("a full-power draw lands the ball in the target", shot1.hit === true,
    `target distance ${num(shot1.err, 3)} vs radius ${num(after1.s.target.r, 2)}`);
  check("the score readout and the hook agree after a hit",
    after1.dom.score === String(after1.s.score) && after1.dom.panelScore === String(after1.s.score) &&
    after1.dom.balls === String(after1.s.balls),
    `hook score ${after1.s.score} · HUD "${after1.dom.score}" · panel "${after1.dom.panelScore}" · balls "${after1.dom.balls}"`);
  await cdp.eval("window.ClothApp.render()");
  const hitShot = path.join(OUT, "sling-hit.png");
  await cdp.shot(hitShot);

  /* three balls, then the run ends with a rendered score */
  await cdp.eval("window.ClothApp.slingReset()");
  const run = [];
  for (let i = 0; i < 3; i++) run.push(await cdp.eval("return window.ClothApp.slingShoot(0.6, 0)"));
  const endState = await cdp.eval("return { s: window.ClothApp.sling(), dom: window.ClothApp.slingScores() }");
  check("a full run consumes exactly three balls and ends",
    run.map((r) => r.balls).join(",") === "2,1,0" && endState.s.phase === "over" && endState.s.balls === 0,
    `balls after each shot ${run.map((r) => r.balls).join(" → ")}, phase "${endState.s.phase}"`);
  const acc = endState.s.shots ? endState.s.hits / endState.s.shots : 0;
  check("the score is hits + accuracy, and it is rendered in the DOM",
    Number(endState.dom.score) === endState.s.score &&
    endState.s.score === endState.s.hitPts + Math.round(acc * 100) && Number(endState.dom.score) > 0,
    `${endState.s.hits}/${endState.s.shots} hits · combo points ${endState.s.hitPts} + accuracy ${Math.round(acc * 100)} = ${endState.s.score} (HUD "${endState.dom.score}")`);

  /* back to free play: the demo must be exactly what it was */
  await cdp.eval("window.ClothApp.mode('free')");
  await cdp.eval("window.ClothApp.advance(120); window.ClothApp.render()");
  const backState = await cdp.eval(`return {
    mode: window.ClothApp.sling().mode,
    freeShown: !document.getElementById('pane-free').hidden,
    slingHidden: document.getElementById('pane-sling').hidden,
    hudHidden: document.getElementById('slinghud').hidden,
    ballOn: window.ClothApp.ball().on,
    sphereOn: window.ClothApp.state.sphereOn,
    verts: window.ClothApp.info().verts,
    hits: window.ClothApp.hitCount(),
  }`);
  check("free play is reachable again and unchanged", backState.mode === "free" && backState.freeShown &&
    backState.slingHidden && backState.hudHidden && backState.ballOn === 0 && backState.sphereOn === true &&
    backState.verts === 5184 && backState.hits > 0,
    `ball off, sphere on, ${backState.verts} verts, ${backState.hits} contacts — the shipped demo still runs`);

  /* ── console hygiene ───────────────────────────────────────────────────── */
  section("console");
  const exceptions = cdp.exceptions.filter((e) => !/favicon/i.test(e));
  check("no uncaught exceptions for the whole session", exceptions.length === 0,
    exceptions.slice(0, 2).join(" | ") || "clean");
  const consoleErr = cdp.consoleErrors.filter((e) => !/favicon/i.test(e));
  check("no console errors", consoleErr.length === 0, consoleErr.slice(0, 2).join(" | ") || "clean");
  const logErr = cdp.logErrors.filter((e) => !/favicon/i.test(e));
  check("no network/log errors", logErr.length === 0, logErr.slice(0, 2).join(" | ") || "clean");

  section("screenshots");
  for (const f of [heroShot, wireShot, phoneShot, flightShot, hitShot]) {
    console.log(`  ${path.relative(ROOT, f)}  \x1b[2m${(fs.statSync(f).size / 1024).toFixed(0)} KB\x1b[0m`);
  }

  console.log(`\n${fail === 0 ? "\x1b[32m" : "\x1b[31m"}${pass}/${pass + fail} assertions passed\x1b[0m`);
  if (fail) {
    console.log("failed:\n  - " + fails.join("\n  - "));
    cleanup();
    process.exit(1);
  }
  cleanup();
})().catch((err) => {
  console.error("\nharness error:", err && err.message ? err.message : err);
  process.exit(1);
});
