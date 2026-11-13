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

/** How the platform adapts for one learner (docs/adaptation-rules.md). Shared by their family and team. */
export interface LearnerSettings {
  id: string; // the learner's id
  adaptAuto: boolean;
  adaptOff: Partial<Record<"sooner" | "shorter" | "breaks" | "fewer", boolean>>;
  levels: Partial<Record<string, number>>; // learning level per area
  decisions: Record<string, { d: "yes" | "no"; at: number }>;
  log: { date: string; text: string; by: string }[];
  /** The next session's plan, set by an adult; the learner takes it when their next session starts. */
  plan?: SessionPlan | null;
  /** The character the learner made (shown on their home, and to their family and team). */
  avatar?: AvatarLook | null;
  /** The learner's My way choices (screen, sound, ways of choosing), following them between devices. */
  prefs?: Record<string, unknown> | null;
  /** Grades 10 to 12: the maths the learner takes at school. Unset shows both Mathematics and Mathematical Literacy. */
  mathsSubject?: "maths" | "lit" | null;
  /** The curriculum the learner follows, when changed after they were added (otherwise the learner's own). */
  curriculum?: string | null;
  /** The plan the learner last took, and when. */
  lastPlan?: (SessionPlan & { used: string }) | null;
}
/** A learner's character (the 2to.iQ Avatar System): option names and colour numbers, and a made-up name. */
export interface AvatarLook { base: string; skin: number; hair: string; hairCol: number; eyes: string; mouth: string; extra: string; cloth: string; prop: string; top: number; bg: number; name: string }
/** One step: a kind ("lesson", "lab", "finish"), a game ("x:light") or a lesson ("u:<unit id>"), with what the learner sees. */
export interface PlanStep { key: string; pic: string; label: string }
export interface SessionPlan { steps: PlanStep[]; by: string; at: string }

/** A learner said they feel unsafe. Sent to the server for the safeguarding lead; never pulled back to devices. */
export interface ConcernRow { id: string; learnerId: string; at: string; where: "home" | "lesson" | "talk board" | "tell us" | "help" }

/** A specialist's view of one adaptation rule. Id: "<rule>:<user id>", one per rule per person. */
export interface RuleReview { id: string; rule: string; verdict: "agree" | "change" | "unsure"; comment: string; by: string; byName: string; profession: string; date: string }

/**
 * The school learner profile (Pholoso Afrika Foundation, School Neurodevelopmental Learner Profile v2.0): what the
 * school observes, rated, with the learner's own words and the support plan. Kept by the learner's teachers and
 * specialists, with the family's consent to record support needs. Each part is a map, and the server merges it key by
 * key, so two teachers rating different observations never overwrite each other.
 */
export interface SchoolProfile {
  id: string; // the learner's id
  answers: Record<string, string>; // the profile and school context (page 01), by question key
  voice: Record<string, string>; // in the learner's own words (page 03), by question key
  ratings: Record<string, ProfileRating>; // observations (page 04 and the phase page), by item id
  plan: Record<string, ProfilePlanRow>; // the support plan (page 12), by row id
  reviews: Record<string, ProfileReview>; // the baseline and the term reviews (page 15)
}
/** One rated observation. Impact and support use the pack's scales: 0 to 4, or -1 for not observed / not applicable. */
export interface ProfileRating { impact?: number | null; often?: string; support?: number | null; source?: string; evidence?: string; by?: string; at?: string }
export interface ProfilePlanRow {
  domain: string; barrier: string; strength: string; action: string; who: string; often: string; start: string; baseline: string;
  review: string; happened: string; learnerSays: string; decision: string; next: string; removed?: boolean; at: string;
}
/** Average impact per domain, taken when the baseline or a term review is saved. */
export interface ProfileReview { date: string; by: string; avg: Record<string, number> }

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
  learner_settings: LearnerSettings;
  rule_reviews: RuleReview;
  school_profiles: SchoolProfile;
};
export type TableName = keyof Tables;
export const TABLES: TableName[] = ["accounts", "learners", "messages", "medications", "doses", "health_log", "attempts", "concerns", "goals", "observations", "notes", "learner_settings", "rule_reviews", "school_profiles"];
