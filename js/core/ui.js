"use strict";

// ---------- Helpers ----------
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function el(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
function render(html) { if (typeof savePortal === "function") savePortal(); $main.innerHTML = html; mainHeading(); $main.scrollTop = 0; window.scrollTo(0, 0); const f = $main.querySelector("[data-focus]"); if (f) f.focus({ preventScroll: true }); }
function on(sel, fn) { $main.querySelectorAll(sel).forEach(n => n.addEventListener("click", fn)); }
function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
const speakerIcon = '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';

function applySettings() {
  if (S.my && typeof applyMyWay === "function") setTimeout(applyMyWay, 0);
  if (S.theme === "system") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", S.theme);
  if (S.contrast) root.setAttribute("data-contrast", "high"); else root.removeAttribute("data-contrast");
  if (S.motion) root.setAttribute("data-motion", "reduce"); else root.removeAttribute("data-motion");
  updateMotion();
  root.toggleAttribute("data-grey", !!(S.my && S.my.grey));
  root.setAttribute("data-font", S.font);
  root.style.setProperty("--text", (1.15 * S.textSize).toFixed(2) + "rem");
}

function bar(mode) {
  // mode: "adult" | "child" | "exercise"
  let html = "";
  if (mode !== "adult" && trail.length > 1) html += `<button class="btn small" id="bBack" aria-label="Go back"><span class="em" aria-hidden="true">⬅️</span><span>Back</span></button>`;
  if (mode !== "adult" && (S.need || S.played.length)) html += `<button class="btn small" id="bHome" aria-label="Go to home"><span class="em" aria-hidden="true">🏠</span><span>Home</span></button>`;
  if (mode !== "adult") html += `<button class="btn small" id="bRead" aria-label="Read this aloud"${S.quiet ? " disabled" : ""}>${speakerIcon}<span>Read<span class="wide-only"> aloud</span></span></button>`;
  if (mode !== "adult") html += `<button class="btn small" id="bSound" aria-pressed="${S.quiet}"><span class="em" aria-hidden="true">${S.quiet ? "🔇" : "🔊"}</span><span>${S.quiet ? "Sound off" : "Sound on"}</span></button>`;
  if (mode !== "adult") html += `<button class="btn small" id="bTalk">${icon("💬")}<span>Talk</span></button>`;
  if (mode !== "adult") html += `<button class="btn small" id="bMyWay">${icon("⚙️")}<span>My way</span></button>`;
  if (mode === "child" || mode === "exercise") html += `<button class="btn small" id="bHelp"><span class="em" aria-hidden="true">🙋</span><span>Help</span></button>`;
  if (mode === "exercise") html += `<button class="btn small" id="bPause"><span class="em" aria-hidden="true">⏸️</span><span>Pause</span></button>`;
  if (mode !== "adult") html += `<button class="btn small quiet" id="bAdult" title="Hold for 2 seconds">Grown-up</button>`;
  $bar.innerHTML = html;
  const r = document.getElementById("bRead"); if (r) r.onclick = () => { try { if (isSpeaking()) { stopSpeaking(); return; } } catch (e) {} if (currentSayLines) speakSeq(currentSayLines, true); else speakNow(currentSay); };
  const bk = document.getElementById("bBack"); if (bk) bk.onclick = goBack;
  const hm = document.getElementById("bHome"); if (hm) hm.onclick = goHome;
  const sd = document.getElementById("bSound"); if (sd) sd.onclick = () => { S.quiet = !S.quiet; if (S.quiet) stopSpeaking(); bar(mode); };
  const h = document.getElementById("bHelp"); if (h) h.onclick = openHelp;
  barMode = mode; const tk = document.getElementById("bTalk"); if (tk) tk.onclick = openTalk; const mw = document.getElementById("bMyWay"); if (mw) mw.onclick = openMyWay;
  const p = document.getElementById("bPause"); if (p) p.onclick = openPause;
  const a = document.getElementById("bAdult"); if (a) holdToOpen(a, openAdult);
}

function holdToOpen(btn, fn) {
  let t = null;
  const start = e => { e.preventDefault(); btn.textContent = "Keep holding..."; t = setTimeout(() => { btn.textContent = "Grown-up"; fn(); }, 1600); };
  const cancel = () => { if (t) { clearTimeout(t); t = null; } btn.textContent = "Grown-up"; };
  btn.addEventListener("pointerdown", start);
  ["pointerup", "pointerleave", "pointercancel"].forEach(ev => btn.addEventListener(ev, cancel));
  btn.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); } });
}

// ---------- Back and Home ----------
const trail = []; let inGame = false; let activeX = null;
function mark(key, fn) { if (!trail.length || trail[trail.length - 1].key !== key) trail.push({ key, fn }); }
function confirmLeave(then) {
  overlay(`<div class="card"><h2>Leave this ${gameWord()}?</h2><p>You can come back to it any time.</p>
      <div class="row"><button class="btn" id="lvStay" data-focus>Stay in the ${gameWord()}</button><button class="btn primary" id="lvGo">Leave</button></div></div>`);
  document.getElementById("lvStay").onclick = closeLayer;
  document.getElementById("lvGo").onclick = () => { closeLayer(); inGame = false; stopSpeaking(); then(); };
}
function goBack() {
  if (inGame && activeUnit) { confirmLeave(() => unitIntro(activeUnit)); return; }
  if (inGame && activeX) { confirmLeave(() => startExercise(activeX)); return; }
  stopSpeaking();
  if (trail.length > 1) { trail.pop(); const prev = trail.pop(); prev.fn(); }
}
function goHome() {
  if (inGame) { confirmLeave(home); return; }
  stopSpeaking(); home();
}

