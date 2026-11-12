import { AccessDenied, canChangeConsent, canEditHealth, canSeeHealth, canSeeLearner } from "./access";
import type { Kv } from "./kv";
import type { Account, Attempt, ConcernRow, Consent, Dose, HealthEntry, Learner, Medication, Message, TableName, Tables } from "./types";

// Offline first (docs/system-design.md, section 9): every change is saved on the device and queued in the outbox
// in one step, so the learner and the adult never wait for the network. A Transport sends the outbox later.

const now = () => new Date().toISOString();
const newId = () => crypto.randomUUID();

export class LocalStore {
  constructor(readonly kv: Kv) {}

  /** Save a row locally and queue it for the server. Each outbox entry has its own id, so sending it twice does no harm. */
  async write<T extends TableName>(table: T, row: Tables[T]) {
    await this.kv.put(table, row);
    await this.kv.enqueue({ id: newId(), table, row, at: now() });
  }
  /** Rows that came from the server: saved locally, never queued again. */
  async receive<T extends TableName>(table: T, rows: Tables[T][]) { for (const r of rows) await this.kv.put(table, r); }

  async account(id: string) { return (await this.kv.all("accounts")).find(a => a.id === id) ?? null; }
  async accounts() { return this.kv.all("accounts"); }

  /** Everything a signed-in adult does goes through a session, which checks access before reading or writing. */
  as(me: Account) { return new Session(this, me); }

  /** A learner's own space on a device an adult on their team opened for them (the adult vouches for it when syncing). */
  async learnerSpace(adult: Account, learnerId: string) {
    const L = (await this.kv.all("learners")).find(l => l.id === learnerId);
    if (!L || !canSeeLearner(adult, L)) throw new AccessDenied("this learner");
    return new LearnerSpace(this, L);
  }
}

export class LearnerSpace {
  constructor(private store: LocalStore, readonly learner: Learner) {}
  /** Messages the team sent to the learner, and the learner's own replies. Team-only messages never show here. */
  async inbox() {
    return (await this.store.kv.all("messages")).filter(m => m.learnerId === this.learner.id && (m.audience === "learner" || m.fromRole === "learner"))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
  async reply(body: string) {
    const text = body.trim();
    if (!text) throw new Error("A message needs some words.");
    const m: Message = { id: newId(), learnerId: this.learner.id, fromId: this.learner.id, fromName: this.learner.nickname, fromRole: "learner", audience: "team", body: text, createdAt: now(), readBy: [this.learner.id] };
    await this.store.write("messages", m);
    return m;
  }
  async markRead() {
    for (const m of await this.inbox()) if (!m.readBy.includes(this.learner.id)) await this.store.write("messages", { ...m, readBy: [...m.readBy, this.learner.id] });
  }
  /** Saves what the learner did in a game or lesson, one entry per question or round. */
  async record(entries: Omit<Attempt, "id" | "learnerId">[]) {
    for (const e of entries) await this.store.write("attempts", { ...e, id: newId(), learnerId: this.learner.id });
  }
  /** The learner said they feel unsafe: kept on this device for the adult here, and sent to the safeguarding lead. */
  async reportConcern(where: ConcernRow["where"]) {
    await this.store.write("concerns", { id: newId(), learnerId: this.learner.id, at: now(), where });
  }
  /** Earlier work, oldest first: the history the adaptation rules read. */
  async history() {
    return (await this.store.kv.all("attempts")).filter(a => a.learnerId === this.learner.id).sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  }
}

export interface NewMedication { name: string; dose: string; schedule: string; reason: string }

export class Session {
  constructor(private store: LocalStore, readonly me: Account) {}
  private get kv() { return this.store.kv; }

  private async learnerFor(id: string, check: (me: Account, L: Learner) => boolean, what: string) {
    const L = (await this.kv.all("learners")).find(l => l.id === id);
    if (!L || !check(this.me, L)) throw new AccessDenied(what);
    return L;
  }

  async learners() { return (await this.kv.all("learners")).filter(L => canSeeLearner(this.me, L)); }
  learner(id: string) { return this.learnerFor(id, canSeeLearner, "this learner"); }

