"use strict";

// ---------- 7. Movement breaks and battery check-in ----------
const MOVES = [["🙆", "Stretch up high", "Reach your arms up high, as tall as you can. Hold, then let them float down."], ["👐", "Shake your hands", "Shake your hands loosely for a count of ten, then let them rest."], ["🧱", "Push the wall", "Put your hands flat on a wall and push hard for five seconds. Then relax."], ["🔄", "Roll your shoulders", "Roll your shoulders slowly backwards five times."], ["🐢", "Slow walk", "Walk slowly around the room, feeling each foot touch the floor."], ["🤲", "Squeeze and let go", "Make tight fists for three seconds, then open your hands wide."]];
function batteryIcon(level) { const fill = [0, 1, 2, 4][level]; return `<svg width="64" height="34" viewBox="0 0 64 34" aria-hidden="true"><rect x="2" y="4" width="54" height="26" rx="6" fill="none" stroke="var(--ink)" stroke-width="3"/><rect x="57" y="12" width="5" height="10" rx="2" fill="var(--ink)"/>${Array.from({ length: fill }, (_, i) => `<rect x="${7 + i * 12}" y="9" width="9" height="16" rx="2" fill="${level <= 1 ? "var(--gold)" : "var(--ok)"}"/>`).join("")}</svg>`; }
const BATTERY = ["Empty", "Low", "Good", "Full"];
function batteryCheck(next) {
  S.lastBattery = S.learned.length + S.played.length;
  const text = "How's your battery? How much energy do you have right now?";
  render(`<section class="card"><p class="eyebrow">Check-in</p><h1 class="as-h2">How's your battery?</h1><p class="muted">How much energy do you have right now? There is no wrong answer.</p>
      <div class="choices battery">${[3, 2, 1, 0].map(l => `<button class="choice" data-bt="${l}">${batteryIcon(l)}<span class="lbl">${BATTERY[l]}</span></button>`).join("")}</div>
      <div class="row"><button class="btn quiet" id="btSkip">Skip</button></div></section>`);
  setSay(text);
  on("#btSkip", next);
  on("[data-bt]", e => {
    const l = +e.currentTarget.dataset.bt; S.battery.push({ level: BATTERY[l], at: new Date() });
    if (l >= 2) { next(); return; }
    render(`<section class="card"><h1 class="as-h2">Thanks for telling me.</h1><p>Low energy is okay. Would you like a break first?</p>
        <div class="choices"><button class="choice" id="btBreak" data-focus>${icon("🌿")}<span class="lbl">Take a break first</span></button><button class="choice" id="btEasy">${icon("🪶")}<span class="lbl">Do a short lesson</span></button><button class="choice" id="btGo">${icon("➡️")}<span class="lbl">Keep going</span></button></div></section>`);
    setSay("Thanks for telling me. Low energy is okay. Would you like a break first?");
    on("#btBreak", () => { next(); breakScreen("Take a break. Stay as long as you like."); });
    on("#btEasy", () => { S.lessonLen = "short"; logVoice("battery", "chose shorter lessons"); next(); });
    on("#btGo", next);
  });
}
function needsBattery() { if (window.__SKIP_BATTERY__) return false; const done = S.learned.length + S.played.length; return S.lastBattery == null || done - S.lastBattery >= 2; }

