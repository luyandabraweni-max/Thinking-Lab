import { describe, expect, it } from "vitest";
import type { Question } from "@tl/content";
import { check, levelFromName, norm, passageParts, pickQuestions, twoChoices } from "./logic";

const empty = { picked: null, typed: "", order: [], sortPlace: [] };
describe("lesson rules", () => {
  it("compares answers the way the live app does", () => {
    expect(norm("R 30")).toBe(norm("30"));
    expect(norm("2.5")).toBe(norm("2,5"));
    const num: Question = { type: "num", q: "?", answer: "30", accept: ["R30"], options: ["R30", "R25"], hints: [], explain: "" };
    expect(check(num, { ...empty, typed: "r30" }, true)).toEqual({ ok: true });
    expect(check(num, { ...empty, picked: 0 }, false)).toEqual({ ok: true });
    expect(check(num, empty, true)).toEqual({ missing: "Type your answer first." });
  });
  it("accepts identical steps in either place in an order question", () => {
    const q: Question = { type: "order", q: "?", items: ["In", "Hold", "Out", "Hold"], hints: [], explain: "" };
    expect(check(q, { ...empty, order: [0, 3, 2, 1] }, false)).toEqual({ ok: true });
    expect(check(q, { ...empty, order: [0, 2, 1, 3] }, false)).toEqual({ ok: false });
  });
  it("checks sorting, shortens lessons, and makes two choices that include the answer", () => {
    const sort: Question = { type: "sort", q: "?", items: ["a", "b"], bins: ["x", "y"], answer: [0, 1], hints: [], explain: "" };
    expect(check(sort, { ...empty, sortPlace: [0, null] }, false)).toEqual({ missing: "Sort all of them first." });
    expect(check(sort, { ...empty, sortPlace: [0, 1] }, false)).toEqual({ ok: true });
    expect(pickQuestions([1, 2, 3, 4, 5, 6], true)).toEqual([1, 4, 6]);
    const mcq: Question = { type: "mcq", q: "?", options: ["a", "b", "c", "d"], answer: 2, hints: [], explain: "" };
    for (let k = 0; k < 20; k++) { const two = twoChoices(mcq, [0, 1, 2, 3]); expect(two).toHaveLength(2); expect(two).toContain(2); }
  });
  it("splits a passage into parts and reads level names", () => {
    expect(passageParts('<div class="passage-text"><p>One.</p><p>Two.</p></div>').map(p => p.text)).toEqual(["One.", "Two."]);
    expect([levelFromName("Grade 9"), levelFromName("Grade R"), levelFromName("Foundation level")]).toEqual([9, 0, null]);
  });
});
