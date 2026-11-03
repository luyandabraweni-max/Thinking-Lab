"use strict";

// A stand-in for the browser, so the app's scripts can run without one.
// Elements found by id remember what is written to them (innerHTML, textContent), so tests can read what a screen shows.
// Everything else accepts any call and returns another stand-in.
function stub() {
  const f = function () {};
  const p = new Proxy(f, {
    get(t, k) {
      if (k === Symbol.toPrimitive) return () => "";
      if (k === Symbol.iterator) return function* () {};
      if (k === "then") return undefined;
      return p;
    },
    set() { return true; }, apply() { return p; }, construct() { return p; }, has() { return true; }
  });
  return p;
}
function element() {
  const store = {}, fallback = stub();
  return new Proxy(store, {
    get(t, k) { return k in t ? t[k] : k === Symbol.toPrimitive ? () => "" : k === Symbol.iterator ? function* () {} : k === "then" ? undefined : fallback; },
    set(t, k, v) { t[k] = v; return true; }
  });
}
const elements = {};
globalThis.window = globalThis;
globalThis.document = new Proxy({}, {
  get(t, k) {
    if (k === "getElementById") return id => elements[id] || (elements[id] = element());
    if (k === Symbol.toPrimitive) return () => "";
    if (k === "then") return undefined;
    return stub();
  }
});
globalThis.navigator = { userAgent: "test", platform: "test" };
globalThis.location = { protocol: "https:", hostname: "test", origin: "https://test", reload() {} };
globalThis.matchMedia = () => ({ matches: false, addEventListener() {} });
globalThis.addEventListener = () => {};
globalThis.setTimeout = () => 0; globalThis.clearTimeout = () => {}; globalThis.setInterval = () => 0; globalThis.clearInterval = () => {};
globalThis.scrollTo = () => {};
globalThis.__TEST__ = true;
const memoryStore = {};
globalThis.localStorage = { getItem: k => (k in memoryStore ? memoryStore[k] : null), setItem: (k, v) => { memoryStore[k] = String(v); }, removeItem: k => { delete memoryStore[k]; } };
// Blob that keeps its parts, so tests can read the bytes of generated files straight away.
globalThis.Blob = class { constructor(parts, o) { this.parts = parts; this.type = (o || {}).type; } };
globalThis.URL = { createObjectURL: () => "blob:test", revokeObjectURL() {} };
if (typeof TextEncoder === "undefined") {
  globalThis.TextEncoder = class { encode(s) { const out = []; for (const ch of s) { const c = ch.codePointAt(0); if (c < 128) out.push(c); else if (c < 2048) out.push(192 | c >> 6, 128 | c & 63); else if (c < 65536) out.push(224 | c >> 12, 128 | c >> 6 & 63, 128 | c & 63); else out.push(240 | c >> 18, 128 | c >> 12 & 63, 128 | c >> 6 & 63, 128 | c & 63); } return new Uint8Array(out); } };
}
// Bytes of a stub Blob (strings count as UTF-8, typed arrays as they are).
globalThis.blobBytes = blob => { const out = []; blob.parts.forEach(p => { const b = typeof p === "string" ? new TextEncoder().encode(p) : p; for (let i = 0; i < b.length; i++) out.push(b[i]); }); return out; };
