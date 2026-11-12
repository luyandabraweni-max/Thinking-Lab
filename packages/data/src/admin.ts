import type { LocalStore } from "./store";
import type { Account } from "./types";

// The organisation admin's view: totals and staff, never an individual learner's records. On the server this comes
// from org_overview (supabase/migrations/20261112040000_org_admin.sql).
export interface StaffRow { id: string; name: string; email: string; profession: string | null; learners: number; lead: boolean }
export interface StaffInvite { email: string; role: "teacher" | "specialist"; at: string }
export interface OrgOverview { name: string; learners: number; active30: number; openConcerns: number; staff: StaffRow[]; invites: StaffInvite[] }
export interface OrgAdmin {
  overview(): Promise<OrgOverview>;
  setLead(userId: string, on: boolean): Promise<void>;
  /** "added": they had an account and are now staff. "invited": they join when they register with this email. */
  addStaff(email: string, role: StaffInvite["role"]): Promise<"added" | "invited">;
  cancelInvite(email: string): Promise<void>;
  removeStaff(userId: string): Promise<void>;
}
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const demoInvites = new Map<string, StaffInvite[]>(); // demo mode: invitations for each organisation, on this device

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
      staff: staff.map(a => ({ id: a.id, name: a.name, email: a.email, profession: a.profession ?? null, learners: learners.filter(L => L.team.some(t => t.userId === a.id)).length, lead: !!a.safeguardingLead })),
      invites: [...this.invites]
    };
  }
  private get invites() { const k = this.me.orgId ?? ""; if (!demoInvites.has(k)) demoInvites.set(k, []); return demoInvites.get(k)!; }
  async addStaff(email: string, role: StaffInvite["role"]) {
    const e = email.trim().toLowerCase();
    if (!EMAIL.test(e)) throw new Error("Please check the email address");
    const a = (await this.store.accounts()).find(x => x.email.toLowerCase() === e);
    if (a) { await this.store.receive("accounts", [{ ...a, orgId: this.me.orgId, role }]); return "added" as const; }
    const list = this.invites.filter(i => i.email !== e);
    list.push({ email: e, role, at: new Date().toISOString() });
    demoInvites.set(this.me.orgId ?? "", list);
    return "invited" as const;
  }
  async cancelInvite(email: string) { demoInvites.set(this.me.orgId ?? "", this.invites.filter(i => i.email !== email.trim().toLowerCase())); }
  async removeStaff(userId: string) {
    if (userId === this.me.id) throw new Error("You can't remove yourself");
    const a = await this.store.account(userId);
    if (a && a.orgId === this.me.orgId) await this.store.receive("accounts", [{ ...a, orgId: null, safeguardingLead: false }]);
  }
  async setLead(userId: string, on: boolean) {
    const a = await this.store.account(userId);
    if (!a || a.orgId !== this.me.orgId) throw new Error("A safeguarding lead must be a teacher or specialist in the organisation");
    await this.store.receive("accounts", [{ ...a, safeguardingLead: on }]);
  }
}
