import type { Row } from "@tl/adaptation";
import { describe, expect, it } from "vitest";
import { buildReport, reportFileName, reportToDocx, reportToPdf, strengths, type ActivityInfo, type ReportInput } from "./index";

const ACTS: Record<string, ActivityInfo> = {
  light: { name: "Light the Village", domain: "Logical and Analytical Thinking", cat: "Planning", parent: "planned where to put mirrors.", homeIdea: "Shine a torch at a small mirror together." },
  rule: { name: "The Secret Rule Machine", domain: "Inquiry and Systems Thinking", cat: "Investigation", curriculum: () => "Mathematics: Data Handling." }
};
const rows: Row[] = ["2026-10-05", "2026-10-07", "2026-10-12", "2026-10-14", "2026-10-19"].flatMap(d => [[d, "light", "alone", "placed mirrors", 0, ""], [d, "rule", "support", "tested objects", 1, ""]] as Row[]);
const input: ReportInput = {
  learner: { nickname: "Brave Meerkat", cohort: "7-12", cohortLabel: "7 to 12 years", curriculum: "D-CAPS", level: "Foundation level", supportNeeds: "Extra time", supportConsent: true },
  rows, goals: [{ text: "Follows a 3-step plan", area: "Logical and Analytical Thinking", status: "doing", target: "2026-12-05" }],
  notes: [{ at: "2026-10-15T10:00:00Z", by: "Demo Specialist", body: "Shared note", shareFamily: true }, { at: "2026-10-20T10:00:00Z", by: "Demo Specialist", body: "Team-only note", shareFamily: false }],
  by: { name: "Demo Specialist", role: "specialist", profession: "Special-needs educator" }, activity: id => ACTS[id]
};
const text = (m: ReturnType<typeof buildReport>) => JSON.stringify(m);

describe("reports", () => {
  it("finds strengths at the agreed levels: Consistent needs evidence across two or more activities", () => {
    expect(strengths(rows, id => ACTS[id]).map(s => [s.level, s.label])[0]).toEqual(["Growing", "Works independently in Logical and Analytical Thinking"]);
    const both: Row[] = rows.map(r => [r[0], r[1], "alone", "choose", 0, ""]);
    expect(strengths(both, id => ({ ...ACTS[id]!, domain: "Logical and Analytical Thinking" }))[0]).toMatchObject({ level: "Consistent", label: "Works independently in Logical and Analytical Thinking" });
  });
  it("gives the family plain language and shared notes only; the specialist the evidence and every note", () => {
    const fam = buildReport(input, { kind: "family", today: "2026-11-12" }), spec = buildReport(input, { kind: "specialist", history: true, today: "2026-11-12" });
    expect(fam.title).toBe("Family summary for Brave Meerkat");
    expect(text(fam)).toContain("Brave Meerkat planned where to put mirrors.");
    expect(text(fam)).toContain("Shine a torch at a small mirror together.");
    expect(text(fam)).not.toContain("Team-only note");
    expect(text(spec)).toContain("Team-only note");
    expect(spec.sections.map(s => s.heading)).toEqual(["Summary", "Strengths and preferences", "Activities by thinking domain", "Individual support goals", "Curriculum links (proposed)", "Session history", "Notes"]);
    expect(text(spec)).not.toContain("Extra time"); // support needs only when asked for, and only with consent
    expect(text(buildReport(input, { kind: "specialist", support: true }))).toContain("Extra time");
  });
  it("writes a valid PDF and a Word file", () => {
    const rep = buildReport(input, { kind: "specialist", history: true, today: "2026-11-12" });
    const pdf = new TextDecoder("latin1").decode(reportToPdf(rep));
    expect(pdf.startsWith("%PDF-1.4")).toBe(true);
    expect(pdf.trimEnd().endsWith("%%EOF")).toBe(true);
    const xref = Number(pdf.match(/startxref\n(\d+)/)![1]);
    expect(pdf.slice(xref, xref + 4)).toBe("xref"); // the cross-reference table is where the file says it is
    expect(pdf).toContain("(Learning report for Brave Meerkat) Tj");
    const docx = reportToDocx(rep), zip = new TextDecoder().decode(docx);
    expect([docx[0], docx[1], docx[2], docx[3]]).toEqual([0x50, 0x4b, 0x03, 0x04]); // a zip file
    for (const part of ["[Content_Types].xml", "word/document.xml", "word/styles.xml", "word/footer1.xml"]) expect(zip).toContain(part);
    expect(zip).toContain("Learning report for Brave Meerkat");
    expect(reportFileName("Brave Meerkat", "family", "pdf", "2026-11-12")).toBe("ThinkingLab-family-summary-Brave-Meerkat-2026-11-12.pdf");
  });
});
