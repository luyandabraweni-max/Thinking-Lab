import { describe, expect, it } from "vitest";
import { diMake, diMinClues, diName } from "./logic";

describe("Describe It", () => {
  it("makes sets where the fewest clues pick out exactly the learner's Blip", () => {
    for (const older of [false, true]) for (let k = 0; k < 300; k++) {
      const m = diMake(older ? 6 : 4, older, 2)!, need = diMinClues(m.target, m.set);
      expect(need.every(x => x.f(m.target))).toBe(true);
      expect(m.set.filter(c => need.every(x => x.f(c)))).toEqual([m.target]);
      expect(need.length).toBeGreaterThanOrEqual(2);
    }
  });
  it("says eye counts in words, the same as the clue buttons", () => {
    expect(diName({ body: "tall", eyes: 2, hat: "none", skin: "plain" })).toBe("a tall Blip with two eyes, no hat and no pattern");
  });
});
