import type { Row } from "@tl/adaptation";
import { describe, expect, it } from "vitest";
import { domainMonths, timeline, weeklyCounts, weekStart } from "./development";

const row = (date: string, id: string, status: Row[2]): Row => [date, id, status, "", 0, ""];

describe("development over time", () => {
  it("starts weeks on Monday", () => {
    expect(weekStart("2026-11-12")).toBe("2026-11-09"); // Thursday
    expect(weekStart("2026-11-15")).toBe("2026-11-09"); // Sunday
    expect(weekStart("2026-11-16")).toBe("2026-11-16"); // Monday
  });
  it("counts each week's activities by result, keeping the most recent weeks", () => {
    const rows = [row("2026-11-10", "a", "alone"), row("2026-11-11", "a", "support"), row("2026-11-03", "b", "notyet"), row("2026-01-05", "b", "open")];
    expect(weeklyCounts(rows)).toEqual([
      { week: "2026-01-05", alone: 0, support: 0, notyet: 0, open: 1 },
      { week: "2026-11-02", alone: 0, support: 0, notyet: 1, open: 0 },
      { week: "2026-11-09", alone: 1, support: 1, notyet: 0, open: 0 }]);
    expect(weeklyCounts(rows, 1)).toHaveLength(1);
  });
  it("shows each domain month by month, skipping unknown activities", () => {
    const dom = (id: string) => ({ a: "Logic", b: "Inquiry" })[id];
    const { months, cells } = domainMonths([row("2026-10-01", "a", "alone"), row("2026-10-02", "a", "notyet"), row("2026-11-01", "b", "alone"), row("2026-09-01", "zz", "alone")], dom, ["Logic", "Inquiry"]);
    expect(months).toEqual(["2026-10", "2026-11"]);
    expect(cells[0]!.months).toEqual([{ month: "2026-10", total: 2, alone: 1 }, { month: "2026-11", total: 0, alone: 0 }]);
  });
  it("puts everything on one timeline, newest first, with health only when given", () => {
    const base = { rows: [row("2026-11-10", "a", "alone"), row("2026-11-10", "b", "alone")], goals: [{ id: "g", text: "Asks for help" }],
      observations: [{ goalId: "g", level: "support" as const, note: "", at: "2026-11-11T09:00:00Z" }],
      changes: [{ date: "2026-11-09", text: "Shorter lessons turned off", by: "Ms Dube" }], notes: [{ at: "2026-11-12T08:00:00Z", by: "Ms Dube", body: "Good week." }] };
    expect(timeline(base).map(e => e.text)).toEqual(["Ms Dube: Good week.", 'Goal "Asks for help": with support', "Session: 2 activities", "Shorter lessons turned off (Ms Dube)"]);
    expect(timeline({ ...base, health: [{ at: "2026-11-13T07:00:00Z", text: "New medication" }] })[0]!.icon).toBe("💊");
  });
});
