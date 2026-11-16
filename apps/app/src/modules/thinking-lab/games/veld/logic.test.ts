import { describe, expect, it } from "vitest";
import { VELD_QS, VELD_START, veldRun, veldTrend } from "./logic";

describe("Veld Balance", () => {
  it("starts in balance with some rain", () => {
    expect(veldTrend(veldRun(VELD_START, 1, 8), "buck")).toBe("same");
  });
  it("gives each question the ripple its explanation describes", () => {
    const expected: Record<string, string> = { "The rain stops for a long time.:buck": "fewer", "The cheetahs move far away.:buck": "more",
      "The rain stops for a long time.:cheetah": "fewer", "The cheetahs move far away.:grass": "fewer", "Lots of rain falls every season.:cheetah": "more" };
    for (const q of [...VELD_QS.younger, ...VELD_QS.older])
      expect(veldTrend(veldRun({ ...VELD_START, ...q.set }, q.rain, 8), q.ask)).toBe(expected[`${q.change}:${q.ask}`]);
  });
  it("never goes below zero or above the grass limit", () => {
    for (const rain of [0, 1, 2] as const) for (const s of veldRun({ grass: 90, buck: 50, cheetah: 10 }, rain, 30)) {
      expect(Math.min(s.grass, s.buck, s.cheetah)).toBeGreaterThanOrEqual(0);
      expect(s.grass).toBeLessThanOrEqual(100);
    }
  });
});
