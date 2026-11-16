import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Exercise } from "./Exercise";
import type { GameId } from "./catalogue";
import type { Band, LabRun } from "./kit";
import { LITERAL_TASKS } from "./games/literal/logic";
import { IW_LEVELS } from "./games/invent/logic";

// Every game played from Begin to the finish screen, as younger and older learners, with movement off so nothing waits.
const runOf = (id: GameId, band: Band): LabRun => ({ id, band, learnerName: "Brave Meerkat", W: (k, g) => (band === "older" ? g : k), reduceMotion: true, say: () => {} });
async function play(id: GameId, band: Band, steps: (u: ReturnType<typeof userEvent.setup>) => Promise<void>) {
  const user = userEvent.setup(), onSave = vi.fn(async () => {});
  render(<Exercise run={runOf(id, band)} onSave={onSave} onBack={() => {}} />);
  await user.click(screen.getByRole("button", { name: "Begin" }));
  await steps(user);
  // Reflection: always the first choice, then the finish screen
  const reflect = await screen.findByRole("heading", { level: 2 });
  expect(reflect).toBeInTheDocument();
  await user.click(screen.getAllByRole("button").find(b => b.classList.contains("choice"))!);
  expect(await screen.findByText(/Thank you for (playing|taking part)/)).toBeInTheDocument();
  expect(onSave).toHaveBeenCalledOnce();
  return (onSave.mock.calls[0] as unknown as [{ activityId: string; status: string }[]])[0];
}
const btn = (name: string | RegExp) => screen.getByRole("button", { name });
const moveOnUntil = async (u: ReturnType<typeof userEvent.setup>, done: () => boolean) => { while (!done()) await u.click(btn(/Move on without/)); };

describe("every Thinking Lab game", () => {
  it("The Literal Robot: a correct program runs first time", async () => {
    const saved = await play("literal", "younger", async u => {
      for (const task of LITERAL_TASKS.younger) {
        for (const id of task.order) await u.click(within(document.querySelector(".lr-tray") as HTMLElement).getByRole("button", { name: task.cards.find(c => c.id === id)!.t }));
        await u.click(btn(/Run the instructions/));
        expect(await screen.findByText(/Bolt did it! Your instructions were exact./)).toBeInTheDocument();
        await u.click(btn(/Next job|Finish/));
      }
    });
    expect(saved.map(a => a.status)).toEqual(["alone", "alone"]);
  });
  it("How Sure Am I?: every answer is rated, then the Sure-o-meter", async () => {
    const saved = await play("sure", "older", async u => {
      while (!screen.queryByRole("button", { name: "Carry on" })) {
        if (screen.queryByRole("button", { name: /Next puzzle|See my Sure-o-meter/ })) { await u.click(btn(/Next puzzle|See my Sure-o-meter/)); continue; }
        await u.click(screen.getAllByRole("button").find(b => b.classList.contains("choice"))!);
        await u.click(btn("Very sure"));
      }
      expect(screen.getByRole("heading", { name: "My Sure-o-meter" })).toBeInTheDocument();
      await u.click(btn("Carry on"));
    });
    expect(saved).toHaveLength(7);
  });
  it("Veld Balance: predictions, then an open experiment", async () => {
    const saved = await play("veld", "younger", async u => {
      await u.click(btn("Let's see"));
      for (let q = 0; q < 2; q++) { await u.click(btn(/More/)); await u.click(btn(/Next question|Make your own veld/)); }
      await u.click(btn("Lots of rain")); await u.click(btn(/Watch 8 seasons/));
      await u.click(btn("None")); await u.click(btn(/Watch 8 seasons/));
      await u.click(btn("I've finished exploring"));
    });
    expect(saved.map(a => a.status)).toEqual(["notyet", "alone", "open"]); // rain stopping means fewer; no cheetahs means more
  });
  it("Invention Workshop: the design carries over, and the learner names it", async () => {
    const saved = await play("invent", "younger", async u => {
      for (let i = 0; i < IW_LEVELS.younger.segs.length; i++) { await u.click(btn(new RegExp(`^Part ${i + 1}, over`))); await u.click(btn(/^Pipe/)); }
      await u.click(btn(/Test it/));
      expect(await screen.findByText(/Water reached the garden!/)).toBeInTheDocument();
      await u.click(btn("Next challenge"));
      await u.click(btn(/Test it/)); // the pipes still work with no buckets allowed
      await u.click(await screen.findByRole("button", { name: "Name my invention" }));
      await u.click(btn("The River Runner")); await u.click(btn("It's easy to fix"));
      await u.click(btn("That's my invention"));
    });
    expect(saved.map(a => a.status)).toEqual(["alone", "alone", "open"]);
  });
  it("Story Weaver: a whole storybook, with another point of view for older learners", async () => {
    await play("story", "older", async u => {
      await u.click(btn(/Gogo/)); await u.click(btn(/By the river/)); await u.click(btn(/Something is lost/));
      for (let p = 0; p < 3; p++) { await u.click(screen.getAllByRole("button").find(b => b.classList.contains("choice"))!); await u.click(btn("brave")); await u.click(btn(/Next page|Finish my story/)); }
      await u.click(btn(/Tumi the tortoise/)); await u.click(btn("worried")); await u.click(btn("Next"));
      await u.click(btn(/Gogo Saves the Day/));
      expect(screen.getByText("Once upon a time, Gogo was by the river.")).toBeInTheDocument();
      await u.click(btn("Next page")); await u.click(btn("Next page"));
      expect(screen.getByText("Tumi the tortoise felt worried too.")).toBeInTheDocument();
      await u.click(btn("I love my story"));
    });
  });
  it.each([["rule", "younger"], ["rule", "older"], ["describe", "younger"], ["describe", "older"], ["light", "older"]] as [GameId, Band][])("%s (%s): moving on without an answer is always possible", async (id, band) => {
    const saved = await play(id, band, u => moveOnUntil(u, () => !!document.querySelector(".choices .choice") && !screen.queryByRole("button", { name: /Move on without/ })));
    expect(saved.every(a => a.status === "notyet")).toBe(true);
  });
});
