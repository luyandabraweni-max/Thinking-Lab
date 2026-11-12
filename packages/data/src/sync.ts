import type { OutboxEntry } from "./kv";
import type { LocalStore } from "./store";
import type { TableName, Tables } from "./types";

// Sync (docs/system-design.md, section 9). A Transport is the only thing that knows which server is used:
// Supabase today, any other backend later, without touching the rest of the app.

export type Changes = { [T in TableName]?: Tables[T][] } & { visible?: Visible };
/** Which learners this person may still see, and whose health records: anything else on the device is removed. */
export interface Visible { learners: string[]; health: string[] }
const HEALTH: TableName[] = ["medications", "doses", "health_log"];
const BY_LEARNER: TableName[] = ["messages", "attempts", "concerns", "goals", "observations", "notes", ...HEALTH];

/** Removes what this device holds for learners the person can no longer see (for example, a family stopped sharing). */
export async function prune(store: LocalStore, v: Visible) {
  const see = new Set(v.learners), health = new Set(v.health);
  let removed = 0;
  const drop = async (t: TableName, ids: string[]) => { if (ids.length) { await store.kv.remove(t, ids); removed += ids.length; } };
  await drop("learners", (await store.kv.all("learners")).filter(L => !see.has(L.id)).map(L => L.id));
  await drop("learner_settings", (await store.kv.all("learner_settings")).filter(x => !see.has(x.id)).map(x => x.id));
  for (const t of BY_LEARNER) {
    const keep = HEALTH.includes(t) ? health : see;
    await drop(t, ((await store.kv.all(t)) as { id: string; learnerId: string }[]).filter(r => !keep.has(r.learnerId)).map(r => r.id));
  }
  return removed;
}
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
  const { visible, ...tables } = changes;
  for (const [table, rows] of Object.entries(tables) as [TableName, Tables[TableName][]][]) {
    const fresh = rows.filter(r => !waiting.has(`${table}:${r.id}`));
    await store.receive(table, fresh);
    received += fresh.length;
  }
  if (visible) await prune(store, visible);
  await store.kv.setMeta("cursor", cursor);
  return { sent, rejected, received, pending: (await store.kv.outbox()).length };
}