// ---------- 8. My Support Passport ----------
const PASS = [
  ["strengths", "I am good at…", "💪", ["Being kind", "Being creative", "Numbers", "Remembering things", "Making people laugh", "Building things", "Being honest", "Being patient", "Animals", "Sport", "Music", "Drawing"]],
  ["learn", "I learn best when…", "🧠", ["I see pictures", "Someone reads to me", "It is quiet", "I can move", "Steps are short", "I see an example first", "I have extra time", "I can choose", "I know what comes next"]],
  ["hard", "Things that are hard for me", "⚠️", ["Loud noise", "Bright lights", "Lots of writing", "Waiting", "Sudden changes", "Crowds", "Being rushed", "Lots of words", "Being touched"]],
  ["calm", "When I'm upset, it helps to…", "🌿", ["Take a break", "Go somewhere quiet", "Breathe slowly", "Squeeze something", "Draw", "Talk to someone I trust", "Have time alone", "Move my body", "Listen to music"]],
  ["please", "Please…", "🙏", ["Give me time to answer", "Tell me before things change", "Use simple words", "Show me, don't just tell me", "Ask before touching me", "Speak calmly", "Let me use my talk board", "Check that I understood"]]
];
function passportStart() { mark("passport", passportStart); bar("child"); if (!S.passport) S.passport = {}; passportPage(0); }
function passportPage(i) {
  const [key, title, em, opts] = PASS[i]; const sel = new Set(S.passport[key] || []);
  const draw = () => {
    render(`<section class="card"><p class="eyebrow">My Support Passport · ${i + 1} of ${PASS.length}</p>
        <h1 class="as-h2">${icon(em)} ${esc(title)}</h1><p class="muted">Choose as many as you like. You can skip any of these.</p>
        <div class="choices">${opts.map((o, k) => `<button class="choice" data-ps="${k}" aria-pressed="${sel.has(o)}"><span class="lbl">${esc(o)}</span></button>`).join("")}</div>
        <div class="row"><button class="btn primary" id="psNext" data-focus>${i + 1 < PASS.length ? "Next" : "See my passport"}</button>${i > 0 ? '<button class="btn" id="psPrev">Back a page</button>' : ""}</div></section>`);
    setSayLines([title].concat(opts), false);
    on("[data-ps]", e => { const o = opts[+e.currentTarget.dataset.ps]; sel.has(o) ? sel.delete(o) : sel.add(o); S.passport[key] = [...sel]; const k = e.currentTarget.dataset.ps; draw(); const again = $main.querySelector(`[data-ps="${k}"]`); if (again) again.focus({ preventScroll: true }); });
    on("#psNext", () => i + 1 < PASS.length ? passportPage(i + 1) : passportView());
    on("#psPrev", () => passportPage(i - 1));
  };
  draw();
}
// Screen and level settings travel with the passport, so the next adult or device can set them up the same way
function screenSettings() {
  const m = S.my, out = [];
  if (m.grey) out.push("Grey screen, no colours");
  if (m.palette && m.palette !== "standard") out.push(PALETTES[m.palette]);
  if (S.contrast) out.push("Stronger outlines");
  if (m.calm) out.push("Calm screen");
  if (S.motion) out.push("No movement");
  if (S.quiet) out.push("Sound off");
  if (m.plain) out.push("Plain words");
  if (m.spacing) out.push("More space between letters");
  if (m.ruler) out.push("Reading ruler");
  if (m.scan) out.push(`Switch scanning (${m.scanSpeed})`);
  if (S.textSize > 1) out.push(S.textSize >= 1.3 ? "Largest text" : "Larger text");
  if (S.font === "lexend") out.push("Wide, easy-reading letters");
  if (S.theme !== "system") out.push(S.theme === "dark" ? "Dark screen" : "Light screen");
  out.push(`Learn level: ${gradeName(curGrade())}`);
  Object.entries(S.levels).forEach(([a, g]) => out.push(`${AREAS[a][0]}: ${gradeName(g)}`));
  return out;
}
function passportHtml() {
  const P2 = S.passport || {};
  const screen = `<div class="pp-sec"><h2 class="pp-h">${icon("🖥️")} How my screen and lessons should look</h2><ul class="plain">${screenSettings().map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>`;
  return `<div class="passport"><div class="passport-head">${avatarSvg(S.avatar, 88, S.avatar ? S.avatar.name : "Learner")}<div><p class="eyebrow">My Support Passport</p><h1 class="as-h2">${S.avatar ? esc(S.avatar.name) : "Learner " + esc(S.code)}</h1><p class="muted">What helps me learn. Made by me.</p></div></div>
      ${PASS.map(([key, title, em]) => (P2[key] || []).length ? `<div class="pp-sec"><h2 class="pp-h">${icon(em)} ${esc(title)}</h2><ul class="plain">${P2[key].map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>` : "").join("") || '<p class="muted">Nothing chosen yet.</p>'}${screen}</div>${S.badges.length ? `<div class="pp-sec"><h2 class="pp-h">${icon("🏅")} My skill badges</h2>${badgeList()}</div>` : ""}`;
}
function passportView() {
  planDone("passport"); logVoice("passport", "made or updated");
  render(`<section class="card">${passportHtml()}
      <p class="note">This passport is kept only for this session. Print it to keep a copy.</p>
      <div class="row"><button class="btn primary" id="ppPrint">Print my passport</button><button class="btn" id="ppEdit">Change it</button><button class="btn" id="ppHome" data-focus>Back to home</button></div></section>`);
  const P2 = S.passport || {};
  setSayLines(["My Support Passport."].concat(...PASS.map(([key, title]) => (P2[key] || []).length ? [title].concat(P2[key]) : []), ["How my screen and lessons should look."], screenSettings()));
  on("#ppPrint", () => window.print()); on("#ppEdit", () => passportPage(0)); on("#ppHome", home);
}

// ---------- 9. Tell us ----------
const TELL = [["😴", "Too easy"], ["😣", "Too hard"], ["😊", "I liked it"], ["🙁", "I didn't like it"], ["😕", "It was confusing"], ["🔊", "Too busy or noisy"], ["🛟", "I feel unsafe"]];
function tellButton() { return `<button class="btn small" id="tellUs">${icon("💬")}<span>Tell us</span></button>`; }
function wireTell() { on("#tellUs", openTellUs); }
function openTellUs() {
  const where = currentTitle();
  overlay(`<div class="card"><h2>Tell us</h2><p class="muted">What did you think? This helps us make the app better.</p>
      <div class="choices">${TELL.map(([e, t], i) => `<button class="choice" data-tl="${i}">${icon(e)}<span class="lbl">${t}</span></button>`).join("")}</div>
      <div class="row"><button class="btn quiet" id="tlClose" data-focus>Close</button></div></div>`);
  setSayLines(["Tell us. What did you think?"].concat(TELL.map(t => t[1])), false);
  $layer.querySelectorAll("[data-tl]").forEach(b => b.onclick = () => { const t = TELL[+b.dataset.tl][1]; S.voice.push({ kind: "tell us", what: t, where, at: new Date() }); if (t === UNSAFE) { feelUnsafe("Tell us panel"); return; }
    overlay(`<div class="card" style="text-align:center"><h2>Thank you for telling us.</h2><div class="row" style="justify-content:center"><button class="btn primary" id="tlOk" data-focus>Close</button></div></div>`); speakNow("Thank you for telling us."); document.getElementById("tlOk").onclick = closeLayer; });
  document.getElementById("tlClose").onclick = closeLayer;
}
