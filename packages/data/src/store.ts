import { AccessDenied, canChangeConsent, canEditHealth, canEditPlan, canKeepProfile, canSeeHealth, canSeeLearner, isTeamMember } from "./access";
import type { Kv } from "./kv";
import type { Account, Attempt, AvatarLook, ConcernRow, Consent, Goal, LearnerSettings, PlanStep, ProfileRating, RuleReview, SchoolProfile, SessionPlan, Note, Observation, Dose, HealthEntry, Learner, Medication, Message, TableName, Tables } from "./types";

// Offline first (docs/system-design.md, section 9): every change is saved on the device and queued in the outbox
// in one step, so the learner and the adult never wait for the network. A Transport sends the outbox later.

const now = () => new Date().toISOString();
export const defaultSettings = (learnerId: string): LearnerSettings => ({ id: learnerId, adaptAuto: true, adaptOff: {}, levels: {}, decisions: {}, log: [] });
const settingsOf = async (kv: Kv, learnerId: string) => (await kv.all("learner_settings")).find(x => x.id === learnerId) ?? defaultSettings(learnerId);
const newId = () => crypto.randomUUID();
const emptyProfile = (id: string): SchoolProfile => ({ id, answers: {}, voice: {}, ratings: {}, plan: {}, reviews: {} });
export type ProfilePart = "answers" | "voice" | "ratings" | "plan" | "reviews";

export class LocalStore {
  constructor(readonly kv: Kv) {}

