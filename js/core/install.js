"use strict";

// ---------- Install as an app ----------
let installPrompt = null;
const isStandalone = () => (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
const isApple = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
function renderInstall() {
  const slot = document.getElementById("installSlot"); if (!slot) return;
  if (isStandalone()) { slot.innerHTML = ""; return; }
  if (installPrompt) {
    slot.innerHTML = `<div class="row note demo-flag"><span style="flex:1 1 220px">Install the Thinking Lab on this device. It opens full screen and works without internet.</span><button class="btn small" id="bInstall">Install the app</button></div>`;
    document.getElementById("bInstall").onclick = async () => { const p = installPrompt; installPrompt = null; try { p.prompt(); await p.userChoice; } catch (e) {} renderInstall(); };
  } else if (isApple()) {
    slot.innerHTML = `<p class="note demo-flag">To install on an iPhone or iPad: open this page in Safari, tap the Share button, then tap Add to Home Screen.</p>`;
  } else slot.innerHTML = "";
}
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installPrompt = e; renderInstall(); });
window.addEventListener("appinstalled", () => { installPrompt = null; renderInstall(); });
