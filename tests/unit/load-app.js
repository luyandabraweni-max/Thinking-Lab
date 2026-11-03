// Loads the real app into jsdom: the page shell from index.html, then every script in the order index.html lists them.
// The scripts are plain (non-module) scripts sharing one global scope, so they are run in the window, not imported.
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const html = readFileSync("index.html", "utf8");
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);

export function loadApp() {
  const dom = new JSDOM(html.replace(/<script[^>]*><\/script>/g, ""), { url: "http://localhost/", runScripts: "dangerously", pretendToBeVisual: true });
  const w = dom.window;
  w.__SKIP_BATTERY__ = true;
  // Real <script> elements, so each file runs as a classic script exactly as in the browser
  for (const src of scripts) { const s = w.document.createElement("script"); s.textContent = readFileSync(src, "utf8"); w.document.body.appendChild(s); }
  // Top-level const and let live in the script scope, not on window, so tests reach them through eval.
  return { window: w, run: code => w.eval(code), main: () => w.document.getElementById("main").innerHTML };
}

export { scripts };
