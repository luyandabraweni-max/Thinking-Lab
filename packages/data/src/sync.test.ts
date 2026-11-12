import { describe, expect, it } from "vitest";
import { DEMO, seedDemo } from "./demo";
import { MemoryKv } from "./kv";
import { LocalStore } from "./store";
import { sync, type Changes, type Transport } from "./sync";

const transport = (changes: Changes): Transport => ({ push: async b => ({ applied: b.map(e => e.id), rejected: [] }), pull: async () => ({ changes, cursor: "2026-11-12T00:00:00Z" }) });
const mine = async (store: LocalStore, t: "learners" | "messages" | "medications" | "health_log" | "goals" | "learner_settings") =>
  ((await store.kv.all(t)) as { id: string; learnerId?: string }[]).map(r => r.learnerId ?? r.id);

describe("when access ends", () => {
  it("removes a learner's records from the device once the family stops sharing them", async () => {
    const store = new LocalStore(new MemoryKv());
    await seedDemo(store);
    expect(await mine(store, "messages")).toContain(DEMO.kid);
    await sync(store, transport({ visible: { learners: [DEMO.teen], health: [DEMO.teen] } }));
    for (const t of ["learners", "messages", "medications", "health_log", "goals"] as const) expect(await mine(store, t)).not.toContain(DEMO.kid);
    expect(await mine(store, "learners")).toEqual([DEMO.teen]);
  });
  it("removes only health records when health sharing is turned off", async () => {
    const store = new LocalStore(new MemoryKv());
    await seedDemo(store);
    await sync(store, transport({ visible: { learners: [DEMO.kid, DEMO.teen], health: [] } }));
    expect(await mine(store, "messages")).toContain(DEMO.kid);
    expect(await mine(store, "medications")).toEqual([]);
    expect(await mine(store, "health_log")).toEqual([]);
  });
  it("keeps everything when the server doesn't say (an older server)", async () => {
    const store = new LocalStore(new MemoryKv());
    await seedDemo(store);
    const before = (await mine(store, "messages")).length;
    await sync(store, transport({}));
    expect((await mine(store, "messages")).length).toBe(before);
  });
});
