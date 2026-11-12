import type { PlanStep } from "@tl/data";

// "My plan today" (ported from js/support/my-way.js): the learner, or an adult before the session, picks up to 5 steps.
// A step is a kind of activity, or a particular game ("x:<id>") or lesson ("u:<unit id>") an adult chose.
export const PLAN_KINDS: PlanStep[] = [
  { key: "lesson", pic: "📚", label: "A lesson" },
  { key: "lab", pic: "🧪", label: "Thinking Lab" },
  { key: "finish", pic: "🏁", label: "Finish" }
];
export const PLAN_MAX = 5;