  /** Save a row locally and queue it for the server. Each outbox entry has its own id, so sending it twice does no harm. */
  async write<T extends TableName>(table: T, row: Tables[T]) {
    await this.kv.put(table, row);
    await this.kv.enqueue({ id: newId(), table, row, at: now() });
  }
  /** Save a whole row locally, but send only the fields that changed: an older copy on this device never undoes newer changes. */
  async writeChanges<T extends TableName>(table: T, row: Tables[T], changed: Partial<Tables[T]>) {
    await this.kv.put(table, row);
    await this.kv.enqueue({ id: newId(), table, row: { ...changed, id: row.id } as Tables[T], at: now() });
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
  /** How the adults around the learner set the adaptation rules and levels. */
  settings() { return settingsOf(this.store.kv, this.learner.id); }
  /** Save the character the learner made. Their family and team see it. */
  async setAvatar(look: AvatarLook) {
    const cur = await this.settings();
    await this.store.writeChanges("learner_settings", { ...cur, avatar: look }, { avatar: look });
  }
  /** The learner's My way choices, so they follow the learner to the family's and the team's devices. */
  async setPrefs(prefs: Record<string, unknown>) {
    const cur = await this.settings();
    await this.store.writeChanges("learner_settings", { ...cur, prefs }, { prefs });
  }
  /** The plan an adult made for this session, if there is one. Taking it clears it, so it is used once. */
  async takePlan(): Promise<SessionPlan | null> {
    const cur = await this.settings();
    if (!cur.plan?.steps.length) return null;
    const lastPlan = { ...cur.plan, used: now().slice(0, 10) };
    await this.store.writeChanges("learner_settings", { ...cur, plan: null, lastPlan }, { plan: null, lastPlan });
    return cur.plan;
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

  /** The learner's saved work, oldest first, for the adaptation rules and the adults' views. */
  async attempts(learnerId: string) {
    await this.learner(learnerId);
    return (await this.kv.all("attempts")).filter(a => a.learnerId === learnerId).sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  }

  // ---------- How the platform adapts for the learner ----------
  async settings(learnerId: string) { await this.learner(learnerId); return settingsOf(this.kv, learnerId); }
  /** The family and the team change these; every change is logged with who made it. */
  async changeSettings(learnerId: string, patch: Partial<Omit<LearnerSettings, "id" | "log">>, logText: string) {
    const L = await this.learner(learnerId);
    if (!(canChangeConsent(this.me, L) || isTeamMember(this.me, L))) throw new AccessDenied("changing how the platform adapts");
    const cur = await settingsOf(this.kv, learnerId);
    const entry = { date: now().slice(0, 10), text: logText, by: this.me.name };
    const next: LearnerSettings = { ...cur, ...patch, log: [...cur.log, entry] };
    await this.store.writeChanges("learner_settings", next, { ...patch, log: [entry] }); // the server keeps every log entry
    return next;
  }
  /** Plan the learner's next session: up to 5 steps, or none to clear it. */
  async setPlan(learnerId: string, steps: PlanStep[] | null) {
    if (steps && steps.length > 5) throw new Error("A plan has at most 5 steps.");
    const plan = steps?.length ? { steps, by: this.me.name, at: now() } : null;
    return this.changeSettings(learnerId, { plan }, plan ? `Next session planned: ${steps!.map(x => x.label).join(", ")}` : "Next-session plan cleared");
  }

  // ---------- Specialists review the adaptation rules ----------
  get canReviewRules() { return this.me.role === "teacher" || this.me.role === "specialist"; }
  /** Reviews this device has: the adult's own, and their colleagues' (the server sends only those). */
  async ruleReviews() { return this.canReviewRules ? (await this.kv.all("rule_reviews")).sort((a, b) => a.date.localeCompare(b.date)) : []; }
  async reviewRule(rule: string, verdict: RuleReview["verdict"], comment: string) {
    if (!this.canReviewRules) throw new AccessDenied("reviewing the adaptation rules (teachers and specialists only)");
    const text = comment.trim().slice(0, 800);
    const r: RuleReview = { id: `${rule}:${this.me.id}`, rule, verdict, comment: text, by: this.me.id, byName: this.me.name, profession: this.me.profession ?? "", date: now().slice(0, 10) };
    await this.store.write("rule_reviews", r);
    return r;
  }

  // ---------- Support plan: goals, observations and notes ----------
  private planWrite(learnerId: string) { return this.learnerFor(learnerId, canEditPlan, "changing the support plan (only the learner's teachers and specialists can)"); }
  async goals(learnerId: string) {
    await this.learner(learnerId);
    return (await this.kv.all("goals")).filter(g => g.learnerId === learnerId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
  async observations(learnerId: string) {
    await this.learner(learnerId);
    return (await this.kv.all("observations")).filter(o => o.learnerId === learnerId).sort((a, b) => a.at.localeCompare(b.at));
  }
  async addGoal(learnerId: string, input: { text: string; area: string; target?: string }) {
    await this.planWrite(learnerId);
    const text = input.text.trim();
    if (!text) throw new Error("A goal needs some words.");
    const g: Goal = { id: newId(), learnerId, text: text.slice(0, 500), area: input.area, status: "todo", target: input.target ?? "", createdBy: this.me.id, createdAt: now() };
    await this.store.write("goals", g);
    return g;
  }
  async setGoalStatus(learnerId: string, goalId: string, status: Goal["status"]) {
    await this.planWrite(learnerId);
    const g = (await this.kv.all("goals")).find(x => x.id === goalId && x.learnerId === learnerId);
    if (g && g.status !== status) await this.store.write("goals", { ...g, status });
  }
  /** What the team saw. Seeing it done alone moves a goal that hadn't started to "working on it". */
  async observe(learnerId: string, goalId: string, level: Observation["level"], note = "") {
    await this.planWrite(learnerId);
    const o: Observation = { id: newId(), goalId, learnerId, level, note: note.trim().slice(0, 400), by: this.me.id, byName: this.me.name, at: now() };
    await this.store.write("observations", o);
    if (level === "alone") { const g = (await this.kv.all("goals")).find(x => x.id === goalId); if (g?.status === "todo") await this.store.write("goals", { ...g, status: "doing" }); }
    return o;
  }
  /** The team sees every note; the family sees only notes shared with them. */
  async notes(learnerId: string) {
    const L = await this.learner(learnerId), team = isTeamMember(this.me, L);
    return (await this.kv.all("notes")).filter(n => n.learnerId === learnerId && (team || n.shareFamily)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  async addNote(learnerId: string, body: string, shareFamily: boolean) {
    await this.planWrite(learnerId);
    const text = body.trim();
    if (!text) throw new Error("A note needs some words.");
    const n: Note = { id: newId(), learnerId, authorId: this.me.id, authorName: this.me.name, body: text.slice(0, 4000), shareFamily, createdAt: now() };
    await this.store.write("notes", n);
    return n;
  }

  /** Concerns the learner raised on this device (see LearnerSpace.reportConcern). */
  async concernsOnDevice(learnerId: string): Promise<ConcernRow[]> {
    await this.learner(learnerId);
    return (await this.kv.all("concerns")).filter(c => c.learnerId === learnerId);
  }

  // ---------- The school learner profile ----------
  private profileFor(learnerId: string) {
    return this.learnerFor(learnerId, canKeepProfile, "the school learner profile (only the learner's teachers and specialists, once the family agreed to support needs being recorded)");
  }
  /** Whether this person may keep the learner's school profile. */
  async mayKeepProfile(learnerId: string) { return canKeepProfile(this.me, await this.learner(learnerId)); }
  async schoolProfile(learnerId: string): Promise<SchoolProfile> {
    await this.profileFor(learnerId);
    return (await this.kv.all("school_profiles")).find(p => p.id === learnerId) ?? emptyProfile(learnerId);
  }
  /** Profiles for every learner this person may keep one for (the class and caseload tracker). */
  async schoolProfiles() {
    const ls = (await this.learners()).filter(L => canKeepProfile(this.me, L)), all = await this.kv.all("school_profiles");
    return ls.map(L => ({ learner: L, profile: all.find(p => p.id === L.id) ?? emptyProfile(L.id) }));
  }
  /** Change some keys in one part of the profile. Only those keys are sent, and the server merges them into what it holds. */
  async updateProfile<K extends ProfilePart>(learnerId: string, part: K, patch: SchoolProfile[K]) {
    const cur = await this.schoolProfile(learnerId);
    const stamped = (part === "ratings"
      ? Object.fromEntries(Object.entries(patch as Record<string, ProfileRating>).map(([k, r]) => [k, { ...r, by: this.me.name, at: now() }]))
      : patch) as SchoolProfile[K];
    const next: SchoolProfile = { ...cur, [part]: { ...cur[part], ...stamped } };
    await this.store.writeChanges("school_profiles", next, { [part]: stamped } as Partial<SchoolProfile>);
    return next;
  }

  // ---------- Consent ----------
  async setConsent(learnerId: string, patch: Partial<Omit<Consent, "law" | "updatedAt">>) {
    const L = await this.learnerFor(learnerId, canChangeConsent, "changing consent (only the family can)");
    await this.store.write("learners", { ...L, consent: { ...L.consent, ...patch, updatedAt: now() } });
  }
}