// ---------- Overlays ----------
function closeLayer() { $layer.innerHTML = ""; }
// Every screen gets one main heading; a screen whose title is styled as h2 keeps that size.
function mainHeading() {
  if ($main.querySelector("h1")) return;
  const h = $main.querySelector("h2"); if (!h) return;
  const h1 = document.createElement("h1"); h1.className = "as-h2"; h1.innerHTML = h.innerHTML;
  for (const a of h.attributes) if (a.name !== "class") h1.setAttribute(a.name, a.value);
  h.replaceWith(h1);
}
function overlay(html) {
  $layer.innerHTML = `<div class="overlay" role="dialog" aria-modal="true">${html}</div>`;
  const dlg = $layer.firstElementChild, t = dlg.querySelector("h1, h2");
  if (t) { t.id = t.id || "dlgTitle"; dlg.setAttribute("aria-labelledby", t.id); } else dlg.setAttribute("aria-label", "Message");
  const f = $layer.querySelector("[data-focus]"); if (f) f.focus();
  return $layer;
}
function openHelp() {
  const text = "What would help right now? You can take a quiet break, breathe slowly, or show your help card to a grown-up.";
  setSay(text);
  overlay(`<div class="card">
      <h2>What would help right now?</h2>
      <div class="choices">
        <button class="choice" data-h="break" data-focus><span class="lbl">I need a quiet break</span></button>
        <button class="choice" data-h="breathe"><span class="lbl">Breathe slowly</span></button>
        <button class="choice" data-h="card"><span class="lbl">Show my help card</span></button>
        <button class="choice" data-h="unsafe"><span class="lbl">I feel unsafe</span></button>
      </div>
      <p class="muted">You can always stop and ask a grown-up.</p>
      <div class="row"><button class="btn" id="hClose">Back</button></div>
    </div>`);
  $layer.querySelectorAll("[data-h]").forEach(b => b.onclick = () => {
    const k = b.dataset.h;
    if (k === "unsafe") feelUnsafe("Help menu"); else if (k === "card") helpCard(); else breakScreen(k === "breathe" ? "Let's breathe slowly together." : "Take a quiet break. Stay as long as you like.");
  });
  document.getElementById("hClose").onclick = () => { closeLayer(); setSay(currentReturnSay, false); };
}
let currentReturnSay = "";
function helpCard() {
  setSay("I would like some help, please.");
  overlay(`<div class="card" style="text-align:center">
      <p class="eyebrow">Show this to a grown-up</p>
      <h1>I would like some help, please.</h1>
      <div class="row" style="justify-content:center"><button class="btn primary" id="hcDone" data-focus>Done</button></div>
    </div>`);
  document.getElementById("hcDone").onclick = closeLayer;
}
function breakScreen(text) {
  setSay(text + " Breathe in slowly. Breathe out slowly. Press I'm ready when you want to carry on.");
  overlay(`<div class="card" style="text-align:center">
      <h2>${esc(text)}</h2>
      <div class="breathe" aria-hidden="true">Breathe</div>
      <p>Breathe in slowly. Breathe out slowly.</p>
      <p class="eyebrow">Or try a movement</p>
      <div class="choices moves">${MOVES.map(([e, t], i) => `<button class="choice" data-mv="${i}">${icon(e)}<span class="lbl">${t}</span></button>`).join("")}</div>
      <p class="move-say" role="status"></p>
      <div class="row" style="justify-content:center"><button class="btn primary" id="bkDone" data-focus>I'm ready</button></div>
    </div>`);
  $layer.querySelectorAll("[data-mv]").forEach(b => b.onclick = () => { const m = MOVES[+b.dataset.mv]; $layer.querySelector(".move-say").textContent = m[2]; speakNow(m[2]); logVoice("movement break", m[1]); });
  document.getElementById("bkDone").onclick = () => { closeLayer(); planDone("brk"); };
}
function openPause() {
  setSay("Paused. Take your time. You can carry on, take a quiet break, or stop for today.");
  overlay(`<div class="card">
      <h2>Paused. Take your time.</h2>
      <div class="choices">
        <button class="choice" id="pGo" data-focus><span class="lbl">Carry on</span></button>
        <button class="choice" id="pBreak"><span class="lbl">Quiet break</span></button>
        <button class="choice" id="pStop"><span class="lbl">Stop for today</span></button>
      </div>
    </div>`);
  document.getElementById("pGo").onclick = closeLayer;
  document.getElementById("pBreak").onclick = () => breakScreen("Take a quiet break. Stay as long as you like.");
  document.getElementById("pStop").onclick = () => { closeLayer(); if (activeEx && activeEx.abort) activeEx.abort(); goodbye(); };
}
