import type { LocalStore } from "./store";
import type { Account, Learner } from "./types";

// A family adds teachers and specialists to their child's team by email, and can take them off again. On the server
// this is invite_to_team, cancel_team_invite and team_invites_for (supabase/migrations/20261125090000_team_invites.sql).
export interface TeamInvite { email: string; at: string }
export interface TeamSharing {
  /** Invitations still waiting for the person to register. */
  invites(learnerId: string): Promise<TeamInvite[]>;
  /** "added": they have a teacher or specialist account and are on the team now. "invited": they join when they register. */
  add(learnerId: string, email: string): Promise<"added" | "invited">;
  cancel(learnerId: string, email: string): Promise<void>;
  /** Takes someone off the child's team. They no longer see the child. */
  remove(learnerId: string, userId: string): Promise<void>;
}
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const demoInvites = new Map<string, TeamInvite[]>(); // demo mode: each child's invitations, on this device

/** Demo mode: the child's team on this device. Same rules as the server. */
export class LocalTeamSharing implements TeamSharing {
  constructor(private store: LocalStore, private me: Account) {}
  private async family(learnerId: string): Promise<Learner> {
    const L = (await this.store.kv.all("learners")).find(x => x.id === learnerId);
    if (!L || !L.guardianIds.includes(this.me.id)) throw new Error("Only the child's parent or guardian can change the team");
    return L;
  }
  async invites(learnerId: string) { await this.family(learnerId); return [...(demoInvites.get(learnerId) ?? [])]; }
  async add(learnerId: string, email: string) {
    const L = await this.family(learnerId), e = email.trim().toLowerCase();
    if (!EMAIL.test(e)) throw new Error("Please check the email address");
    const a = (await this.store.accounts()).find(x => x.email.toLowerCase() === e);
    if (a) {
      if (a.id === this.me.id) throw new Error("That's your own email address");
      if (a.role !== "teacher" && a.role !== "specialist") throw new Error("That email belongs to a family account. Only teachers and specialists can join a child's team");
      if (!L.team.some(t => t.userId === a.id)) await this.store.receive("learners", [{ ...L, team: [...L.team, { userId: a.id, healthAccess: false }] }]);
      return "added" as const;
    }
    demoInvites.set(learnerId, [...(demoInvites.get(learnerId) ?? []).filter(i => i.email !== e), { email: e, at: new Date().toISOString() }]);
    return "invited" as const;
  }
  async cancel(learnerId: string, email: string) {
    await this.family(learnerId);
    demoInvites.set(learnerId, (demoInvites.get(learnerId) ?? []).filter(i => i.email !== email.trim().toLowerCase()));
  }
  async remove(learnerId: string, userId: string) {
    const L = await this.family(learnerId);
    await this.store.receive("learners", [{ ...L, team: L.team.filter(t => t.userId !== userId) }]);
  }
}
