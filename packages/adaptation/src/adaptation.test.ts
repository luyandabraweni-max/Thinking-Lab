import { CATALOGUE, areaOf } from "@tl/content";
import { describe, expect, it } from "vitest";
import { ADAPT, adaptFor, adaptList, adaptLive, levelSuggestions, statusOf, supportText, toRow, type Flags, type Row, type Status } from "./index";

// The same cases as the live app's tests (tests/unit/adapt.test.js), so the port behaves identically.
const MU = CATALOGUE.find(u => areaOf(u.subject) === "maths" && u.grade === 5)!;
const row = (d: string, st: Status, h = 0, f?: Flags): Row => { const r: Row = [d, MU.id, st, "chose", h, ""]; if (f) r.push(f); return r; };

describe("adaptation rules", () => {
  it("counts an answer after 'make it easier' as support", () => {
    expect(statusOf({ firstMatched: true, latestMatched: true, hints: 0, easier: true })).toBe("support");
    expect(statusOf({ firstMatched: true, latestMatched: true, hints: 0 })).toBe("alone");
    expect(statusOf({ open: true })).toBe("open");
  });
  it("needs enough evidence before changing anything", () => {
    expect(adaptFor([row("2026-11-01", "support", 1)])).toEqual({ fewer: {} });
  });
  it("offers help sooner when help was used on most recent questions", () => {
    expect(adaptFor(["2026-11-01", "2026-11-02"].flatMap(d => [row(d, "support", 1), row(d, "support", 2), row(d, "alone"), row(d, "support", 1)])).sooner).toContain("help was used on 6 of the last 8");
  });
  it("shortens lessons after repeated moving on, but only from recent sessions", () => {
    expect(adaptFor([1, 2, 3].map(i => row(`2026-11-0${i}`, "notyet", 0, { s: 1 }))).shorter).toBeTruthy();
    expect(adaptFor([row("2026-10-01", "notyet", 0, { s: 1 }), row("2026-10-02", "notyet", 0, { s: 1 }), row("2026-11-01", "alone"), row("2026-11-02", "alone"), row("2026-11-03", "alone")]).shorter).toBeUndefined();
  });
  it("starts with fewer choices only while the learner keeps asking for easier", () => {
    expect(adaptFor([row("d1", "support", 0, { e: 1 }), row("d1", "support", 0, { e: 1 }), row("d2", "support", 0, { e: 1 })]).fewer.maths).toBeTruthy();
    expect(adaptFor([1, 2, 3, 4, 5, 6].map(i => row(`d${i}`, "support", 0, { a: 1 }))).fewer).toEqual({});
  });
  it("stops when an adult turns automatic changes off, or switches one rule off", () => {
    const rows = [1, 2, 3].map(i => row(`2026-11-0${i}`, "notyet", 0, { s: 1 }));
    expect(adaptLive(rows, { auto: false })).toEqual({ fewer: {} });
    expect(adaptLive(rows, { auto: true, off: { shorter: true } }).shorter).toBeUndefined();
    expect(adaptList(rows)).toEqual([["Shorter lessons (3 questions)", "moved on without an answer 3 times in recent sessions"]]);
  });
  it("records the support used with each question", () => {
    expect(toRow({ firstMatched: true, latestMatched: true, hints: 1, easier: true, quick: 1 }, MU.id, "ok", "2026-11-12")).toEqual(["2026-11-12", MU.id, "support", "tap", 1, "ok", { e: 1, q: 1 }]);
    expect(supportText(row("d", "support", 1, { e: 1 }))).toBe("1 hint, made easier");
    expect(ADAPT.quickMs).toBe(3000);
  });
});

describe("level suggestions", () => {
  const ready = ["2026-11-01", "2026-11-03"].flatMap(d => [1, 2, 3, 4].map(() => row(d, "alone")));
  it("suggests the next level with its evidence, after enough work on different days", () => {
    const [s] = levelSuggestions({ rows: ready, cohort: "7-12", level: 5 });
    expect(s).toMatchObject({ key: "up:maths:5", area: "maths", to: 6, text: "Ready for more in maths: try Grade 6" });
    expect(levelSuggestions({ rows: ready.slice(0, 4), cohort: "7-12", level: 5 })).toEqual([]); // one day isn't enough
  });
  it("sets a suggestion aside for two weeks after Not now, and drops it once accepted", () => {
    const now = Date.parse("2026-11-12T00:00:00Z");
    expect(levelSuggestions({ rows: ready, cohort: "7-12", level: 5, decisions: { "up:maths:5": { d: "no", at: now - 864e5 } } }, now)).toEqual([]);
    expect(levelSuggestions({ rows: ready, cohort: "7-12", level: 5, decisions: { "up:maths:5": { d: "no", at: now - 15 * 864e5 } } }, now)).toHaveLength(1);
    expect(levelSuggestions({ rows: ready, cohort: "7-12", level: 5, decisions: { "up:maths:5": { d: "yes", at: now } } }, now)).toEqual([]);
  });
  it("suggests the level below when work is often too hard", () => {
    const hard = ["2026-11-01", "2026-11-02"].flatMap(d => [1, 2, 3].map(() => row(d, "notyet")));
    expect(levelSuggestions({ rows: hard, cohort: "7-12", level: 5 })[0]).toMatchObject({ to: 4, text: "Maths may be too hard right now: try Grade 4" });
  });
});
