// Public interface of the data module. Everything else in it is private (tools/check-boundaries.mjs enforces this).
export type { Account, AdultRole, Attempt, ConcernRow, Consent, Goal, Note, Observation, Dose, HealthEntry, Law, Learner, Medication, Message, Role, TableName, Tables, TeamMember } from "./types";
export { AccessDenied, canChangeConsent, canEditPlan, canEditHealth, canSeeHealth, canSeeLearner, isGuardian, isTeamMember } from "./access";
export { IdbKv, MemoryKv, type Kv, type OutboxEntry } from "./kv";
export { LearnerSpace, LocalStore, Session, type NewMedication } from "./store";
export { LocalSafeguarding, type ConcernRecord, type Safeguarding } from "./safeguarding";
export { sync, type Changes, type SyncResult, type Transport } from "./sync";
export { DEMO, DEMO_ACCOUNTS, DEMO_LEARNERS, seedDemo } from "./demo";
export { LocalOrgAdmin, type OrgAdmin, type OrgOverview, type StaffRow } from "./admin";
