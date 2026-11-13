import { isTeamMember } from "./access";
import type { LocalStore } from "./store";
import type { Account } from "./types";

// Safeguarding concerns for the designated safeguarding lead (docs/system-design.md, section 13). On the server they
// can only be read through a function that logs every read (supabase/migrations/20261112010000_safeguarding.sql).
export interface ConcernRecord { id: string; learnerId: string; nickname: string; raisedAt: string; raisedFrom: string; status: "open" | "followed up"; action: string; closedAt: string | null }
export interface Safeguarding {
  concerns(): Promise<ConcernRecord[]>;
  followUp(id: string, action: string): Promise<void>;
}

/** Demo mode: concerns on this device, for a lead on the learner's team. */
export class LocalSafeguarding implements Safeguarding {
  constructor(private store: LocalStore, private me: Account) {}
  async concerns() {
    if (!this.me.safeguardingLead) return [];
    const learners = await this.store.kv.all("learners"), done = JSON.parse((await this.store.kv.getMeta("concern-follow-up")) ?? "{}") as Record<string, { action: string; at: string }>;
    return (await this.store.kv.all("concerns")).flatMap(c => {
      const L = learners.find(l => l.id === c.learnerId);
      if (!L || !isTeamMember(this.me, L)) return [];
      const f = done[c.id];
      return [{ id: c.id, learnerId: c.learnerId, nickname: L.nickname, raisedAt: c.at, raisedFrom: c.where, status: f ? "followed up" as const : "open" as const, action: f?.action ?? "", closedAt: f?.at ?? null }];
    }).sort((a, b) => a.status.localeCompare(b.status) || b.raisedAt.localeCompare(a.raisedAt));
  }
  async followUp(id: string, action: string) {
    if (!(await this.concerns()).some(c => c.id === id)) throw new Error("Not allowed");
    const done = JSON.parse((await this.store.kv.getMeta("concern-follow-up")) ?? "{}") as Record<string, { action: string; at: string }>;
    done[id] = { action: action.trim().slice(0, 2000), at: new Date().toISOString() };
    await this.store.kv.setMeta("concern-follow-up", JSON.stringify(done));
  }
}
