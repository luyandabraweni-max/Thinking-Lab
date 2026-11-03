"use strict";

// ---------- Boot ----------
applySettings();
welcome();

// Offline support: register the service worker on HTTPS or localhost.
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
}
