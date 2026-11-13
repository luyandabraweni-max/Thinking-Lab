import { describe, expect, it } from "vitest";
import { ALL_LEVELS, areaOf, CATALOGUE, lessonsIn, loadPack, loadUnit, packOf, type Question } from "./index";

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
    expect(CATALOGUE).toHaveLength(346);
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
  it("gives every lesson key words with a picture and a plain meaning", async () => {
    const missing: string[] = [];
    for (const c of CATALOGUE) {
      const { words } = await loadUnit(c.id);
      if (!words?.words?.length || words.words.some(w => w.length !== 3 || w.some(s => !s))) missing.push(c.id);
    }
    expect(missing).toEqual([]);
  });
  it("shows each curriculum its own lessons, with CAPS lessons standing in where none are written yet", () => {
    const ids = (r: ReturnType<typeof lessonsIn>) => r.units.map(u => u.id);
    const cam = lessonsIn(CATALOGUE, "maths", 10, { curriculum: "Cambridge" });
    expect(cam.standIn).toBe(false);
    expect(cam.units.every(u => u.curriculum === "Cambridge")).toBe(true);
    expect(ids(cam)).toContain("cam10-standard-form");
    const caps = lessonsIn(CATALOGUE, "maths", 10, { curriculum: "CAPS" });
    expect(caps.units.some(u => u.curriculum)).toBe(false); // Cambridge lessons stay with Cambridge learners
    expect(ids(caps)).toEqual(expect.arrayContaining(["g10-exponents", "g10-ml-budget"]));
    expect(ids(lessonsIn(CATALOGUE, "maths", 10, { curriculum: "IEB", maths: "lit" }))).not.toContain("g10-exponents");
    // Cambridge now has its own Maths, English and Science from Stage 1 to IGCSE; CAPS stands in only for other areas.
    for (let g = 1; g <= 11; g++) for (const a of ["maths", "language", "science"] as const) {
      const r = lessonsIn(CATALOGUE, a, g, { curriculum: "Cambridge" });
      expect(r.standIn, `Cambridge ${a} at Grade ${g}`).toBe(false);
      expect(r.units.length, `Cambridge ${a} at Grade ${g}`).toBeGreaterThan(0);
    }
    expect(lessonsIn(CATALOGUE, "life", 5, { curriculum: "Cambridge" }).standIn).toBe(true);
  });
  it("gives IB and CAPS for SID learners their own lessons, and work-readiness lessons at every teen level", () => {
    expect(lessonsIn(CATALOGUE, "science", 9, { curriculum: "IB" }).units.map(u => u.id)).toEqual(["ib9-sci-fair-test", "ib9-sci-ecosystems"]);
    // PYP (Grades 1 to 6) and DP (Grades 11 and 12): every subject lands in a real area, never the catch-all
    for (const u of CATALOGUE.filter(x => x.id.startsWith("pyp") || x.id.startsWith("dp")))
      expect(areaOf(u.subject) !== "life" || /Social|Personal/.test(u.subject), u.id).toBe(true);
    expect(lessonsIn(CATALOGUE, "inquiry", 11, { curriculum: "IB" }).units.map(u => u.id)).toEqual(["dp11-tok-questions", "dp11-ee-question"]);
    expect(lessonsIn(CATALOGUE, "creative", 3, { curriculum: "IB" }).units.map(u => u.id)).toEqual(["pyp3-symbols"]);
    expect(lessonsIn(CATALOGUE, "maths", 12, { curriculum: "IB" }).units.map(u => u.id)).toEqual(["dp12-aa-binomial", "dp12-ai-chi-squared"]);
    expect(lessonsIn(CATALOGUE, "language", 10, { curriculum: "IB" }).units.every(u => u.curriculum === "IB")).toBe(true);
    for (const g of [7, 9, 12]) {
      const life = lessonsIn(CATALOGUE, "life", g, { curriculum: "CAPS-SID" });
      expect(life.standIn).toBe(false);
      expect(life.units.map(u => u.id)).toContain("sidw-taxi");
    }
    expect(lessonsIn(CATALOGUE, "maths", 2, { curriculum: "CAPS-SID" }).units.map(u => u.id)).toEqual(["sid0-count", "sid2-coins"]);
    // A SID learner at Grade 6 works on the SID lessons, never on CAPS Grade 6; areas with no SID lessons stay empty.
    const g6 = lessonsIn(CATALOGUE, "maths", 6, { curriculum: "CAPS-SID" });
    expect(g6.standIn).toBe(false);
    expect(g6.units.map(u => u.id)).toEqual(["sid0-count", "sid2-coins", "sid3-day"]);
    expect(lessonsIn(CATALOGUE, "science", 6, { curriculum: "CAPS-SID" }).units).toEqual([]);
    expect(lessonsIn(CATALOGUE, "life", 9, { curriculum: "CAPS" }).units.some(u => u.curriculum)).toBe(false);
  });
  it("gives IEB learners the CAPS lessons plus IEB ones, with AP Maths unless they take Maths Lit", () => {
    const ids = (c: Parameters<typeof lessonsIn>[3]) => lessonsIn(CATALOGUE, "maths", 11, c).units.map(u => u.id);
    expect(ids({ curriculum: "IEB" })).toEqual(expect.arrayContaining(["ieb11-ma-functions-context", "apm11-induction", "g11-ml-interest"]));
    expect(ids({ curriculum: "IEB" }).some(id => id.startsWith("g11-") && !id.includes("-ml-"))).toBe(true); // CAPS Mathematics too
    expect(ids({ curriculum: "IEB", maths: "lit" })).not.toContain("apm11-induction");
    expect(ids({ curriculum: "IEB", maths: "lit" })).not.toContain("ieb11-ma-functions-context");
    expect(ids({ curriculum: "CAPS" }).some(id => id.startsWith("ieb") || id.startsWith("apm"))).toBe(false);
  });
});
