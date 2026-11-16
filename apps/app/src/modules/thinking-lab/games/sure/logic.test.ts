import { describe, expect, it } from "vitest";
import { HS_PUZZLES, HS_SETS, sureMeter } from "./logic";

describe("How Sure Am I?", () => {
  it("has every puzzle in each set, with an answer among its choices", () => {
    for (const id of [...HS_SETS.younger, ...HS_SETS.older]) {
      const p = HS_PUZZLES[id]!;
      expect(p.answer).toBeLessThan(p.opts.length);
      if (p.pics) expect(p.pics).toHaveLength(p.opts.length);
      if (p.art) expect(p.sr).toBeTruthy(); // every picture is described for screen readers
    }
  });
  it("shows how well feeling sure matched being right, and names illusions that tricked a very sure learner", () => {
    const m = sureMeter([{ conf: "very", firstMatched: true }, { conf: "very", firstMatched: true }, { conf: "very", firstMatched: true }, { conf: "very", firstMatched: false, illusion: true }, { conf: "guess", firstMatched: true }]);
    expect(m.rows.map(r => [r.id, r.right, r.n])).toEqual([["guess", 1, 1], ["fair", 0, 0], ["very", 3, 4]]);
    expect(m.msg).toEqual(["When you felt very sure, you were usually right. You know when you know!",
      "Your eyes played tricks on you 1 time, even when you felt very sure. That happens to everyone. Checking is a superpower.",
      "When you were just guessing, you were still right 1 time. You may know more than you think!"]);
    expect(sureMeter([]).msg).toEqual(["You can try the puzzles another time."]);
  });
});
