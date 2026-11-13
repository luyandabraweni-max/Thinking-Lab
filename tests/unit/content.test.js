// Checks every lesson and skill project, so content mistakes are caught before they reach learners.
import { describe, it, expect } from "vitest";
import { loadApp } from "./load-app.js";

const app = loadApp();
const units = app.run(`UNITS.map(u => ({ id: u.id, grade: u.grade, subject: u.subject, title: u.title, area: Object.keys(AREAS).find(a => AREAS[a][1].includes(u.subject)) || null,
  questions: (u.questions || u.practice || []).map(q => ({ type: q.type, options: q.options, answer: q.answer, open: !!q.open, hints: q.hints })) }))`);
const levels = app.run(`ALL_LEVELS`);

describe("lessons", () => {
  it("has 195 lessons", () => { expect(units.length).toBe(195); });
  it("has unique ids", () => { expect(new Set(units.map(u => u.id)).size).toBe(units.length); });
  it.each(units.map(u => [u.id, u]))("%s has a known level, a title and a learning area", (_, u) => {
    expect(levels).toContain(u.grade);
    expect(u.title).toBeTruthy();
    expect(u.area, `subject "${u.subject}" is not in any learning area in profile.js`).toBeTruthy();
  });
  it("gives every multiple-choice question a valid answer (open questions have none)", () => {
    const bad = [];
    for (const u of units) u.questions.forEach((q, i) => {
      if (q.type === "mcq" && !q.open && !(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < (q.options || []).length)) bad.push(`${u.id} question ${i + 1}`);
    });
    expect(bad).toEqual([]);
  });
  it("gives every level at least one lesson", () => {
    for (const g of levels) expect(units.some(u => u.grade === g), `no lessons at level ${g}`).toBe(true);
  });
});
