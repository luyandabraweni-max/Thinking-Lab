import type { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";
import { adult, as, freshDb } from "./db";

// The database itself refuses what a person may not see or change, even if the app has a bug (docs/system-design.md, section 11).
const PARENT = "00000000-0000-4000-8000-000000000001", OTHER_PARENT = "00000000-0000-4000-8000-000000000002";
const SPECIALIST = "00000000-0000-4000-8000-000000000003", STRANGER = "00000000-0000-4000-8000-000000000004";
const uuid = (n: number) => `10000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
let db: PGlite, kid = "";

const push = (who: string, entries: unknown[]) => as(db, who, q => q<{ r: { applied: string[]; rejected: { id: string; reason: string }[] } }>("select public.sync_push($1::jsonb) as r", [JSON.stringify(entries)])).then(r => r[0]!.r);
const pull = (who: string) => as(db, who, q => q<{ r: { changes: Record<string, { id: string }[]> } }>("select public.sync_pull(null) as r")).then(r => r[0]!.r.changes);

beforeAll(async () => {
  db = await freshDb();
  await adult(db, PARENT, "Demo Parent"); await adult(db, OTHER_PARENT, "Other Parent");
  await adult(db, SPECIALIST, "Demo Specialist"); await adult(db, STRANGER, "Stranger");
  kid = await as(db, PARENT, async q => (await q<{ id: string }>("select public.register_learner('Brave Meerkat', 'child', 'D-CAPS', 'Foundation level') as id"))[0]!.id);
  await as(db, OTHER_PARENT, q => q("select public.register_learner('Calm Owl', 'child', 'CAPS', 'Grade 3')"));
  await as(db, PARENT, async q => {
    await q("update public.learner_consent set share = true, updated_by = $2 where learner_id = $1", [kid, PARENT]);
    await q("insert into public.learner_team (learner_id, user_id, granted_by) values ($1, $2, $3)", [kid, SPECIALIST, PARENT]);
  });
});

describe("learners", () => {
  it("are visible to their guardian and the specialist they were shared with, and nobody else", async () => {
    const names = (who: string) => as(db, who, q => q<{ nickname: string }>("select nickname from public.learners order by nickname")).then(r => r.map(x => x.nickname));
    expect(await names(PARENT)).toEqual(["Brave Meerkat"]);
    expect(await names(OTHER_PARENT)).toEqual(["Calm Owl"]);
    expect(await names(SPECIALIST)).toEqual(["Brave Meerkat"]);
    expect(await names(STRANGER)).toEqual([]);
  });
  it("stop being visible to the team when the family withdraws sharing consent", async () => {
    await as(db, PARENT, q => q("update public.learner_consent set share = false, updated_by = $2 where learner_id = $1", [kid, PARENT]));
    expect(await as(db, SPECIALIST, q => q("select id from public.learners"))).toEqual([]);
    await as(db, PARENT, q => q("update public.learner_consent set share = true, updated_by = $2 where learner_id = $1", [kid, PARENT]));
    expect(await as(db, SPECIALIST, q => q("select id from public.learners"))).toHaveLength(1);
  });
  it("can't be shared or have consent changed by anyone but the family", async () => {
    await expect(as(db, SPECIALIST, q => q("insert into public.learner_team (learner_id, user_id, granted_by) values ($1, $2, $2)", [kid, STRANGER]))).rejects.toThrow(/row-level security/);
    await as(db, SPECIALIST, q => q("update public.learner_consent set health = true where learner_id = $1", [kid]));
    expect((await as(db, PARENT, q => q<{ health: boolean }>("select health from public.learner_consent where learner_id = $1", [kid])))[0]!.health).toBe(false);
  });
});

describe("messages", () => {
  it("are stamped with the real sender, whatever the device claims", async () => {
    const res = await push(PARENT, [{ id: uuid(1), table: "messages", row: { id: uuid(2), learnerId: kid, fromName: "Head of Department", fromRole: "org_admin", audience: "team", body: "Slept badly last night.", createdAt: new Date().toISOString(), readBy: [PARENT] } }]);
    expect(res.applied).toEqual([uuid(1)]);
    const [m] = await as(db, SPECIALIST, q => q<{ from_name: string; from_role: string }>("select from_name, from_role from public.messages"));
    expect(m).toEqual({ from_name: "Demo Parent", from_role: "guardian" });
  });
  it("can't be sent about a learner the sender can't see", async () => {
    const res = await push(STRANGER, [{ id: uuid(3), table: "messages", row: { id: uuid(4), learnerId: kid, audience: "team", body: "Hello", createdAt: new Date().toISOString(), readBy: [] } }]);
    expect(res.applied).toEqual([]);
    expect(res.rejected[0]!.reason).toMatch(/row-level security/);
  });
  it("are applied once even when the device sends the same change twice", async () => {
    const entry = { id: uuid(5), table: "messages", row: { id: uuid(6), learnerId: kid, audience: "team", body: "Twice?", createdAt: new Date().toISOString(), readBy: [SPECIALIST] } };
    await push(SPECIALIST, [entry]);
    expect((await push(SPECIALIST, [entry])).applied).toEqual([uuid(5)]);
    expect(await as(db, PARENT, q => q("select id from public.messages where body = 'Twice?'"))).toHaveLength(1);
  });
});

describe("health records", () => {
  const med = () => ({ id: uuid(10), learnerId: kid, name: "Example medicine", dose: "10 mg", schedule: "Mornings", reason: "", startedOn: "2026-11-12", stoppedOn: null }); // built once the learner exists
  it("are entered by the family only", async () => {
    expect((await push(SPECIALIST, [{ id: uuid(11), table: "medications", row: med() }])).rejected).toHaveLength(1);
    expect((await push(PARENT, [{ id: uuid(12), table: "medications", row: med() }])).applied).toEqual([uuid(12)]);
  });
  it("reach the specialist only with health consent and health access granted to them", async () => {
    const meds = () => as(db, SPECIALIST, q => q("select name from health.medications"));
    expect(await meds()).toEqual([]);
    await as(db, PARENT, q => q("update public.learner_consent set health = true, updated_by = $2 where learner_id = $1", [kid, PARENT]));
    expect(await meds()).toEqual([]); // consent alone isn't enough
    await as(db, PARENT, q => q("update public.learner_team set health_access = true where learner_id = $1 and user_id = $2", [kid, SPECIALIST]));
    expect(await meds()).toEqual([{ name: "Example medicine" }]);
    expect(await as(db, STRANGER, q => q("select name from health.medications"))).toEqual([]);
    expect(await as(db, OTHER_PARENT, q => q("select name from health.medications"))).toEqual([]);
  });
  it("leave an audit trail that nobody can read through the API", async () => {
    expect((await db.query("select count(*)::int as n from public.audit_log where table_name = 'health.medications'")).rows).toEqual([{ n: 1 }]);
    await expect(as(db, PARENT, q => q("select * from public.audit_log"))).rejects.toThrow(/permission denied/);
  });
});

describe("attempts", () => {
  it("are recorded once by the learner's team, and seen only by people who can see the learner", async () => {
    const a = { id: uuid(20), learnerId: kid, activityId: "light", status: "alone", mode: "placed mirrors", hints: 0, flags: null, reflection: "I planned", occurredAt: "2026-11-12T08:00:00Z" };
    expect((await push(PARENT, [{ id: uuid(21), table: "attempts", row: a }, { id: uuid(22), table: "attempts", row: a }])).applied).toHaveLength(2);
    expect(await as(db, SPECIALIST, q => q("select activity_id from public.attempts"))).toEqual([{ activity_id: "light" }]);
    expect(await as(db, OTHER_PARENT, q => q("select activity_id from public.attempts"))).toEqual([]);
    expect((await push(STRANGER, [{ id: uuid(23), table: "attempts", row: { ...a, id: uuid(24) } }])).rejected).toHaveLength(1);
  });
});

describe("sync pull", () => {
  it("returns only what the caller may see", async () => {
    const mine = await pull(PARENT), theirs = await pull(OTHER_PARENT), stranger = await pull(STRANGER);
    expect(mine.learners!.map(l => l.id)).toEqual([kid]);
    expect(mine.medications).toHaveLength(1);
    expect(mine.accounts!.map(a => a.id).sort()).toEqual([PARENT, SPECIALIST]);
    expect(theirs.messages).toEqual([]);
    expect(theirs.medications).toEqual([]);
    expect(stranger.learners).toEqual([]);
  });
});

describe("registering", () => {
  it("creates a profile and a family organisation for a new guardian, and refuses self-made admins", async () => {
    const NEW = "00000000-0000-4000-8000-000000000006";
    await db.query("insert into auth.users (id, email) values ($1, 'new@example.org')", [NEW]);
    await as(db, NEW, q => q("select public.register_adult('New Parent', 'guardian')"));
    expect((await db.query("select p.email, m.role from public.profiles p join public.memberships m on m.user_id = p.id where p.id = $1", [NEW])).rows).toEqual([{ email: "new@example.org", role: "guardian" }]);
    await expect(as(db, NEW, q => q("select public.register_adult('New Parent', 'org_admin')"))).rejects.toThrow(/set up when the organisation joins/);
  });
});

describe("school admins", () => {
  it("see no learner records", async () => {
    const ADMIN = "00000000-0000-4000-8000-000000000005";
    await adult(db, ADMIN, "School Admin");
    const org = (await db.query<{ org_id: string }>("select org_id from public.learners where id = $1", [kid])).rows[0]!.org_id;
    await db.query("insert into public.memberships (user_id, org_id, role) values ($1, $2, 'org_admin')", [ADMIN, org]);
    expect(await as(db, ADMIN, q => q("select id from public.learners"))).toEqual([]);
    expect(await as(db, ADMIN, q => q("select id from health.medications"))).toEqual([]);
  });
});
