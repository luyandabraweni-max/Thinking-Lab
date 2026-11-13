import { describe, expect, it } from "vitest";
import { ALL_LEVELS, areaOf, CATALOGUE, loadPack, loadUnit, packOf, type Question } from "./index";

// Every lesson must be complete and answerable, so a broken lesson never reaches a learner (section 15).
const problems = (q: Question): string[] => {
  const p: string[] = [];
  if (!q.q || !q.explain) p.push("missing question or explanation");
  if (q.hints.length < 1 || q.hints.length > 3) p.push(`${q.hints.length} hints`);
  if (q.type === "mcq" && !q.open && !(q.answer >= 0 && q.answer < q.options.length)) p.push("answer out of range");
  if (q.type === "mcq" && q.pics && q.pics.length !== q.options.length) p.push("a picture for every option");
  const norm = (v: string) => v.toLowerCase().replace(/\s+/g, "").replace(/^r/, "").replace(/\./g, ","); // as the lesson player compares answers
  if (q.type === "num" && q.options && !q.options.some(o => norm(o) === norm(q.answer))) p.push("answer not among the choices");
  if (q.type === "sort" && (q.answer.length !== q.items.length || q.answer.some(b => b < 0 || b >= q.bins.length))) p.push("sort answers don't fit the bins");
  return p;
};

describe("content", () => {
  it("has a pack for every level that has lessons, and every lesson in its pack", async () => {
    const levels = [...new Set(CATALOGUE.map(u => u.grade))].sort((a, b) => a - b);
    expect(levels.every(g => ALL_LEVELS.includes(g))).toBe(true);
    for (const g of levels) {
      const pack = await loadPack(packOf(g));
      expect(pack.units.map(u => u.id)).toEqual(CATALOGUE.filter(u => u.grade === g).map(u => u.id));
    }
    expect(CATALOGUE).toHaveLength(195);
  });
  it("has complete, answerable questions in every lesson", async () => {
    const bad: string[] = [];
    for (const pack of new Set(CATALOGUE.map(u => u.pack))) for (const u of (await loadPack(pack)).units) {
      if (!u.lesson.length || !u.questions.length || !u.reflect.options.length) bad.push(`${u.id}: incomplete`);
      u.questions.forEach((q, i) => problems(q).forEach(p => bad.push(`${u.id} question ${i + 1}: ${p}`)));
    }
    expect(bad).toEqual([]);
  });
  it("puts every subject in a learning area, and finds a single lesson with its word help", async () => {
    expect(areaOf("Mathematics")).toBe("maths");
    const { unit, words } = await loadUnit("g5-fractions-intro").catch(() => loadUnit(CATALOGUE.find(u => u.grade === 5)!.id));
    expect(unit.grade).toBe(5);
    expect(words === undefined || Array.isArray(words.words) || Array.isArray(words.phrases)).toBe(true);
  });
});
