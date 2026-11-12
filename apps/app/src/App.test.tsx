import { DEMO, LocalStore, MemoryKv } from "@tl/data";
import type { SpeechEngine } from "@tl/voice";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { createServices, DEMO_CODE, type Services } from "./platform";

// The app as people use it, in demo mode: each role, messages, health, consent, learners and voice.
let services: Services, store: LocalStore;
beforeEach(async () => { localStorage.clear(); store = new LocalStore(new MemoryKv()); services = await createServices({} as ImportMetaEnv, store); });

/** A pretend microphone that "hears" each line in turn, and a record of everything read aloud. */
function scriptedVoice(lines: string[]) {
  const spoken: string[] = [];
  const engine: SpeechEngine = { kind: "web", sendsAudioAway: true, available: async () => true, permit: async () => true,
    listen: async () => ({ text: lines.shift() ?? "stop", alternatives: [] }) };
  return { engine, spoken, say: async (t: string) => { spoken.push(t); } };
}
const start = (voice?: ReturnType<typeof scriptedVoice>) => { const user = userEvent.setup(); render(<App services={services} voice={voice} />); return user; };
const signInDemo = async (user: ReturnType<typeof userEvent.setup>, who: string) => user.click(await screen.findByRole("button", { name: who }));

describe("signing in", () => {
  it("lets an adult sign in with an email code, and asks a new adult who they are", async () => {
    const user = start();
    await user.click(screen.getAllByRole("button", { name: "Sign in or register" })[0]!);
    await user.type(screen.getByLabelText(/Email address/), "someone.new@example.org");
    await user.click(screen.getByRole("button", { name: "Send me a code" }));
    await user.type(screen.getByLabelText(/Code from the email/), "000000");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("That code isn't right");
    await user.clear(screen.getByLabelText(/Code from the email/));
    await user.type(screen.getByLabelText(/Code from the email/), DEMO_CODE);
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    await user.type(await screen.findByLabelText(/Your name/), "Thandi");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(await screen.findByRole("heading", { name: "Your children" })).toBeInTheDocument();
    expect(screen.getByText("No children registered yet.")).toBeInTheDocument();
  });
  it("shows a school admin no learner records", async () => {
    const user = start();
    await signInDemo(user, "Demo school admin");
    expect(await screen.findByText(/don't see individual learners' records/)).toBeInTheDocument();
  });
});

describe("the team around a learner", () => {
  it("passes a parent's message to the specialist, marked new until read", async () => {
    const user = start();
    await signInDemo(user, "Demo parent");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.type(await screen.findByLabelText("Your message"), "Slept badly last night.");
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByText("Slept badly last night.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await signInDemo(user, "Demo specialist");
    expect(await screen.findByRole("button", { name: "Open Brave Meerkat (1 new message)" })).toBeInTheDocument();
  });
  it("shows health records only to the family and the team members they chose", async () => {
    const user = start();
    await signInDemo(user, "Demo therapist");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Health" }));
    expect(await screen.findByText(/hasn't shared health records with you/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await signInDemo(user, "Demo specialist");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Health" }));
    expect(await screen.findByText("Example medicine (made up)")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Given now" })).toBeNull(); // read only
  });
  it("lets the family switch health access off for a specialist", async () => {
    const user = start();
    await signInDemo(user, "Demo parent");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Sharing" }));
    const specialist = (await screen.findByText("Demo Specialist")).closest("article")!;
    await user.click(within(specialist as HTMLElement).getByRole("checkbox", { name: /Can see medicines/ }));
    const L = await store.as((await store.account(DEMO.specialist))!).learner(DEMO.kid);
    expect(L.team.find(t => t.userId === DEMO.specialist)!.healthAccess).toBe(false);
  });
});

describe("filling a form by voice", () => {
  it("asks each question, reads the answer back, checks sound-alike numbers, and saves only when told", async () => {
    const voice = scriptedVoice(["sleep drops", "yes", "fifteen milligrams", "yes", "at bedtime", "yes", "next", "save"]);
    const user = start(voice);
    await signInDemo(user, "Demo parent");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Health" }));
    await user.click(await screen.findByRole("button", { name: "Fill this form by speaking" }));
    await user.click(screen.getByRole("button", { name: "Agree and speak" }));
    expect(await screen.findByRole("heading", { name: "Sleep Drops" })).toBeInTheDocument();
    expect(screen.getByText("15 mg, At bedtime")).toBeInTheDocument();
    expect(voice.spoken).toContain("I heard: 15 mg. That's one five, not five zero. Is that right?");
    expect(voice.spoken.at(-1)).toBe("Saved.");
  });
  it("puts a spoken dose in a single field, and asks which number was meant when it could be misheard", async () => {
    const voice = scriptedVoice(["fifty milligrams"]);
    const user = start(voice);
    await signInDemo(user, "Demo parent");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Health" }));
    await user.click(await screen.findByRole("button", { name: "Speak instead of typing: Dose" }));
    await user.click(screen.getByRole("button", { name: "Agree and speak" }));
    expect(await screen.findByDisplayValue("50 mg")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "15 (one five)" }));
    expect(screen.getByDisplayValue("15 mg")).toBeInTheDocument();
  });
});

describe("learners on a shared device", () => {
  it("lets an adult set a picture password, and the learner read and answer their messages", async () => {
    const user = start();
    await signInDemo(user, "Demo parent");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Sharing" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    expect(await screen.findByText(/pictures are lion, then star, then moon/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await user.click(screen.getByRole("button", { name: "I'm a learner" }));
    await user.click(await screen.findByRole("button", { name: "Brave Meerkat" }));
    for (const p of ["lion", "moon", "star"]) await user.click(screen.getByRole("button", { name: p }));
    expect(await screen.findByText(/Not quite/)).toBeInTheDocument();
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    expect(await screen.findByText("Well done for fixing Bolt's instructions all by yourself!")).toBeInTheDocument();
    expect(screen.queryByText(/Lots of laughing/)).toBeNull(); // team-only messages stay with the team
    await user.click(screen.getByRole("button", { name: "Thank you!" }));
    expect(await screen.findByText("Sent!")).toBeInTheDocument();
  });
});
