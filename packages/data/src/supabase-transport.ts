import type { SupabaseClient } from "@supabase/supabase-js";
import type { OutboxEntry } from "./kv";
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