  // ---------- Messages ----------
  async messages(learnerId: string) {
    await this.learner(learnerId);
    return (await this.kv.all("messages")).filter(m => m.learnerId === learnerId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
  async unread(learnerId: string) { return (await this.messages(learnerId)).filter(m => !m.readBy.includes(this.me.id)).length; }
  async send(learnerId: string, body: string, audience: Message["audience"] = "team") {
    await this.learner(learnerId);
    const text = body.trim();
    if (!text) throw new Error("A message needs some words.");
    const m: Message = { id: newId(), learnerId, fromId: this.me.id, fromName: this.me.name, fromRole: this.me.role, audience, body: text, createdAt: now(), readBy: [this.me.id] };
    await this.store.write("messages", m);
    return m;
  }
  async markRead(learnerId: string) {
    for (const m of await this.messages(learnerId)) if (!m.readBy.includes(this.me.id)) await this.store.write("messages", { ...m, readBy: [...m.readBy, this.me.id] });
  }

  // ---------- Health: entered by the family, shared with the team only with consent, never in reports ----------
  private healthRead(learnerId: string) { return this.learnerFor(learnerId, canSeeHealth, "this learner's health records"); }
  private healthWrite(learnerId: string) { return this.learnerFor(learnerId, canEditHealth, "changing health records (only the family can)"); }
  private async log(learnerId: string, text: string) {
    const e: HealthEntry = { id: newId(), learnerId, at: now(), by: this.me.name, text };
    await this.store.write("health_log", e);
  }
  async medications(learnerId: string) { await this.healthRead(learnerId); return (await this.kv.all("medications")).filter(m => m.learnerId === learnerId); }
  async doses(learnerId: string) { await this.healthRead(learnerId); return (await this.kv.all("doses")).filter(d => d.learnerId === learnerId).sort((a, b) => b.givenAt.localeCompare(a.givenAt)); }
  async healthLog(learnerId: string) { await this.healthRead(learnerId); return (await this.kv.all("health_log")).filter(e => e.learnerId === learnerId).sort((a, b) => b.at.localeCompare(a.at)); }

  async addMedication(learnerId: string, input: NewMedication) {
    await this.healthWrite(learnerId);
    const name = input.name.trim(), dose = input.dose.trim();
    if (!name || !dose) throw new Error("A medicine needs a name and a dose.");
    const m: Medication = { id: newId(), learnerId, name, dose, schedule: input.schedule.trim(), reason: input.reason.trim(), startedOn: now().slice(0, 10), stoppedOn: null, createdBy: this.me.id };
    await this.store.write("medications", m);
    await this.log(learnerId, `Started ${[m.name, m.dose, m.schedule].filter(Boolean).join(", ")}`);
    return m;
  }
  async stopMedication(learnerId: string, medicationId: string) {
    await this.healthWrite(learnerId);
    const m = (await this.kv.all("medications")).find(x => x.id === medicationId && x.learnerId === learnerId);
    if (!m || m.stoppedOn) return;
    await this.store.write("medications", { ...m, stoppedOn: now().slice(0, 10) });
    await this.log(learnerId, `Stopped ${m.name}`);
  }
  async recordDose(learnerId: string, medicationId: string, note = "") {
    await this.healthWrite(learnerId);
    const d: Dose = { id: newId(), learnerId, medicationId, givenAt: now(), givenBy: this.me.name, note: note.trim() };
    await this.store.write("doses", d);
    return d;
  }

  /** The family decides, per person, who on the team may see health records. */
  async setHealthAccess(learnerId: string, userId: string, on: boolean) {
    const L = await this.learnerFor(learnerId, canChangeConsent, "changing who sees health records (only the family can)");
    await this.store.write("learners", { ...L, team: L.team.map(t => (t.userId === userId ? { ...t, healthAccess: on } : t)) });
  }

  /** Concerns the learner raised on this device (see LearnerSpace.reportConcern). */
  async concernsOnDevice(learnerId: string): Promise<ConcernRow[]> {
    await this.learner(learnerId);
    return (await this.kv.all("concerns")).filter(c => c.learnerId === learnerId);
  }

  // ---------- Consent ----------
  async setConsent(learnerId: string, patch: Partial<Omit<Consent, "law" | "updatedAt">>) {
    const L = await this.learnerFor(learnerId, canChangeConsent, "changing consent (only the family can)");
    await this.store.write("learners", { ...L, consent: { ...L.consent, ...patch, updatedAt: now() } });
  }
}
