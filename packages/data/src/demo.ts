import type { LocalStore } from "./store";
import type { Account, Learner, Medication, Message } from "./types";

// Made-up people and records so every screen has something to show before a server is connected.
// Ids follow the same uuid format the database uses.
const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
export const DEMO = { parent: id(1), specialist: id(3), therapist: id(4), admin: id(5), kid: id(101), teen: id(102), org: id(900) };

export const DEMO_ACCOUNTS: Account[] = [
  { id: DEMO.parent, role: "guardian", name: "Demo Parent", email: "parent@example.org", orgId: DEMO.org },
  { id: DEMO.specialist, role: "specialist", name: "Demo Specialist", email: "specialist@example.org", orgId: DEMO.org, profession: "Special-needs educator", safeguardingLead: true },
  { id: DEMO.therapist, role: "specialist", name: "Demo Therapist", email: "therapist@example.org", orgId: DEMO.org, profession: "Occupational therapist" },
  { id: DEMO.admin, role: "org_admin", name: "Demo School Admin", email: "admin@example.org", orgId: DEMO.org, profession: "School administrator" }
];

const consent = (health: boolean) => ({ guardian: true, support: true, share: true, health, law: "POPIA" as const, updatedAt: "2026-10-01T08:00:00Z" });
export const DEMO_LEARNERS: Learner[] = [
  { id: DEMO.kid, orgId: DEMO.org, nickname: "Brave Meerkat", cohort: "child", curriculum: "D-CAPS", level: "Foundation level", guardianIds: [DEMO.parent],
    team: [{ userId: DEMO.specialist, healthAccess: true }, { userId: DEMO.therapist, healthAccess: false }], consent: consent(true) },
  { id: DEMO.teen, orgId: DEMO.org, nickname: "Quiet River", cohort: "teen", curriculum: "CAPS", level: "Grade 9", guardianIds: [DEMO.parent],
    team: [], consent: consent(false) }
];

const msg = (n: number, from: Account, body: string, at: string, readBy: string[], audience: Message["audience"] = "team"): Message =>
  ({ id: id(200 + n), learnerId: DEMO.kid, fromId: from.id, fromName: from.name, fromRole: from.role, audience, body, createdAt: at, readBy });
const [parent, specialist] = DEMO_ACCOUNTS as [Account, Account];
export const DEMO_MESSAGES: Message[] = [
  msg(1, specialist, "Brave Meerkat planned every step in the robot game today before pressing Run. A big step towards the planning goal.", "2026-10-15T15:10:00Z", [specialist.id]),
  msg(2, parent, "Thank you! We tried the 'exact steps' game at home with making toast. Lots of laughing.", "2026-10-15T18:40:00Z", [parent.id, specialist.id]),
  msg(3, specialist, "Well done for fixing Bolt's instructions all by yourself!", "2026-10-20T09:05:00Z", [specialist.id, parent.id], "learner")
];
export const DEMO_MEDICATIONS: Medication[] = [
  { id: id(301), learnerId: DEMO.kid, name: "Example medicine (made up)", dose: "10 mg", schedule: "Mornings, with breakfast", reason: "Attention, prescribed by the paediatrician", startedOn: "2026-10-12", stoppedOn: null, createdBy: DEMO.parent }
];

// The live portal's demo support plan for Brave Meerkat (js/portal/portal.js).
const goal = (n: number, text: string, area: string, status: "todo" | "doing" | "done", target: string) => ({ id: id(500 + n), learnerId: DEMO.kid, text, area, status, target, createdBy: DEMO.specialist, createdAt: "2026-10-06T08:00:00Z" });
const obs = (n: number, g: number, at: string, level: "notyet" | "support" | "alone", note: string) => ({ id: id(600 + n), goalId: id(500 + g), learnerId: DEMO.kid, level, note, by: DEMO.specialist, byName: "Demo Specialist", at: `${at}T09:00:00Z` });
export const DEMO_GOALS = [goal(1, "Follows a 3-step plan without reminders", "Logical and Analytical Thinking", "doing", "2026-12-05"), goal(2, "Asks for help using the talk board", "Communication and Expression", "done", "2026-11-14")];
export const DEMO_OBSERVATIONS = [obs(1, 1, "2026-10-08", "notyet", "Needed reminders after step 1."), obs(2, 1, "2026-10-15", "support", "Followed the plan with one picture prompt."),
  obs(3, 1, "2026-10-22", "alone", "Planned and followed all 3 steps in Literal Robot."), obs(4, 2, "2026-10-13", "support", "Used the talk board when prompted.")];
export const DEMO_NOTES = [
  { id: id(701), learnerId: DEMO.kid, authorId: DEMO.specialist, authorName: "Demo Specialist", body: "Planned all the robot's steps before starting today. A big step.", shareFamily: true, createdAt: "2026-10-15T14:00:00Z" },
  { id: id(702), learnerId: DEMO.kid, authorId: DEMO.specialist, authorName: "Demo Specialist", body: "Try the pattern activity again with building, not picture choice.", shareFamily: false, createdAt: "2026-10-20T14:00:00Z" }];

/** Loads the demo data as if it came from the server, so none of it is queued to be sent anywhere. */
export async function seedDemo(store: LocalStore) {
  await store.receive("accounts", DEMO_ACCOUNTS);
  await store.receive("learners", DEMO_LEARNERS);
  await store.receive("messages", DEMO_MESSAGES);
  await store.receive("medications", DEMO_MEDICATIONS);
  await store.receive("goals", DEMO_GOALS);
  await store.receive("observations", DEMO_OBSERVATIONS);
  await store.receive("notes", DEMO_NOTES);
  await store.receive("health_log", [{ id: id(401), learnerId: DEMO.kid, at: "2026-10-12T07:00:00Z", by: "Demo Parent", text: "Started Example medicine (made up), 10 mg, Mornings, with breakfast" }]);
}
