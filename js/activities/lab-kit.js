"use strict";

// ---------- Thinking Lab kit: shared pieces for the Thinking Lab games ----------
// Every game: no timer, up to 3 hints (least to most specific), moving on without penalty, a reflection that can be
// chosen or drawn, and a record of HOW the learner worked (tests, changes, predictions), not only the answer.
function labSay(text) { currentReturnSay = currentSay = text; setSay(text); }
function labHead(run, step) { return `<p class="eyebrow">${esc(run.x.name)}${step ? " · " + esc(step) : ""}</p>`; }
function hintHtml(o) { return o.hint ? `<div class="hint"><b>Hint ${o.hint} of ${o.hints.length}.</b> ${esc(o.hints[o.hint - 1])}</div>` : ""; }
// The row under a task: the main action, a hint while any are left, extras, and moving on.
function labRow(o, main, extra) {
  return `<div class="row">${main ? `<button class="btn primary" id="${main[0]}"${main[2] ? " disabled" : ""}>${main[1]}</button>` : ""}
      ${o && o.hints ? `<button class="btn" id="lkHint"${o.hint >= o.hints.length ? " disabled" : ""}>${o.hint ? "Another hint" : "Use a hint"}</button>` : ""}
      ${extra || ""}
      ${o && o.skip !== false ? `<button class="btn quiet" id="lkSkip">Move on without an answer</button>` : ""}</div>`;
}
function wireHints(o, rec, redraw) {
  on("#lkHint", () => { o.hint = Math.min(o.hints.length, o.hint + 1); rec.hints = o.hint; redraw(); speakNow(o.hints[o.hint - 1]); });
}
// A game is still on screen (the learner hasn't left it), so a delayed frame may draw.
const labAlive = run => inGame && activeX === run.x;
let labTimer = null;
// Plays frames one after another, or jumps to the last one when movement is off.
function playFrames(run, n, ms, frame, done) {
  clearTimeout(labTimer);
  if (reduceMotion() || n <= 1) { frame(n - 1, true); done(); return; }
  let i = 0;
  const tick = () => { if (!labAlive(run)) return; frame(i, i === n - 1); i++; labTimer = setTimeout(i < n ? tick : () => labAlive(run) && done(), ms); };
  tick();
}
// Reflection: choose an answer, or draw it instead.
function labReflect(run, question, options, done) {
  labSay(question + " " + options.join(". ") + ".");
  render(`<section class="card">${labHead(run, "Think back")}<h2>${esc(question)}</h2>
      <div class="choices">${options.map((o, i) => `<button class="choice" data-r="${i}"${i === 0 ? " data-focus" : ""}><span class="lbl">${esc(o)}</span></button>`).join("")}</div>
      <div class="row"><button class="btn" id="lkDraw">${icon("🎨")}<span>Draw it instead</span></button></div></section>`);
  on("[data-r]", e => done(options[+e.currentTarget.dataset.r]));
  on("#lkDraw", () => drawPad(question, "Draw anything you like. There is no right answer.", strokes => done(strokes ? "Drew a picture" : "Chose to draw, left it blank")));
}
// Starts a game: the leave-the-game hook stops any animation still playing.
function labStart(run) { activeEx = { abort: () => clearTimeout(labTimer) }; run.acted = false; }
const pick = a => a[Math.floor(Math.random() * a.length)];
