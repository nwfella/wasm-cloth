#!/usr/bin/env node
/**
 * build.js — compile src/cloth.ts to WebAssembly, then inline the module into
 * index.html as base64.
 *
 * Inlining is not cosmetic: a page opened over file:// has origin "null", and
 * fetch()/instantiateStreaming() of a sibling .wasm is blocked by CORS. Bytes
 * embedded in the document are the only way a single file stays portable, and
 * it keeps the repo's "one file, no build step to view it" promise.
 *
 * Idempotent: rebuilding replaces the payload between the WASM-B64 markers and
 * leaves the rest of index.html untouched.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src", "cloth.ts");
const OUT_WASM = path.join(ROOT, "build", "cloth.wasm");
const OUT_WAT = path.join(ROOT, "build", "cloth.wat");
const HTML = path.join(ROOT, "index.html");
const ASC = path.join(ROOT, "node_modules", "assemblyscript", "bin", "asc.js");

const START = "<!--WASM-B64-->";
const END = "<!--/WASM-B64-->";

function build() {
  if (!fs.existsSync(ASC)) {
    console.error("assemblyscript not installed — run: npm install");
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(OUT_WASM), { recursive: true });

  const args = [
    ASC, SRC,
    "-O3", "--runtime", "stub", "--noAssert",
    "-o", OUT_WASM, "--textFile", OUT_WAT,
  ];
  execFileSync(process.execPath, args, { stdio: "inherit", cwd: ROOT });

  const bytes = fs.readFileSync(OUT_WASM);
  const b64 = bytes.toString("base64");

  const html = fs.readFileSync(HTML, "utf8");
  const a = html.indexOf(START);
  const b = html.indexOf(END);
  if (a < 0 || b < 0) throw new Error("index.html is missing the WASM-B64 markers");
  const before = html.slice(0, a + START.length);
  const after = html.slice(b);
  const block = `<script id="wasm-b64" type="text/plain">${b64}</script>`;
  const next = before + block + after;

  // keep line endings stable so the shipped bytes hash-match the committed blob
  fs.writeFileSync(HTML, next.replace(/\r\n/g, "\n"), "utf8");

  // sanity: the module must validate and export the solver entry point
  WebAssembly.validate(bytes) ||
    (() => { throw new Error("emitted bytes are not a valid wasm module"); })();
  const exportsUsed = WebAssembly.Module.exports(new WebAssembly.Module(bytes)).map((e) => e.name);
  for (const need of ["init", "step", "setPhysics", "setSphere", "computeNormals", "posPtr", "normPtr", "idxPtr", "memory"]) {
    if (!exportsUsed.includes(need)) throw new Error(`wasm module is missing export: ${need}`);
  }

  const kb = (bytes.length / 1024).toFixed(2);
  console.log(`\n  build/cloth.wasm   ${bytes.length} bytes (${kb} KB)`);
  console.log(`  index.html         inlined ${b64.length} base64 chars`);
  console.log(`  exports            ${exportsUsed.length} (init/step/setPhysics/… verified)`);
}

build();
