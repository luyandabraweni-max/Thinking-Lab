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
  /** A designated safeguarding lead (appointed by their organisation's admin). */
  safeguardingLead?: boolean;
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

/** A support-plan goal (Individual Support Plan), set by a teacher or specialist on the learner's team. */
export interface Goal { id: string; learnerId: string; text: string; area: string; status: "todo" | "doing" | "done"; target: string; createdBy: string; createdAt: string }
/** What the team saw, against a goal (append only). */
export interface Observation { id: string; goalId: string; learnerId: string; level: "notyet" | "support" | "alone"; note: string; by: string; byName: string; at: string }
/** A specialist's note: the family sees it only when it is shared with them. */
export interface Note { id: string; learnerId: string; authorId: string; authorName: string; body: string; shareFamily: boolean; createdAt: string }

/** A learner said they feel unsafe. Sent to the server for the safeguarding lead; never pulled back to devices. */
export interface ConcernRow { id: string; learnerId: string; at: string; where: "home" | "lesson" | "talk board" | "tell us" | "help" }

export type Tables = {
  accounts: Account;
  learners: Learner;
  messages: Message;
  medications: Medication;
  doses: Dose;
  health_log: HealthEntry;
  attempts: Attempt;
  concerns: ConcernRow;
  goals: Goal;
  observations: Observation;
  notes: Note;
};
export type TableName = keyof Tables;
export const TABLES: TableName[] = ["accounts", "learners", "messages", "medications", "doses", "health_log", "attempts", "concerns", "goals", "observations", "notes"];
