import { describe, expect, it } from "vitest";
import { LIGHT_PUZZLES, lightTrace, nextMirror, type Mirror } from "./logic";

const fixOf = (fix: [number, number, Mirror][]) => Object.fromEntries(fix.map(([r, c, m]) => [`${r},${c}`, m]));
describe("Light the Village", () => {
  it("lights every hut with each puzzle's own solution", () => {
    for (const pz of [...LIGHT_PUZZLES.younger, ...LIGHT_PUZZLES.older]) expect(lightTrace(pz, fixOf(pz.fix)).all).toBe(true);
  });
  it("can't be solved without mirrors, and stops at rocks", () => {
    for (const pz of [...LIGHT_PUZZLES.younger, ...LIGHT_PUZZLES.older]) expect(lightTrace(pz, {}).all).toBe(false);
    const pz = LIGHT_PUZZLES.older[0]!;
    expect(lightTrace(pz, {}).stop).toBe("rock"); // straight along row 6 into the rock at column 4
  });
  it("tilts a mirror each tap, then takes it away", () => {
    expect([nextMirror(undefined), nextMirror("/"), nextMirror("\\")]).toEqual(["/", "\\", undefined]);
  });
});
