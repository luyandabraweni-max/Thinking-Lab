import type { Account, Learner } from "./types";

// Who may see and change what. The database enforces the same rules (supabase/migrations), so a bug here can
// never leak data; these copies let the app hide what a person can't use and work the same way offline.

export const isGuardian = (me: Account, L: Learner) => me.role === "guardian" && L.guardianIds.includes(me.id);
const member = (me: Account, L: Learner) => L.team.find(t => t.userId === me.id);
export const isTeamMember = (me: Account, L: Learner) => (me.role === "teacher" || me.role === "specialist") && L.consent.share && !!member(me, L);

/** Guardians see their own children; teachers and specialists see learners shared with them; admins see no learner records. */
export const canSeeLearner = (me: Account, L: Learner) => isGuardian(me, L) || isTeamMember(me, L);
/** Health records: the family always; a team member only with health consent and health access granted to them. */
export const canSeeHealth = (me: Account, L: Learner) => isGuardian(me, L) || (isTeamMember(me, L) && L.consent.health && !!member(me, L)?.healthAccess);
/** Only the family records medication and doses. */
export const canEditHealth = (me: Account, L: Learner) => isGuardian(me, L);
/** Only the family changes consent. */
export const canChangeConsent = (me: Account, L: Learner) => isGuardian(me, L);

export class AccessDenied extends Error {
  constructor(what: string) { super(`Not allowed: ${what}`); this.name = "AccessDenied"; }
}
/** Support-plan goals, observations and notes are written by teachers and specialists on the learner's team. */
export const canEditPlan = (me: Account, L: Learner) => isTeamMember(me, L);
/** The school learner profile: the learner's teachers and specialists, and only once the family agreed to support needs being recorded. */
export const canKeepProfile = (me: Account, L: Learner) => isTeamMember(me, L) && L.consent.support;
