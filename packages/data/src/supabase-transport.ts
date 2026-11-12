import type { SupabaseClient } from "@supabase/supabase-js";
import type { OutboxEntry } from "./kv";
import type { OrgAdmin, OrgOverview } from "./admin";
import type { ConcernRecord, Safeguarding } from "./safeguarding";
import type { Changes, Transport } from "./sync";

// The only file that knows the server is Supabase. Moving to another Postgres host means a new Transport that calls the
// same two database functions (supabase/migrations: sync_push and sync_pull); nothing else in the app changes.
export class SupabaseTransport implements Transport {
  constructor(private client: SupabaseClient) {}

  async push(batch: OutboxEntry[]) {
    const { data, error } = await this.client.rpc("sync_push", { entries: batch });
    if (error) throw new Error(`Sync failed: ${error.message}`);
    return data as { applied: string[]; rejected: { id: string; reason: string }[] };
  }

  async pull(since: string | null) {
    const { data, error } = await this.client.rpc("sync_pull", { since });
    if (error) throw new Error(`Sync failed: ${error.message}`);
    return data as { changes: Changes; cursor: string };
  }
}

/** Safeguarding concerns from the server: read through a function that only answers leads and logs each read. */
export class SupabaseSafeguarding implements Safeguarding {
  constructor(private client: SupabaseClient) {}
  async concerns() {
    const { data, error } = await this.client.rpc("safeguarding_concerns");
    if (error) throw new Error(error.message);
    return (data as { id: string; learner_id: string; nickname: string; raised_at: string; raised_from: string; status: ConcernRecord["status"]; action: string; closed_at: string | null }[])
      .map(r => ({ id: r.id, learnerId: r.learner_id, nickname: r.nickname, raisedAt: r.raised_at, raisedFrom: r.raised_from, status: r.status, action: r.action, closedAt: r.closed_at }));
  }
  async followUp(id: string, action: string) {
    const { error } = await this.client.rpc("follow_up_concern", { p_id: id, p_action: action });
    if (error) throw new Error(error.message);
  }
}

/** The organisation admin's totals and staff, from a function that only answers that organisation's admins. */
export class SupabaseOrgAdmin implements OrgAdmin {
  constructor(private client: SupabaseClient, private orgId: string) {}
  async overview() {
    const { data, error } = await this.client.rpc("org_overview", { p_org: this.orgId });
    if (error) throw new Error(error.message);
    return data as OrgOverview;
  }
  async setLead(userId: string, on: boolean) {
    const { error } = await this.client.rpc("set_safeguarding_lead", { p_org: this.orgId, p_user: userId, p_on: on });
    if (error) throw new Error(error.message);
  }
  async addStaff(email: string, role: "teacher" | "specialist") {
    const { data, error } = await this.client.rpc("invite_staff", { p_org: this.orgId, p_email: email, p_role: role });
    if (error) throw new Error(error.message);
    return data as "added" | "invited";
  }
  async cancelInvite(email: string) {
    const { error } = await this.client.rpc("cancel_staff_invite", { p_org: this.orgId, p_email: email });
    if (error) throw new Error(error.message);
  }
  async removeStaff(userId: string) {
    const { error } = await this.client.rpc("remove_staff", { p_org: this.orgId, p_user: userId });
    if (error) throw new Error(error.code === "PGRST202" ? "Removing staff isn't switched on yet. The project owner needs to approve one database change (supabase/migrations/20261112082000_remove_staff.sql)." : error.message);
  }
}
