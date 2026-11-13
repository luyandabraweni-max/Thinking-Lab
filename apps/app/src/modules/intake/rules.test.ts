import { describe, expect, it } from "vitest";
import { DAILY, DISCIPLINE, MILESTONES, SENSES, SHARED } from "./bank";
import { flags, homeAndSchool, prompts, safetyFollowUps, supportSnapshot, topDaily, type Data } from "./rules";

describe("the intake's content", () => {
  it("keeps the pack's 109 daily life items, 12 senses, 19 milestones, 35 shared sections and 99 focus areas", () => {
    expect([DAILY.length, SENSES.length, MILESTONES.length, SHARED.length, DISCIPLINE.length]).toEqual([109, 12, 19, 35, 99]);
    expect(DISCIPLINE.at(-1)!.id).toBe("D099");
  });
});

describe("the summary and triage", () => {
  it("never reads a blank allergy answer as no allergy", () => {
    expect(flags({}, 0)[0]!.value).toMatch(/NOT COMPLETED/);
    expect(flags({ allergyNone: "Yes" }, 0)[0]!.value).toBe("None known");
  });
  it("orders reported impact by level, lifting the family's priorities above items of the same level", () => {
    const d: Data = { d1c: "Moderate, needs support", d2c: "Moderate, needs support", d2p: "Yes, a top priority for us", d3c: "Severe, we cannot manage without help", d4c: "No concern" };
    expect(topDaily(d).map(i => i.n)).toEqual([3, 2, 1]);
  });
  it("asks for a private conversation for any safety answer other than No, and for 'understands who is safe' other than Yes", () => {
    expect(safetyFollowUps({ s3: "No", s5: "Yes", s9: "Prefer to discuss in person", w20: "Not sure" })).toEqual(["w20", "s9"]);
    expect(safetyFollowUps({ s5: "No" })).toEqual(["s5"]);
  });
  it("prompts for hearing, vision, swallowing and a missing school view", () => {
    const p = prompts({ v2: "Not done", v6: "Done, result normal", d98c: "Significant, affects daily life" }, false);
    expect(p.some(x => x.startsWith("Hearing has not been confirmed"))).toBe(true);
    expect(p.some(x => x.startsWith("Vision"))).toBe(false);
    expect(p.some(x => x.includes("swallow safety"))).toBe(true);
    expect(p.some(x => x.startsWith("No school observations"))).toBe(true);
  });
  it("flags a large difference between home and school", () => {
    const row = homeAndSchool({ d1c: "Severe, we cannot manage without help" }, { "Communication & language": 1 }).find(r => r.area === "Communication and language")!;
    expect([row.home, row.school, row.diff]).toEqual([4, 1, 3]);
    expect(row.read).toMatch(/harder at home/);
  });
  it("builds How to support me without health detail or emergency numbers", () => {
    const s = supportSnapshot({ o2: "Drawing", k5: "Taps the table twice", h1: "Something private" }, "Brave Meerkat");
    expect(s).toMatchObject({ "My name": "Brave Meerkat", "What I am good at": "Drawing", "How I tell you I need a break": "Taps the table twice", "Medical information to be aware of": "Ask the family", "In an emergency, call": "Ask the family" });
    expect(Object.values(s)).not.toContain("Something private");
  });
});
