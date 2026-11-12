import type { OutboxEntry } from "./kv";
import type { LocalStore } from "./store";
import type { TableName, Tables } from "./types";

// Sync (docs/system-design.md, section 9). A Transport is the only thing that knows which server is used:
// Supabase today, any other backend later, without touching the rest of the app.

export type Changes = { [T in TableName]?: Tables[T][] };
export interface Transport {
  /** Send queued changes. The server applies each entry once; entries it refuses (for example, not allowed) come back as rejected. */
  push(batch: OutboxEntry[]): Promise<{ applied: string[]; rejected: { id: string; reason: string }[] }>;
  /** Changes made elsewhere since the cursor, and the cursor to use next time. */
  pull(since: string | null): Promise<{ changes: Changes; cursor: string }>;
}

export interface SyncResult { sent: number; rejected: { id: string; reason: string }[]; received: number; pending: number }
const BATCH = 200;

export async function sync(store: LocalStore, transport: Transport): Promise<SyncResult> {
  let sent = 0;
  const rejected: SyncResult["rejected"] = [];
  for (;;) {
    const batch = (await store.kv.outbox()).slice(0, BATCH);
    if (!batch.length) break;
    const res = await transport.push(batch); // a network failure throws, and everything stays queued for next time
    const done = res.applied.concat(res.rejected.map(r => r.id));
    if (!done.length) break;
    await store.kv.dequeue(done); // a refused change will never be accepted, so it isn't retried forever
    sent += res.applied.length;
    rejected.push(...res.rejected);
  }
  const { changes, cursor } = await transport.pull(await store.kv.getMeta("cursor"));
  // A row with a change still waiting to be sent keeps the local version; the server gets it on the next sync.
  const waiting = new Set((await store.kv.outbox()).map(e => `${e.table}:${e.row.id}`));
  let received = 0;
  for (const [table, rows] of Object.entries(changes) as [TableName, Tables[TableName][]][]) {
    const fresh = rows.filter(r => !waiting.has(`${table}:${r.id}`));
    await store.receive(table, fresh);
    received += fresh.length;
  }
  await store.kv.setMeta("cursor", cursor);
  return { sent, rejected, received, pending: (await store.kv.outbox()).length };
}
