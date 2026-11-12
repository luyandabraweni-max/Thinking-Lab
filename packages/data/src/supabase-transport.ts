import type { SupabaseClient } from "@supabase/supabase-js";
import type { OutboxEntry } from "./kv";
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
