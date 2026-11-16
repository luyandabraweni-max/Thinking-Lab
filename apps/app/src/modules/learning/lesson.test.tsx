import type { Row } from "@tl/adaptation";
import { areaOf, CATALOGUE, loadUnit, type Question, type Unit } from "@tl/content";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { SpeechEngine } from "@tl/voice";
import { VoiceProvider } from "@tl/voice/react";
import { Lesson } from "./Lesson";
import { norm } from "./logic";

// Real lessons from the content packs, answered as a learner would.
type User = ReturnType<typeof userEvent.setup>;
const start = async (unit: Unit, history: Row[] = []) => {
  const user = userEvent.setup(), onSave = vi.fn(async () => {}), onUnsafe = vi.fn();
  render(<Lesson unit={unit} older={false} history={history} country={null} onSave={onSave} onUnsafe={onUnsafe} onBack={() => {}} />);
  return { user, onSave, onUnsafe };
};
const click = (u: User, name: string | RegExp) => u.click(screen.getAllByRole("button", { name }).find(b => !(b as HTMLButtonElement).disabled)!);
const exact = (t: string) => new RegExp(`^${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
async function toQuestions(u: User, unit: Unit) {
  await click(u, "Begin");
  for (let i = 0; i < unit.lesson.length; i++) await click(u, i + 1 < unit.lesson.length ? "Next" : "See a worked example");
  await click(u, "Skip to the questions").catch(() => click(u, "Now I'll try"));
}
async function answer(u: User, q: Question) {
  if (q.type === "mcq") await click(u, exact(q.options[q.answer]!));
  else if (q.type === "num") await click(u, exact(q.options!.find(o => norm(o) === norm(q.answer))!));
  else if (q.type === "order") for (const t of q.items) await click(u, exact(t));
  else for (let i = 0; i < q.items.length; i++) { await click(u, exact(q.items[i]!)); await click(u, exact(q.bins[q.answer[i]!]!)); }
  await click(u, "Check my answer");
}
const unitWhere = async (f: (u: Unit) => boolean) => { for (const e of CATALOGUE) { const { unit } = await loadUnit(e.id); if (f(unit)) return unit; } throw new Error("no such unit"); };
const MATHS5 = () => unitWhere(u => areaOf(u.subject) === "maths" && u.grade === 5 && u.questions[0]!.type === "mcq" && (u.questions[0] as { options: string[] }).options.length > 2);
const row = (id: string, d: string, st: Row[2], h = 0, f?: Row[6]): Row => (f ? [d, id, st, "chose", h, "", f] : [d, id, st, "chose", h, ""]);

describe("a lesson", () => {
  it("goes from Begin to done, and saves each answer as shown without support", async () => {
    const unit = await unitWhere(u => u.grade === 3 && !u.passage && u.questions.every(q => q.type !== "num" || !!q.options) && u.questions.every(q => !(q.type === "mcq" && q.open)));
    const { user, onSave } = await start(unit);
    await toQuestions(user, unit);
    for (let i = 0; i < unit.questions.length; i++) {
      await answer(user, unit.questions[i]!);
      expect(await screen.findByText(/^Yes\./)).toBeInTheDocument();
      await click(user, i + 1 < unit.questions.length ? "Next question" : "Finish");
    }
    await click(user, exact(unit.reflect.options[0]!));
    expect(await screen.findByRole("heading", { name: `${unit.title}: done` })).toBeInTheDocument();
    const saved = (onSave.mock.calls[0] as unknown as [{ status: string }[]])[0];
    expect(saved.map(a => a.status)).toEqual(unit.questions.map(() => "alone"));
  });
  it("starts with two choices when the learner often asked for easier, and they can show them all", async () => {
    const unit = await MATHS5();
    const { user } = await start(unit, [row(unit.id, "d1", "support", 0, { e: 1 }), row(unit.id, "d1", "support", 0, { e: 1 }), row(unit.id, "d2", "support", 0, { e: 1 })]);
    await toQuestions(user, unit);
    expect(screen.getByText(/Two choices to start/)).toBeInTheDocument();
    expect(document.querySelectorAll(".choices .choice")).toHaveLength(2);
    await click(user, "Show all the choices");
    expect(document.querySelectorAll(".choices .choice")).toHaveLength((unit.questions[0] as { options: string[] }).options.length);
  });
  it("is shorter after repeated moving on, and the learner can ask for the full lesson", async () => {
    const unit = await unitWhere(u => u.questions.length > 3);
    const { user } = await start(unit, [1, 2, 3].map(i => row(unit.id, `2026-11-0${i}`, "notyet", 0, { s: 1 })));
    expect(screen.getByText(/This lesson is shorter today: 3 questions/)).toBeInTheDocument();
    await click(user, `Do all ${unit.questions.length} questions`);
    expect(screen.queryByText(/This lesson is shorter today/)).toBeNull();
  });
  it("offers help after one wrong answer when help is often used", async () => {
    const unit = await MATHS5(), q = unit.questions[0] as { options: string[]; answer: number };
    const { user } = await start(unit, ["2026-11-01", "2026-11-02"].flatMap(d => [row(unit.id, d, "support", 1), row(unit.id, d, "support", 2), row(unit.id, d, "alone"), row(unit.id, d, "support", 1)]));
    await toQuestions(user, unit);
    await click(user, exact(q.options.find((_, i) => i !== q.answer)!));
    await click(user, "Check my answer");
    expect(screen.getByText("This one is tricky. What would help?")).toBeInTheDocument();
    await click(user, /Take a break/);
    expect(screen.getByRole("heading", { name: "Take a break" })).toBeInTheDocument();
  });
  it("ends sensitive lessons with who can help, and the learner can say they feel unsafe", async () => {
    const { unit } = await loadUnit("g3-safety");
    const { user, onUnsafe } = await start(unit);
    await toQuestions(user, unit);
    for (let i = 0; i < unit.questions.length; i++) await click(user, "Move on without an answer");
    await click(user, exact(unit.reflect.options[0]!));
    expect(await screen.findByRole("heading", { name: "Who can help me?" })).toBeInTheDocument();
    expect(screen.getByText("Childline South Africa")).toBeInTheDocument();
    await click(user, /I feel unsafe/);
    expect(onUnsafe).toHaveBeenCalledWith("lesson");
  });
});

describe("answering by speaking", () => {
  const engine = (said: string): SpeechEngine => ({ kind: "web", sendsAudioAway: true, available: async () => true, permit: async () => true, listen: async () => ({ text: said, alternatives: [] }) });
  it("fills in the choice the learner said; they still press Check", async () => {
    const unit = await unitWhere(u => u.questions[0]?.type === "mcq" && !u.questions[0].open && !u.questions[0].fixed);
    const q = unit.questions[0] as Extract<Question, { type: "mcq" }>, right = q.options[q.answer]!;
    localStorage.setItem("tl-voice-consent", "yes");
    const user = userEvent.setup(), onSave = vi.fn(async () => {});
    render(<VoiceProvider engine={engine(`I think ${right}`)} say={async () => {}}><Lesson unit={unit} older={false} history={[]} country={null} onSave={onSave} onUnsafe={() => {}} onBack={() => {}} voiceAnswers /></VoiceProvider>);
    await toQuestions(user, unit);
    await click(user, "Say my answer");
    expect(await screen.findByText(`I heard "${right}". Press Check my answer, or choose another.`)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: exact(right), pressed: true })).toBeInTheDocument();
    await click(user, "Check my answer");
    expect(screen.getByRole("button", { name: /Next question|Finish/ })).toBeInTheDocument();
    localStorage.clear();
  });
  it("isn't offered unless it was turned on", async () => {
    const unit = await unitWhere(u => u.questions[0]?.type === "mcq");
    const user = userEvent.setup();
    render(<VoiceProvider engine={engine("anything")} say={async () => {}}><Lesson unit={unit} older={false} history={[]} country={null} onSave={async () => {}} onUnsafe={() => {}} onBack={() => {}} /></VoiceProvider>);
    await toQuestions(user, unit);
    expect(screen.queryByRole("button", { name: "Say my answer" })).toBeNull();
  });
});
