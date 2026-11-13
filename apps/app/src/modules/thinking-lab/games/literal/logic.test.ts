import { describe, expect, it } from "vitest";
import { LITERAL_TASKS, literalRun } from "./logic";

describe("The Literal Robot", () => {
  const all = [...LITERAL_TASKS.younger, ...LITERAL_TASKS.older];
  it("finishes every job with its listed order, and with a harmless extra step added", () => {
    for (const t of all) {
      expect(literalRun(t, t.order).ok).toBe(true);
      const extra = t.cards.find(c => c.extra);
      if (extra) expect(literalRun(t, [...t.order, extra.id]).ok).toBe(true);
    }
  });
  it("does exactly what a wrong order says, and says what went wrong", () => {
    const sandwich = LITERAL_TASKS.younger[0]!;
    const r = literalRun(sandwich, ["spread", "bread", "open", "close"]);
    expect(r.ok).toBe(false);
    expect(r.events[0]).toEqual({ id: "spread", ok: false, text: "Bolt spreads peanut butter on the table. There is no bread yet!" });
  });
  it("never finishes with a silly step, or with a step missing", () => {
    const bean = LITERAL_TASKS.older[0]!;
    expect(literalRun(bean, [...bean.order, "dark"]).ok).toBe(false);
    const tea = LITERAL_TASKS.older[1]!;
    expect(literalRun(tea, tea.order.slice(0, -1))).toMatchObject({ ok: false, reached: false });
  });
});
