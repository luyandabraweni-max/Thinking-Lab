import { describe, expect, it } from "vitest";
import { RM_ALL, RM_RULES, rmDiff, rmName } from "./logic";

describe("The Secret Rule Machine", () => {
  const all = [...RM_RULES.younger, ...RM_RULES.older];
  it("has objects that light up and objects that don't, for every rule", () => {
    expect(RM_ALL).toHaveLength(24);
    for (const r of all) { expect(RM_ALL.some(r.f)).toBe(true); expect(RM_ALL.some(o => !r.f(o))).toBe(true); }
  });
  it("can answer every wrong guess with evidence: an object the two rules judge differently", () => {
    for (const pool of [RM_RULES.younger, RM_RULES.older]) for (const rule of pool) for (const guess of pool)
      if (guess !== rule) expect(RM_ALL.some(o => guess.f(o) !== rule.f(o))).toBe(true);
  });
  it("counts a fair test as exactly one change, and names objects plainly", () => {
    expect(rmDiff({ shape: "star", fill: "solid", size: "big" }, { shape: "star", fill: "dotted", size: "big" })).toBe(1);
    expect(rmDiff({ shape: "star", fill: "solid", size: "big" }, { shape: "circle", fill: "dotted", size: "big" })).toBe(2);
    expect(rmName({ shape: "star", fill: "striped", size: "small" })).toBe("small striped star");
  });
});
