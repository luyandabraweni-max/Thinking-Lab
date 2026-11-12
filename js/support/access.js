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

// ---------- 7. Choose by resting the pointer (dwell) ----------
// For eye-gaze and head pointers, which move the pointer but can't easily click: resting on a button for a moment chooses it.
// A bar fills to show the time left. After a choice, nothing more is chosen until the pointer moves away, so a new screen
// under a still pointer is never tapped by accident. Touch is left alone: a tap already chooses.
const DWELL_MS = { slow: 2000, medium: 1400, fast: 900 }, DWELL_TARGETS = "button:not([disabled]), summary, [data-av], input[type=checkbox], input[type=radio]";
let dwellEl = null, dwellTimer = null, dwellHold = null;
function dwellStop() { clearTimeout(dwellTimer); if (dwellEl) dwellEl.classList.remove("dwelling"); dwellEl = null; }
document.addEventListener("pointermove", e => {
  if (!S.my || !S.my.dwell || e.pointerType === "touch") { if (dwellEl) dwellStop(); return; }
  if (dwellHold) { if (Math.hypot(e.clientX - dwellHold[0], e.clientY - dwellHold[1]) < 40) return; dwellHold = null; }
  const t = e.target.closest ? e.target.closest(DWELL_TARGETS) : null;
  if (t === dwellEl) return;
  dwellStop(); if (!t) return;
  const ms = DWELL_MS[S.my.dwellSpeed] || DWELL_MS.medium, at = [e.clientX, e.clientY];
  dwellEl = t; t.style.setProperty("--dwell", ms + "ms"); t.classList.add("dwelling");
  dwellTimer = setTimeout(() => { dwellStop(); dwellHold = at; if (t.isConnected) t.click(); }, ms);
});
document.addEventListener("pointerleave", dwellStop);

// ---------- 8. Answer by speaking ----------
// Off unless an adult turns it on: the browser turns speech into words, and some browsers send the sound to their
// maker (Google or Apple) to do it. 2to.iQ never records or keeps the sound. It is only ever an extra way to answer.
const Recog = window.SpeechRecognition || window.webkitSpeechRecognition;
const canListen = () => !!(Recog && S.my && S.my.voiceIn);
function listenOnce(done) {
  let r; try { r = new Recog(); } catch (e) { done(null); return; }
  r.lang = "en-ZA"; r.interimResults = false; r.maxAlternatives = 3;
  let heard = false;
  r.onresult = e => { heard = true; done([...e.results[0]].map(a => a.transcript)); };
  r.onerror = () => { if (!heard) { heard = true; done(null); } };
  r.onend = () => { if (!heard) { heard = true; done([]); } };
  stopSpeaking(); try { r.start(); } catch (e) { done(null); }
}
// Spoken numbers: "12", "twelve", "twenty three", "three point five"
const NUM_WORDS = { zero: 0, nought: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
function spokenNumber(s) {
  const t = String(s).toLowerCase().replace(/,/g, ".").replace(/-/g, " ");
  const d = t.match(/-?\d+(\.\d+)?/); if (d) return d[0].replace(".", ",");
  let n = null, frac = "", afterPoint = false;
  for (const w of t.split(/\s+/)) {
    if (w === "point" || w === "comma") { afterPoint = true; continue; }
    if (w === "hundred" && n != null) { n *= 100; continue; }
    if (!(w in NUM_WORDS)) continue;
    if (afterPoint) frac += NUM_WORDS[w]; else n = (n || 0) + NUM_WORDS[w];
  }
  return n == null ? null : String(n) + (frac ? "," + frac : "");
}
// Which shown option the learner said: by its words, or by its place ("the first one", "number two", "B").
function matchSpoken(heard, options, shown) {
  const clean = s => " " + String(s).toLowerCase().replace(/[^a-z0-9,]+/g, " ").trim() + " ";
  const places = [["first", "one", "a", "1"], ["second", "two", "b", "2"], ["third", "three", "c", "3"], ["fourth", "four", "d", "4"]];
  for (const h of heard || []) {
    const said = clean(h);
    let i = shown.find(k => clean(options[k]) === said); if (i != null) return i;
    i = shown.find(k => said.includes(clean(options[k]))); if (i != null) return i;
    const num = spokenNumber(h); if (num != null) { i = shown.find(k => norm(options[k]) === norm(num)); if (i != null) return i; }
    const p = places.findIndex(ws => ws.some(w => new RegExp(`\\b(the )?${w}( one)?\\b`).test(said.trim()) && said.trim().split(" ").length <= 3)); if (p >= 0 && shown[p] != null) return shown[p];
  }
  return null;
}
