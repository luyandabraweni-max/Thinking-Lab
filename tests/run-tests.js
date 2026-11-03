"use strict";

// Runs the app's scripts in the order index.html loads them, then the tests in tests/app.test.js.
// Node (CI):            node tests/run-tests.js [folder for sample reports]
// macOS JavaScriptCore: jsc tests/run-tests.js -- [folder]   (sample reports are printed as hex lines starting "@@FILE")
const isNode = typeof process !== "undefined" && !!(process.versions && process.versions.node);
const outDir = isNode ? process.argv[2] : (typeof arguments !== "undefined" ? arguments[0] : undefined);
const read = isNode ? f => require("fs").readFileSync(f, "utf8") : f => readFile(f);
const scripts = ["tests/stub-dom.js", "clips.js"].concat([...read("index.html").matchAll(/<script src="(js\/[^"]+)"/g)].map(m => m[1]), "tests/app.test.js");

let run, ctx;
if (isNode) {
  const vm = require("vm"), fs = require("fs"), path = require("path");
  ctx = vm.createContext({ console, TextEncoder });
  ctx.saveFile = (name, bytes) => { if (!outDir) return; fs.mkdirSync(outDir, { recursive: true }); fs.writeFileSync(path.join(outDir, name), Buffer.from(bytes)); };
  ctx.print = (...a) => console.log(...a);
  run = f => vm.runInContext(read(f), ctx, { filename: f });
} else {
  globalThis.saveFile = (name, bytes) => { if (outDir) print("@@FILE " + name + " " + bytes.map(b => (b < 16 ? "0" : "") + b.toString(16)).join("")); };
  run = f => load(f);
}
let failed = false;
for (const f of scripts) {
  try { run(f); } catch (e) { (isNode ? console.log : print)(`FAIL  could not load ${f}: ${e && e.stack || e}`); failed = true; break; }
}
const result = isNode ? ctx.__testResult : globalThis.__testResult;
if (failed || !result || result.failed) {
  if (isNode) process.exit(1); else throw new Error("tests failed");
}
