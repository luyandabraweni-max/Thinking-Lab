// Public interface of the data module. Everything else in it is private (tools/check-boundaries.mjs enforces this).
export type { Account, AdultRole, Attempt, AvatarLook, ConcernRow, Consent, Goal, LearnerSettings, Note, PlanStep, RuleReview, SessionPlan, Observation, ProfilePlanRow, ProfileRating, ProfileReview, SchoolProfile, Dose, FamilyIntake, HealthEntry, IntakeTeam, IntakeValue, SupportProfile, Law, Learner, Medication, Message, Role, TableName, Tables, TeamMember } from "./types";
export { AccessDenied, canChangeConsent, canEditPlan, canKeepIntakeTeam, canKeepProfile, canSeeIntake, intakeShared, canEditHealth, canSeeHealth, canSeeLearner, isGuardian, isTeamMember } from "./access";
export { BLOCKED, IdbKv, MemoryKv, type Kv, type OutboxEntry } from "./kv";
export { defaultSettings, LearnerSpace, LocalStore, Session, type NewMedication, type ProfilePart } from "./store";
export { LocalSafeguarding, type ConcernRecord, type Safeguarding } from "./safeguarding";
export { prune, sync, type Changes, type SyncResult, type Transport, type Visible } from "./sync";
export { DEMO, DEMO_ACCOUNTS, DEMO_LEARNERS, seedDemo } from "./demo";
export { LocalOrgAdmin, type OrgAdmin, type OrgOverview, type StaffInvite, type StaffRow } from "./admin";
