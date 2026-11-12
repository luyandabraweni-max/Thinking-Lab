import type { LocalStore } from "./store";
import type { Account } from "./types";

// The organisation admin's view: totals and staff, never an individual learner's records. On the server this comes
// from org_overview (supabase/migrations/20261112040000_org_admin.sql).
export interface StaffRow { id: string; name: string; email: string; profession: string | null; learners: number; lead: boolean }
export interface OrgOverview { name: string; learners: number; active30: number; openConcerns: number; staff: StaffRow[] }
export interface OrgAdmin {
  overview(): Promise<OrgOverview>;
  setLead(userId: string, on: boolean): Promise<void>;
}

/** Demo mode: the organisation's staff on this device. */
export class LocalOrgAdmin implements OrgAdmin {
  constructor(private store: LocalStore, private me: Account) {}
  async overview(): Promise<OrgOverview> {
    const accounts = await this.store.accounts(), staff = accounts.filter(a => a.orgId === this.me.orgId && (a.role === "teacher" || a.role === "specialist"));
    const learners = (await this.store.kv.all("learners")).filter(L => L.orgId === this.me.orgId || L.team.some(t => staff.some(s => s.id === t.userId)));
    const since = new Date(Date.now() - 30 * 864e5).toISOString(), ids = new Set(learners.map(L => L.id));
    return {
      name: "Demo Special School", learners: learners.length,
      active30: new Set((await this.store.kv.all("attempts")).filter(a => ids.has(a.learnerId) && a.occurredAt > since).map(a => a.learnerId)).size,
      openConcerns: (await this.store.kv.all("concerns")).filter(c => ids.has(c.learnerId)).length,
      staff: staff.map(a => ({ id: a.id, name: a.name, email: a.email, profession: a.profession ?? null, learners: learners.filter(L => L.team.some(t => t.userId === a.id)).length, lead: !!a.safeguardingLead }))
    };
  }
  async setLead(userId: string, on: boolean) {
    const a = await this.store.account(userId);
    if (!a || a.orgId !== this.me.orgId) throw new Error("A safeguarding lead must be a teacher or specialist in the organisation");
    await this.store.receive("accounts", [{ ...a, safeguardingLead: on }]);
  }
}
