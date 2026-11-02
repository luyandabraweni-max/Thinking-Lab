"use strict";

// ---------- Learn ----------
let activeUnit = null;
const SUBJECTS = ["Mathematics", "English Home Language", "Natural Sciences and Technology", "Life Skills"];
function nextUnit() {
  const done = new Set(S.learned);
  const list = myUnits().filter(u => !done.has(u.id));
  return list.length ? list[S.learned.length % list.length] : null;
}
function learnHome() {
  inGame = false; activeUnit = null; mark("learn", learnHome); bar("child");
  const g = curGrade(), gs = [...new Set(cohortGrades().concat(g))].sort((a, b) => a - b);
  const text = `Learn. ${gradeName(g)}. Choose a subject and a lesson.${gs.length > 1 ? " You can choose a different level too." : ""}`;
  currentReturnSay = currentSay = text;
  render(`
      <section style="display:flex;flex-direction:column;gap:16px">
        <div><p class="eyebrow">Learn · ${curriculumName(g)}</p><h1>Choose a lesson</h1></div>
        ${gs.length > 1 ? `<div class="row" role="group" aria-label="Level">${gs.map(n => `<button class="btn small" data-grade="${n}" aria-pressed="${g === n}">${gradeName(n)}</button>`).join("")}</div>` : ""}
        ${[...new Set(myUnits().map(u => u.subject))].map(sub => {
        const lv = levelFor(areaOf(sub)), us = UNITS.filter(u => u.grade === lv && u.subject === sub);
        return `<div><h2>${esc(sub)}${lv !== g ? ` <span class="pill">${gradeName(lv)}</span>` : ""}</h2><div class="grid">${us.map(u => `<button class="tile" data-unit="${u.id}"><span class="pill">${S.learned.includes(u.id) ? "Done" : "Start"}</span><span class="t-name">${esc(u.title)}</span><span class="t-cat">${esc(u.topic)}</span><span class="t-dom">${esc(u.domain)}</span></button>`).join("") || '<p class="muted">More lessons coming soon.</p>'}</div></div>`;
      }).join("")}
      </section>`);
  setSay(text);
  on("[data-grade]", e => { S.grade = +e.currentTarget.dataset.grade; learnHome(); });
  on("[data-unit]", e => unitIntro(UNITS.find(u => u.id === e.currentTarget.dataset.unit)));
}
