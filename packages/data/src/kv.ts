import { openDB, type IDBPDatabase } from "idb";
import { TABLES, type TableName, type Tables } from "./types";

// Where rows are kept on the device. IndexedDB in browsers and in the iOS and Android apps; memory in tests and demos.
// SQLite on phones (docs/system-design.md, section 8) can be added later behind this same interface.

export interface OutboxEntry { id: string; table: TableName; row: Tables[TableName]; at: string }

export interface Kv {
  all<T extends TableName>(table: T): Promise<Tables[T][]>;
  put<T extends TableName>(table: T, row: Tables[T]): Promise<void>;
  outbox(): Promise<OutboxEntry[]>;
  enqueue(entry: OutboxEntry): Promise<void>;
  dequeue(ids: string[]): Promise<void>;
  getMeta(key: string): Promise<string | null>;
  setMeta(key: string, value: string): Promise<void>;
  clear(): Promise<void>;
}

const clone = <T>(v: T): T => structuredClone(v);

export class MemoryKv implements Kv {
  private rows = new Map<TableName, Map<string, unknown>>();
  private queue: OutboxEntry[] = [];
  private meta = new Map<string, string>();
  private table(t: TableName) { let m = this.rows.get(t); if (!m) this.rows.set(t, (m = new Map())); return m; }
  async all<T extends TableName>(t: T) { return [...this.table(t).values()].map(r => clone(r)) as Tables[T][]; }
  async put<T extends TableName>(t: T, row: Tables[T]) { this.table(t).set(row.id, clone(row)); }
  async outbox() { return clone(this.queue); }
  async enqueue(e: OutboxEntry) { this.queue.push(clone(e)); }
  async dequeue(ids: string[]) { this.queue = this.queue.filter(e => !ids.includes(e.id)); }
  async getMeta(k: string) { return this.meta.get(k) ?? null; }
  async setMeta(k: string, v: string) { this.meta.set(k, v); }
  async clear() { this.rows.clear(); this.queue = []; this.meta.clear(); }
}

export class IdbKv implements Kv {
  private db: Promise<IDBPDatabase>;
  constructor(name = "thinking-lab") {
    this.db = openDB(name, 5, {
      upgrade(db) { // version 2 added attempts, 3 concerns, 4 goals, observations and notes, 5 learner settings; creating only what's missing upgrades older devices in place
        for (const t of TABLES) if (!db.objectStoreNames.contains(t)) db.createObjectStore(t, { keyPath: "id" });
        if (!db.objectStoreNames.contains("outbox")) db.createObjectStore("outbox", { keyPath: "id" });
        if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta");
      }
    });
  }
  async all<T extends TableName>(t: T) { return (await (await this.db).getAll(t)) as Tables[T][]; }
  async put<T extends TableName>(t: T, row: Tables[T]) { await (await this.db).put(t, row); }
  async outbox() { const all = (await (await this.db).getAll("outbox")) as OutboxEntry[]; return all.sort((a, b) => a.at.localeCompare(b.at)); }
  async enqueue(e: OutboxEntry) { await (await this.db).put("outbox", e); }
  async dequeue(ids: string[]) { const tx = (await this.db).transaction("outbox", "readwrite"); await Promise.all([...ids.map(id => tx.store.delete(id)), tx.done]); }
  async getMeta(k: string) { return ((await (await this.db).get("meta", k)) as string | undefined) ?? null; }
  async setMeta(k: string, v: string) { await (await this.db).put("meta", v, k); }
  async clear() { const db = await this.db; await Promise.all([...TABLES, "outbox", "meta"].map(t => db.clear(t))); }
}
