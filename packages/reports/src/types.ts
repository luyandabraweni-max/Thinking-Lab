import type { Row } from "@tl/adaptation";

// One report model feeds the on-screen preview, the PDF and the Word file, so all three always match.
export interface ReportTable { head: string[]; rows: string[][]; widths?: number[] }
export interface ReportSection { heading: string; paras?: string[]; bullets?: string[]; table?: ReportTable }
export interface ReportModel { title: string; subtitle: string; meta: [string, string][]; sections: ReportSection[]; footer: string; pageNote: string }

/** What a report needs to know about a game or lesson. The app supplies it, so this package stays independent. */
export interface ActivityInfo {
  name: string; domain: string; cat: string;
  parent?: string;              // what the activity means, for families ("planned where to put mirrors…")
  homeIdea?: string;            // one thing to try at home
  curriculum?: (cohort: string) => string; // proposed curriculum link
}
export interface ReportInput {
  learner: { nickname: string; cohort: string; cohortLabel: string; curriculum: string; level: string; supportNeeds?: string; supportConsent?: boolean };
  rows: Row[];
  goals: { text: string; area: string; status: "todo" | "doing" | "done"; target: string | null }[];
  notes: { at: string; by: string; body: string; shareFamily: boolean }[];
  by: { name: string; role: string; profession?: string };
  activity: (id: string) => ActivityInfo | undefined;
}
export interface ReportOptions { kind: "family" | "specialist"; support?: boolean; history?: boolean; today?: string }
