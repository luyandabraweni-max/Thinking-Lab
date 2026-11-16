import type { SchoolProfile } from "@tl/data";
import { describe, expect, it } from "vitest";
import { CORE, PHASE_ITEMS, STRATEGIES, VOICE } from "./bank";
import { alerts, barriers, change, counts, domainAverages, firstYearOf, flagOf, itemsFor, phaseOf, planSummary, riskOf } from "./rules";

const empty = (): SchoolProfile => ({ id: "L", answers: {}, voice: {}, ratings: {}, plan: {}, reviews: {} });
const status = (p: SchoolProfile, key: string, level = "Grade 5") => alerts(p, phaseOf(p, level), level, "2026-11-13").find(a => a.key === key)?.status;

describe("the pack's content", () => {
  it("keeps every observation prompt: 83 core and 50, 40, 32, 31 and 32 on the phase pages, with unique ids", () => {
    expect([CORE.length, PHASE_ITEMS.ecd.length, PHASE_ITEMS.foundation.length, PHASE_ITEMS.intermediate.length, PHASE_ITEMS.senior.length, PHASE_ITEMS.fet.length]).toEqual([83, 50, 40, 32, 31, 32]);
    const ids = [CORE, ...Object.values(PHASE_ITEMS)].flat().map(i => i.id);
    expect(new Set(ids).size).toBe(268);
  });
  it("numbers the 139 strategies in order, and every observation domain has at least one", () => {
    expect(STRATEGIES.map(s => s.n)).toEqual(Array.from({ length: 139 }, (_, i) => i + 1));
    const domains = new Set([CORE, ...Object.values(PHASE_ITEMS)].flat().map(i => i.domain));
    expect([...domains].filter(d => !STRATEGIES.some(s => s.domain === d))).toEqual(["Learner & enrolment"]);
  });
  it("asks the learner 29 questions, three of them with a choice that can raise an alert", () => {
    expect(VOICE).toHaveLength(29);
    expect(VOICE.filter(v => v.choice).map(v => v.key)).toEqual(["v14", "v16", "v18"]);
  });
});

describe("flags", () => {
  it("are critical for significant or severe impact or constant support, watch for moderate, and blank when not observed", () => {
    expect(flagOf({ impact: 3 })).toBe("critical");
    expect(flagOf({ impact: 1, support: 3 })).toBe("critical");
    expect(flagOf({ impact: 2 })).toBe("watch");
    expect(flagOf({ impact: 0, support: 1 })).toBe("ok");
    expect(flagOf({ impact: -1 })).toBe("blank");
    expect(flagOf(undefined)).toBe("blank");
  });
  it("count only the core page and the learner's own phase page", () => {
    const p = empty();
    p.ratings = { c1: { impact: 3 }, f1: { impact: 2 }, s1: { impact: 4 } }; // s1 belongs to another phase
    expect(counts(p, itemsFor("foundation"))).toMatchObject({ critical: 1, watch: 1, total: 123 });
  });
});

describe("the phase", () => {
  it("comes from the profile, or from the learner's grade", () => {
    expect(phaseOf(empty(), "Grade R")).toBe("foundation");
    expect(phaseOf(empty(), "Grade 7")).toBe("senior");
    expect(phaseOf(empty(), "Early years")).toBe("ecd");
    expect(phaseOf({ ...empty(), answers: { phase: "FET Phase (Grades 10-12)" } }, "Grade 7")).toBe("fet");
    expect([firstYearOf("Grade 4"), firstYearOf("Grade 5"), firstYearOf("Foundation level")]).toEqual([true, false, null]);
  });
});

describe("alerts", () => {
  it("say there is not enough information rather than all clear when nothing was entered", () => {
    const p = empty();
    expect(status(p, "unkind")).toBe("info");
    expect(status(p, "voice")).toBe("action");
    expect(status(p, "unrated")).toBe("action");
  });
  it("act on the learner's own answers about safety", () => {
    const p = empty();
    p.voice = { v14: "No", v16: "Not sure", v18: "Yes" };
    expect([status(p, "adult"), status(p, "unkind"), status(p, "unsafe"), status(p, "voice")]).toEqual(["action", "action", "clear", "clear"]);
  });
  it("follow the attendance policy: three and ten consecutive days, and the 90 per cent rate", () => {
    const p = empty();
    p.answers = { longestRun: "3", daysAbsent: "4", schoolDays: "50" }; // 92 per cent
    expect([status(p, "absent3"), status(p, "absent10"), status(p, "rate")]).toEqual(["action", "clear", "clear"]);
    p.answers.daysAbsent = "6"; // 88 per cent
    expect(status(p, "rate")).toBe("action");
  });
  it("flag a high support need with no plan, and a concession deadline within 60 days", () => {
    const p = empty();
    p.answers = { supportLevel: "Level 3, high support", isp: "No", concessionDue: "2026-12-20" };
    expect([status(p, "isp"), status(p, "deadline")]).toEqual(["action", "action"]);
  });
  it("only ask about the examination concession for FET learners", () => {
    expect(alerts(empty(), "fet", "Grade 10").some(a => a.key === "dbe124")).toBe(true);
    expect(alerts(empty(), "senior", "Grade 8").some(a => a.key === "dbe124")).toBe(false);
  });
});

describe("the support map, the plan and the tracker", () => {
  it("rank barriers by impact, then support, and match three strategies from the same domain", () => {
    const p = empty();
    p.ratings = { c6: { impact: 2, support: 1 }, c27: { impact: 4, support: 2 }, c16: { impact: 2, support: 3 }, c1: { impact: 0 } };
    const b = barriers(p, itemsFor("intermediate"));
    expect(b.map(x => x.item.id)).toEqual(["c27", "c16", "c6"]);
    expect(b[0]!.strategies.map(s => s.title)).toEqual(["Allow ear defenders or headphones", "Reduce visual clutter near the learner", "Give an alternative to the hall and assembly"]);
  });
  it("average impact per domain, leaving out what was not observed", () => {
    const p = empty();
    p.ratings = { c6: { impact: 2 }, c7: { impact: 3 }, c8: { impact: -1 } };
    expect(domainAverages(p, itemsFor(null))["Communication & language"]).toBe(2.5);
    expect(change(2.5, 1.5)).toEqual({ d: -1, tone: "better" });
    expect(change(2, 2.5)?.tone).toBe("worse");
  });
  it("count overdue reviews and decisions in the plan", () => {
    const p = empty();
    const row = { domain: "", barrier: "", strength: "", action: "", who: "", often: "", start: "", baseline: "", happened: "", learnerSays: "", next: "", at: "" };
    p.plan = { a: { ...row, review: "2026-10-01", decision: "" }, b: { ...row, review: "2026-10-01", decision: "Stop" }, c: { ...row, review: "", decision: "Refer to the DBST" }, d: { ...row, review: "", decision: "", removed: true } };
    expect(planSummary(p, "2026-11-13")).toEqual({ actions: 3, overdue: 1, helped: 0, changed: 1, escalated: 1 });
  });
  it("band risk with safeguarding and attendance first", () => {
    const p = empty();
    expect(riskOf(p, "foundation", "Grade 2")).toBe("unrated");
    p.ratings = { c6: { impact: 2 } };
    expect(riskOf(p, "foundation", "Grade 2")).toBe("moderate");
    p.ratings.c7 = { impact: 3 };
    expect(riskOf(p, "foundation", "Grade 2")).toBe("high");
    p.voice = { v18: "No" };
    expect(riskOf(p, "foundation", "Grade 2")).toBe("critical");
  });
});
