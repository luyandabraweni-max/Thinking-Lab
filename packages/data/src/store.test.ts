import { beforeEach, describe, expect, it } from "vitest";
import { AccessDenied, DEMO, LocalStore, MemoryKv, seedDemo, sync, type OutboxEntry, type Transport } from "./index";

let store: LocalStore;
const who = async (id: string) => store.as((await store.account(id))!);
beforeEach(async () => { store = new LocalStore(new MemoryKv()); await seedDemo(store); });

describe("access", () => {
  it("shows each adult only the learners they may see", async () => {
    expect((await (await who(DEMO.parent)).learners()).map(l => l.nickname)).toEqual(["Brave Meerkat", "Quiet River"]);
    expect((await (await who(DEMO.specialist)).learners()).map(l => l.nickname)).toEqual(["Brave Meerkat"]);
    expect(await (await who(DEMO.admin)).learners()).toEqual([]);
  });
  it("keeps health records to the family and team members granted health access", async () => {
    expect(await (await who(DEMO.specialist)).medications(DEMO.kid)).toHaveLength(1);
    await expect((await who(DEMO.therapist)).medications(DEMO.kid)).rejects.toBeInstanceOf(AccessDenied);
    await expect((await who(DEMO.specialist)).addMedication(DEMO.kid, { name: "X", dose: "1 mg", schedule: "", reason: "" })).rejects.toBeInstanceOf(AccessDenied);
  });
  it("hides health records from the whole team when the family withdraws health consent", async () => {
    await (await who(DEMO.parent)).setConsent(DEMO.kid, { health: false });
    await expect((await who(DEMO.specialist)).medications(DEMO.kid)).rejects.toBeInstanceOf(AccessDenied);
  });
});

describe("support plan", () => {
  it("is written by the team, and the family sees goals and shared notes only", async () => {
    const parent = await who(DEMO.parent), specialist = await who(DEMO.specialist);
    await expect(parent.addGoal(DEMO.kid, { text: "Anything", area: "Communication" })).rejects.toBeInstanceOf(AccessDenied);
    const g = await specialist.addGoal(DEMO.kid, { text: "Waits for a turn in a game", area: "Social and emotional" });
    await specialist.observe(DEMO.kid, g.id, "alone", "Waited twice without a prompt.");
    expect((await parent.goals(DEMO.kid)).find(x => x.id === g.id)!.status).toBe("doing"); // seen done alone: now being worked on
    expect((await parent.notes(DEMO.kid)).map(n => n.shareFamily)).toEqual([true]);
    expect(await specialist.notes(DEMO.kid)).toHaveLength(2);
  });
});

describe("offline first", () => {
  it("saves every change on the device and queues it for the server", async () => {
    const parent = await who(DEMO.parent);
    await parent.addMedication(DEMO.kid, { name: "Sleep drops (made up)", dose: "2 drops", schedule: "Bedtime", reason: "" });
    expect((await parent.medications(DEMO.kid)).map(m => m.name)).toContain("Sleep drops (made up)");
    expect((await parent.healthLog(DEMO.kid))[0]!.text).toBe("Started Sleep drops (made up), 2 drops, Bedtime");
    expect((await store.kv.outbox()).map(e => e.table)).toEqual(["medications", "health_log"]);
  });
  it("counts unread messages until they are read", async () => {
    const parent = await who(DEMO.parent), specialist = await who(DEMO.specialist);
    await parent.send(DEMO.kid, "Slept badly last night.");
    expect(await specialist.unread(DEMO.kid)).toBe(1); // the demo specialist has read the earlier messages
    await specialist.markRead(DEMO.kid);
    expect(await specialist.unread(DEMO.kid)).toBe(0);
  });
});

describe("sync", () => {
  const fakeServer = (refuse: string[] = []): Transport & { got: OutboxEntry[] } => {
    const got: OutboxEntry[] = [];
    return { got,
      async push(batch) { got.push(...batch); return { applied: batch.filter(e => !refuse.includes(e.table)).map(e => e.id), rejected: batch.filter(e => refuse.includes(e.table)).map(e => ({ id: e.id, reason: "not allowed" })) }; },
      async pull() { return { changes: { messages: [{ id: "srv-1", learnerId: DEMO.kid, fromId: DEMO.specialist, fromName: "Demo Specialist", fromRole: "specialist", audience: "team", body: "From the server", createdAt: "2026-11-12T08:00:00Z", readBy: [] }] }, cursor: "2026-11-12T08:00:00Z" }; } };
  };
  it("sends the outbox, empties it, and stores what the server sends back", async () => {
    await (await who(DEMO.parent)).send(DEMO.kid, "Hello team");
    const server = fakeServer(), res = await sync(store, server);
    expect(res).toMatchObject({ sent: 1, received: 1, pending: 0 });
    expect((await (await who(DEMO.parent)).messages(DEMO.kid)).map(m => m.body)).toContain("From the server");
    expect(await store.kv.getMeta("cursor")).toBe("2026-11-12T08:00:00Z");
  });
  it("keeps everything queued when the network fails", async () => {
    await (await who(DEMO.parent)).send(DEMO.kid, "Hello team");
    await expect(sync(store, { push: async () => { throw new Error("offline"); }, pull: async () => ({ changes: {}, cursor: "x" }) })).rejects.toThrow("offline");
    expect(await store.kv.outbox()).toHaveLength(1);
  });
  it("reports changes the server refused instead of retrying them forever", async () => {
    await (await who(DEMO.parent)).send(DEMO.kid, "Hello team");
    const res = await sync(store, fakeServer(["messages"]));
    expect(res.rejected).toHaveLength(1);
    expect(res.pending).toBe(0);
  });
});
