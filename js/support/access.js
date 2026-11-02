"use strict";

// ---------- 5. Single-switch scanning ----------
let scanTimer = null, scanIdx = -1;
function scanTargets() {
  const scope = $layer.firstElementChild ? $layer : document;
  return [...scope.querySelectorAll("button:not([disabled]), input, select, summary, [data-av]")].filter(el => el.offsetParent !== null);
}
function scanning(on) {
  clearInterval(scanTimer); scanTimer = null;
  document.querySelectorAll(".scan-on").forEach(e => e.classList.remove("scan-on"));
  if (!on) return;
  const ms = { slow: 3200, medium: 2200, fast: 1400 }[S.my.scanSpeed] || 2200;
  scanTimer = setInterval(() => {
    const t = scanTargets(); if (!t.length) return;
    const cur = t.indexOf(document.activeElement); scanIdx = (cur + 1) % t.length;
    document.querySelectorAll(".scan-on").forEach(e => e.classList.remove("scan-on"));
    t[scanIdx].classList.add("scan-on"); t[scanIdx].focus({ preventScroll: false });
  }, ms);
}
document.addEventListener("keydown", e => {
  if (!S.my || !S.my.scan) return;
  if (e.key === " " && document.activeElement && document.activeElement.tagName === "BUTTON") { e.preventDefault(); document.activeElement.click(); }
});

// ---------- 6. Reading ruler ----------
let rulerEl = null;
function ruler(on) {
  if (!on) { if (rulerEl) { rulerEl.remove(); rulerEl = null; } return; }
  if (rulerEl) return;
  rulerEl = document.createElement("div"); rulerEl.className = "ruler"; rulerEl.setAttribute("aria-hidden", "true"); document.body.appendChild(rulerEl);
  rulerEl.style.top = Math.round(window.innerHeight / 3) + "px";
}
const moveRuler = y => { if (rulerEl) rulerEl.style.top = Math.max(0, y - 22) + "px"; };
document.addEventListener("pointermove", e => moveRuler(e.clientY));
document.addEventListener("focusin", e => { if (rulerEl && e.target.getBoundingClientRect) { const r = e.target.getBoundingClientRect(); moveRuler(r.top + r.height / 2); } });

// ---------- 6. Light up words while a part is read ----------
function wrapWords(el) {
  if (el.dataset.wrapped) return [...el.querySelectorAll(".w")];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); const nodes = []; let n;
  while ((n = walker.nextNode())) if (n.nodeValue.trim() && !n.parentElement.closest("button")) nodes.push(n);
  nodes.forEach(t => { const f = document.createDocumentFragment(); t.nodeValue.split(/(\s+)/).forEach(part => { if (!part) return; if (/^\s+$/.test(part)) f.appendChild(document.createTextNode(part)); else { const s = document.createElement("span"); s.className = "w"; s.textContent = part; f.appendChild(s); } }); t.parentNode.replaceChild(f, t); });
  el.dataset.wrapped = "1"; return [...el.querySelectorAll(".w")];
}
function readAndLight(el, text) {
  if (S.quiet) return;
  if (!S.my.highlight) { speakSeq([text], true); return; }
  const words = wrapWords(el); const lens = words.map(w => w.textContent.length + 1); const total = lens.reduce((a, b) => a + b, 0) || 1;
  const cum = []; lens.reduce((a, l, i) => (cum[i] = a + l, a + l), 0);
  const light = frac => { const at = frac * total; let i = cum.findIndex(c => c >= at); if (i < 0) i = words.length - 1; words.forEach((w, k) => w.classList.toggle("lit", k === i)); };
  progressHook = frac => light(frac);
  boundaryHook = ci => light(Math.min(1, ci / Math.max(1, text.length)));
  const clear = () => { words.forEach(w => w.classList.remove("lit")); progressHook = boundaryHook = null; };
  speakSeq([text], true).then(() => setTimeout(() => { if (!isSpeaking()) clear(); }, 400));
  setTimeout(clear, 120000);
}
