// The platform's data model, shared by every module. Names follow docs/system-design.md, sections 10 and 11.

export type AdultRole = "guardian" | "teacher" | "specialist" | "site_admin" | "org_admin";
export type Role = AdultRole | "learner";
export type Law = "POPIA" | "GDPR";

export interface Account {
  id: string;
  role: AdultRole;
  name: string;
  email: string;
  orgId: string | null;
  profession?: string;
}

/** A member of a learner's team: a teacher or specialist the family has shared the learner with. */
export interface TeamMember { userId: string; healthAccess: boolean }

export interface Consent {
  guardian: boolean; // a guardian agreed to the platform holding the learner's data
  support: boolean;  // support needs may be recorded
  share: boolean;    // the learner may be shared with teachers and specialists
  health: boolean;   // medication and health records may be shared with the team
  law: Law;
  updatedAt: string;
}

export interface Learner {
  id: string;
  orgId: string;
  nickname: string; // pseudonymous: a real name, if kept at all, lives in a separate table
  cohort: "early" | "child" | "teen" | "adult";
  curriculum: string;
  level: string;
  guardianIds: string[];
  team: TeamMember[];
  consent: Consent;
}

export interface Message {
  id: string;
  learnerId: string;
  fromId: string;
  fromName: string;
  fromRole: Role;
  audience: "team" | "learner"; // "learner" messages also stay visible to the whole team and the family
  body: string;
  createdAt: string;
  readBy: string[];
}

export interface Medication {
  id: string;
  learnerId: string;
  name: string;
  dose: string;
  schedule: string;
  reason: string;
  startedOn: string;
  stoppedOn: string | null;
  createdBy: string;
}

export interface Dose { id: string; learnerId: string; medicationId: string; givenAt: string; givenBy: string; note: string }
export interface HealthEntry { id: string; learnerId: string; at: string; by: string; text: string }

/** One answered question or game round (append only). Flags: see @tl/adaptation. */
export interface Attempt {
  id: string; learnerId: string; activityId: string;
  status: "alone" | "support" | "notyet" | "open"; mode: string; hints: number;
  flags: { e?: 1; a?: 1; s?: 1; b?: 1; q?: number } | null; reflection: string; occurredAt: string;
}

export type Tables = {
  accounts: Account;
  learners: Learner;
  messages: Message;
  medications: Medication;
  doses: Dose;
  health_log: HealthEntry;
  attempts: Attempt;
};
export type TableName = keyof Tables;
export const TABLES: TableName[] = ["accounts", "learners", "messages", "medications", "doses", "health_log", "attempts"];
