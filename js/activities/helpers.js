"use strict";

// ---------- Shared helpers for the newer activities ----------
const reduceMotion = () => S.motion || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
const newRec = (title, extra) => Object.assign({ title, checks: 0, hints: 0, firstMatched: null, latestMatched: false, movedOn: false, mode: S.answer === "build" ? "build" : "choose", exampleOpened: false }, extra || {});
function praiseThen(text, label, fn) {
  currentReturnSay = currentSay = text; setSay(text);
  render(`<section class="card"><div class="feedback">${esc(text)}</div><div class="row"><button class="btn primary" id="nGo" data-focus>${esc(label)}</button></div></section>`);
  on("#nGo", fn);
}
function actionRow(ids, hint, extra) {
  return `<div class="row">
      <button class="btn primary" id="${ids.check}">${esc(ids.checkLabel)}</button>
      ${ids.hint ? `<button class="btn" id="${ids.hint}"${hint >= 2 ? " disabled" : ""}>Use a hint</button>` : ""}
      ${extra || ""}
      <button class="btn quiet" id="${ids.skip}">Move on without an answer</button></div>`;
}
