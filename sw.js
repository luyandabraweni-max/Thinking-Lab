// 2to.iQ Thinking Lab offline cache. The app is cached on install; each lesson's voice file is cached the first time that lesson is opened. The app stores no learner records.
const CACHE = "thinking-lab-7bb6e27795";
const FILES = ["./", "index.html", "clips.js", "manifest.webmanifest", "fonts/atkinson-hyperlegible-latin-400-normal.woff2", "fonts/atkinson-hyperlegible-latin-700-normal.woff2", "fonts/lexend-latin-400-normal.woff2", "fonts/lexend-latin-500-normal.woff2", "fonts/lexend-latin-600-normal.woff2", "icons/apple-touch-icon.png", "icons/favicon-32.png", "icons/icon-192-maskable.png", "icons/icon-192.png", "icons/icon-512-maskable.png", "icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("thinking-lab-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.match(r, { ignoreSearch: r.mode === "navigate" }).then(hit => hit || (r.mode === "navigate" ? caches.match("index.html") : null)).then(hit => hit || fetch(r).then(res => { if (res.ok && new URL(r.url).pathname.includes("/clips/")) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); } return res; })));
});
