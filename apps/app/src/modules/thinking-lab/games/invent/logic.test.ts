import { describe, expect, it } from "vitest";
import { IW_LEVELS, iwTest, type PartId } from "./logic";

describe("Invention Workshop", () => {
  it("accepts the hint's design for every challenge", () => {
    const hint = (t: string): PartId => (t === "uphill" ? "screw" : "pipe");
    for (const lv of [IW_LEVELS.younger, IW_LEVELS.older]) for (const task of lv.tasks)
      expect(iwTest(lv.segs, lv.segs.map(hint), lv.power ? "crank" : "none", task.rules).ok).toBe(true);
  });
  it("says exactly where and why the water stops", () => {
    const y = IW_LEVELS.younger;
    expect(iwTest(y.segs, ["pipe", "gutter", "pipe"], "none", {})).toEqual({ at: 1, why: "The gutter is open underneath, so the water pours into the ditch." });
    expect(iwTest(y.segs, ["pipe", null, "pipe"], "none", {})).toEqual({ at: 1, why: "There's a gap here, so the water spills out." });
    expect(iwTest(y.segs, ["pipe", "bucket", "pipe"], "none", { noBuckets: true })).toMatchObject({ at: 1 });
  });
  it("needs power for pumps and screws, wind for a windmill, and keeps to the budget", () => {
    const o = IW_LEVELS.older;
    expect(iwTest(o.segs, ["pipe", "screw", "pipe", "screw"], "none", {})).toMatchObject({ at: 1 });
    expect(iwTest(o.segs, ["pipe", "screw", "pipe", "screw"], "windmill", { noWind: true })).toMatchObject({ at: 1, why: "There's no wind today, so the windmill doesn't turn." });
    expect(iwTest(o.segs, ["pump", "pump", "pipe", "pump"], "solar", { budget: 20 })).toMatchObject({ at: -1 });
  });
});
