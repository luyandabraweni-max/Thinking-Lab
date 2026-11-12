import { DEMO, LocalStore, MemoryKv } from "@tl/data";
import type { SpeechEngine } from "@tl/voice";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
    await user.click(screen.getByRole("button", { name: "Email me a sign-in link" }));
    await user.type(screen.getByLabelText(/Code from the email/), "000000");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("That code isn't right");
    await user.clear(screen.getByLabelText(/Code from the email/));
    await user.type(screen.getByLabelText(/Code from the email/), DEMO_CODE);
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    await user.type(await screen.findByLabelText(/Your name/), "Thandi");
    await user.type(screen.getByLabelText(/Create a password/), "short");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("at least 8 characters");
    await user.type(screen.getByLabelText(/Create a password/), " but now long enough");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(await screen.findByRole("heading", { name: "Your children" })).toBeInTheDocument();
    expect(screen.getByText("No children yet. Add your child below to get started.")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Set a password" })).toBeNull(); // made one already
    // Next time: email and password, no email needed
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await user.click(screen.getAllByRole("button", { name: "Sign in or register" })[0]!);
    await user.type(screen.getByLabelText(/Email address/), "someone.new@example.org");
    await user.type(screen.getByLabelText(/^Password/), "wrong password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("That email and password don't match");
    await user.clear(screen.getByLabelText(/^Password/));
    await user.type(screen.getByLabelText(/^Password/), "short but now long enough");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByRole("heading", { name: "Your children" })).toBeInTheDocument();
  });
  it("shows a school admin totals and staff, never learner records, and lets them choose the safeguarding lead", async () => {
    const user = start();
    await signInDemo(user, "Demo school admin");
    expect(await screen.findByText(/you don't see learners' names, progress or notes/)).toBeInTheDocument();
    expect(screen.queryByText(/Brave Meerkat/)).toBeNull();
    const lead = screen.getByRole("checkbox", { name: "Demo Specialist is a safeguarding lead" });
    expect(lead).toBeChecked();
    await user.click(lead);
    expect(await screen.findByRole("heading", { name: /No safeguarding lead/ })).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: "Demo Therapist is a safeguarding lead" }));
    expect(await screen.findByText("Demo Therapist is now a safeguarding lead and receives concerns.")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /No safeguarding lead/ })).toBeNull();
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
    await user.click(await screen.findByRole("button", { name: "Skip" })); // "How are you feeling?"
    expect(await screen.findByText("Well done for fixing Bolt's instructions all by yourself!")).toBeInTheDocument();
    expect(screen.queryByText(/Lots of laughing/)).toBeNull(); // team-only messages stay with the team
    await user.click(screen.getByRole("button", { name: "Thank you!" }));
    expect(await screen.findByText("Sent!")).toBeInTheDocument();
  });
});

describe("the Thinking Lab", () => {
  it("lets a learner solve Light the Village, reflect, and saves how they worked", async () => {
    const user = start();
    await signInDemo(user, "Demo parent");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Sharing" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await user.click(screen.getByRole("button", { name: "I'm a learner" }));
    await user.click(await screen.findByRole("button", { name: "Brave Meerkat" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await user.click(await screen.findByRole("button", { name: "Skip" })); // "How are you feeling?"
    await user.click(await screen.findByRole("button", { name: /My way/ })); // no waiting for the beam animation
    await user.click(screen.getByRole("checkbox", { name: "No movement" }));
    await user.click(screen.getByRole("button", { name: "Done" }));
    await user.click(await screen.findByRole("button", { name: "Thinking Lab" }));
    await user.click(await screen.findByRole("button", { name: /^Light the Village/ })); // the Thinking Lab loads when opened
    await user.click(await screen.findByRole("button", { name: "Begin" }));
    // Village 1: one mirror, tilted down to the right
    await user.click(screen.getByRole("button", { name: "row 1, column 3: empty" }));
    await user.click(screen.getByRole("button", { name: /row 1, column 3: mirror/ }));
    await user.click(screen.getByRole("button", { name: /Shine the light/ }));
    expect(await screen.findByText(/The hut has light! You got it on your first try./)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next village" }));
    // Village 2: a miss first, then the plan
    await user.click(screen.getByRole("button", { name: /Shine the light/ }));
    expect(await screen.findByText(/The light reached 0 of 2 huts/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "row 3, column 1: empty" }));
    await user.click(screen.getByRole("button", { name: "row 3, column 4: empty" }));
    await user.click(screen.getByRole("button", { name: /Shine the light/ }));
    expect(await screen.findByText(/Every hut has light! You kept going until it worked./)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Finish" }));
    await user.click(screen.getByRole("button", { name: "I tried, then fixed it" }));
    expect(await screen.findByText("You tried a different approach when your first idea did not work.")).toBeInTheDocument();
    const saved = (await store.kv.all("attempts")).filter(a => a.activityId === "light").map(a => [a.activityId, a.status, a.mode, a.reflection]);
    expect(saved).toEqual([["light", "alone", "placed mirrors", "I tried, then fixed it"], ["light", "support", "placed mirrors", "I tried, then fixed it"]]);
  });
});

describe("safeguarding", () => {
  it("answers a learner who feels unsafe kindly, and alerts the adult on that device", async () => {
    const user = start();
    await signInDemo(user, "Demo parent");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Sharing" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await user.click(screen.getByRole("button", { name: "I'm a learner" }));
    await user.click(await screen.findByRole("button", { name: "Brave Meerkat" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await user.click(await screen.findByRole("button", { name: "Skip" })); // "How are you feeling?"
    await user.click(await screen.findByRole("button", { name: /I feel unsafe/ }));
    expect(await screen.findByRole("alertdialog", { name: "Thank you for telling us" })).toHaveTextContent("you are not in trouble");
    expect(screen.getByText("116")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Show a grown-up/ }));
    expect(screen.getByRole("heading", { name: "I feel unsafe. I need to talk to someone." })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    await user.click(await screen.findByRole("button", { name: "I'm done" }));
    await signInDemo(user, "Demo parent");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Safeguarding: Brave Meerkat said they feel unsafe");
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    // A team member who isn't the safeguarding lead sees nothing; the lead sees it first and records what they did.
    await signInDemo(user, "Demo therapist");
    await screen.findByRole("heading", { name: "Your learners" });
    expect(screen.queryByText(/concern/)).toBeNull();
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await signInDemo(user, "Demo specialist");
    expect(await screen.findByRole("heading", { name: /Safeguarding: 1 concern to follow up/ })).toBeInTheDocument();
    await user.type(screen.getByLabelText("What you did"), "Spoke with the learner and the class teacher.");
    await user.click(screen.getByRole("button", { name: "Mark as followed up" }));
    expect(await screen.findByRole("heading", { name: /Safeguarding: nothing open/ })).toBeInTheDocument();
    expect((await store.kv.outbox()).filter(e => e.table === "concerns")).toHaveLength(1); // queued for the server
  });
});

describe("My way", () => {
  it("changes how things look and sound for the learner, remembers it, and resets for the next person", async () => {
    const user = start();
    await signInDemo(user, "Demo parent");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Sharing" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    const enter = async () => {
      await user.click(screen.getByRole("button", { name: "I'm a learner" }));
      await user.click(await screen.findByRole("button", { name: "Brave Meerkat" }));
      for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
      await user.click(await screen.findByRole("button", { name: "Skip" })); // "How are you feeling?"
    };
    await enter();
    await user.click(await screen.findByRole("button", { name: /My way/ }));
    await user.click(screen.getByRole("button", { name: "Dark" }));
    await user.click(screen.getByRole("checkbox", { name: "Grey only (no colours)" }));
    await user.click(screen.getByRole("checkbox", { name: "Show the words when it talks" }));
    const root = document.documentElement;
    expect([root.dataset.theme, root.hasAttribute("data-grey")]).toEqual(["dark", true]);
    await user.click(screen.getByRole("button", { name: "Done" }));
    await user.click(screen.getByRole("button", { name: "Thinking Lab" }));
    await user.click(await screen.findByRole("button", { name: /^Light the Village/ }));
    await user.click(await screen.findByRole("button", { name: "Begin" }));
    expect(await screen.findByText("Plan a path for light using mirrors, then test and adjust.")).toHaveClass("captions");
    cleanup();
    expect(root.hasAttribute("data-grey")).toBe(false); // the next person on the device starts fresh
    const again = start(); void again;
    await enter();
    await screen.findByRole("button", { name: /My way/ });
    await waitFor(() => expect(root.dataset.theme).toBe("dark")); // remembered for this learner (loads just after the screen)
  });
});

describe("the support plan", () => {
  it("lets a specialist set goals, observe and write notes, and shows the family the goals and shared notes only", async () => {
    const user = start();
    await signInDemo(user, "Demo specialist");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Goals" }));
    expect(await screen.findByText("Follows a 3-step plan without reminders")).toBeInTheDocument();
    await user.type(screen.getByRole("textbox", { name: /^Goal/ }), "Waits for a turn in a game");
    await user.click(screen.getByRole("button", { name: "Add goal" }));
    const item = (await screen.findByText("Waits for a turn in a game")).closest("li")!;
    await user.click(within(item).getByText("Add an observation"));
    await user.click(within(item).getByLabelText(/On their own/));
    await user.click(within(item).getByRole("button", { name: "Save observation" }));
    expect(await within(item).findByText("Working on it", { selector: ".status" })).toBeInTheDocument(); // seen done alone
    expect(within(item).getByRole("img", { name: /On their own/ })).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Notes" }));
    await user.type(await screen.findByLabelText("New note"), "Talked about turn-taking with the class.");
    await user.click(screen.getByRole("button", { name: "Save note" }));
    expect(await screen.findByText("Talked about turn-taking with the class.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await signInDemo(user, "Demo parent");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    expect(screen.queryByRole("tab", { name: "Notes" })).toBeNull();
    await user.click(screen.getByRole("tab", { name: "Goals" }));
    expect(await screen.findByText("Waits for a turn in a game")).toBeInTheDocument();
    expect(screen.getByText("Planned all the robot's steps before starting today. A big step.")).toBeInTheDocument(); // shared
    expect(screen.queryByText("Talked about turn-taking with the class.")).toBeNull(); // not shared
    expect(screen.queryByRole("button", { name: "Add goal" })).toBeNull();
  });
});

describe("adapting", () => {
  it("shows adults a level suggestion with its evidence, applies it only when chosen, and the learner's lessons follow", async () => {
    const user = start();
    await signInDemo(user, "Demo specialist");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Adapting" }));
    expect(await screen.findByText("Ready for more in maths: try Grade 6")).toBeInTheDocument();
    expect(screen.getByText(/8 of the last 8 maths questions at Grade 5 were answered without support/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Use this" }));
    expect(await screen.findByText("Done. Brave Meerkat's maths lessons now use Grade 6.")).toBeInTheDocument();
    expect(screen.queryByText("Ready for more in maths: try Grade 6")).toBeNull();
    await user.click(screen.getByText("Switch single rules off"));
    await user.click(screen.getByRole("checkbox", { name: "Shorter lessons (3 questions)" }));
    await user.click(screen.getByText(/Changes made/));
    expect(screen.getByText(/Maths level set to Grade 6 \(Demo Specialist\)/)).toBeInTheDocument();
    expect((await store.kv.all("learner_settings"))[0]).toMatchObject({ levels: { maths: 6 }, adaptOff: { shorter: true } });
    // The learner's Learn menu now shows maths at Grade 6
    await user.click(screen.getByRole("tab", { name: "Team" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await user.click(screen.getByRole("button", { name: "I'm a learner" }));
    await user.click(await screen.findByRole("button", { name: "Brave Meerkat" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await user.click(await screen.findByRole("button", { name: "Skip" })); // "How are you feeling?"
    await user.click(await screen.findByRole("button", { name: "Learn" }));
    expect(await screen.findByRole("heading", { name: /^Maths\s*· Grade 6$/ })).toBeInTheDocument();
  });
});

describe("reports", () => {
  it("previews a report and never includes health records", async () => {
    const user = start();
    await signInDemo(user, "Demo specialist");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Report" }));
    expect(await screen.findByRole("heading", { name: "Learning report for Brave Meerkat" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Individual support goals" })).toBeInTheDocument();
    expect(screen.getByText("Follows a 3-step plan without reminders")).toBeInTheDocument();
    expect(screen.queryByText(/Example medicine/)).toBeNull();
    await user.selectOptions(screen.getByLabelText("Type of report"), "family");
    expect(await screen.findByRole("heading", { name: "Family summary for Brave Meerkat" })).toBeInTheDocument();
    expect(screen.queryByText(/Try the pattern activity again/)).toBeNull(); // a specialists-only note
  });
});

describe("progress", () => {
  it("shows the week-by-week chart, the domains by month and a timeline", async () => {
    const user = start();
    await signInDemo(user, "Demo specialist");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Progress" }));
    expect(await screen.findByRole("heading", { name: "How Brave Meerkat is developing" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /^Brave Meerkat's activities over the last/ })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Thinking domains by month" })).toBeInTheDocument();
    expect(screen.getAllByText(/^Session: \d+ activities$/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Try the pattern activity again/)).toBeInTheDocument(); // the team sees all notes
  });
  it("shows the family their shared notes and health entries, and nothing for specialists only", async () => {
    const user = start();
    await signInDemo(user, "Demo parent");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Progress" }));
    expect(await screen.findByText(/Started Example medicine/)).toBeInTheDocument();
    expect(screen.queryByText(/Try the pattern activity again/)).toBeNull();
  });
});

describe("next-session plan", () => {
  it("lets the team plan the next session, which the learner sees once as My plan today", async () => {
    const user = start();
    await signInDemo(user, "Demo specialist");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Next session" }));
    await user.selectOptions(await screen.findByLabelText("Add a step"), "x:light");
    await user.click(screen.getByRole("button", { name: "Add to the plan" }));
    await user.selectOptions(screen.getByLabelText("Add a step"), "finish");
    await user.click(screen.getByRole("button", { name: "Add to the plan" }));
    expect(await screen.findByRole("list", { name: "Brave Meerkat's plan for next session" })).toHaveTextContent(/Light the Village.*Finish/);
    // Open the learner's space on this device
    await user.click(screen.getByRole("tab", { name: "Team" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await user.click(screen.getByRole("button", { name: "I'm a learner" }));
    await user.click(await screen.findByRole("button", { name: "Brave Meerkat" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await user.click(await screen.findByRole("button", { name: "Skip" })); // "How are you feeling?"
    expect(await screen.findByRole("heading", { name: "My plan today" })).toBeInTheDocument();
    expect(screen.getByText(/Demo Specialist made this plan for you/)).toBeInTheDocument();
    expect((await store.kv.all("learner_settings"))[0]).toMatchObject({ plan: null, lastPlan: { by: "Demo Specialist" } }); // used once
    await user.click(screen.getByRole("button", { name: "Start: Light the Village" }));
    expect(await screen.findByRole("heading", { name: "Light the Village" })).toBeInTheDocument();
  });
  it("lets the learner make their own plan", async () => {
    const user = start();
    await signInDemo(user, "Demo parent");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Sharing" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await user.click(screen.getByRole("button", { name: "I'm a learner" }));
    await user.click(await screen.findByRole("button", { name: "Brave Meerkat" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await user.click(await screen.findByRole("button", { name: "Skip" })); // "How are you feeling?"
    await user.click(await screen.findByRole("button", { name: "Make my plan" }));
    const maker = within(screen.getByRole("region", { name: "Make my plan" }));
    await user.click(maker.getByRole("button", { name: "Thinking Lab" }));
    await user.click(maker.getByRole("button", { name: "Finish" }));
    await user.click(screen.getByRole("button", { name: "Save my plan" }));
    expect(screen.getByRole("list", { name: "My plan today" })).toHaveTextContent(/Thinking Lab.*Finish/);
    expect(screen.getByRole("button", { name: "Start: Thinking Lab" })).toBeInTheDocument();
  });
});

describe("adding a child", () => {
  it("lets a parent add their child, with consent, and the child appears", async () => {
    const user = start();
    await signInDemo(user, "Demo parent");
    await user.click(await screen.findByRole("button", { name: "Add a child" }));
    await user.type(await screen.findByLabelText(/^Nickname/), "Happy Hippo");
    await user.selectOptions(screen.getByLabelText("Age"), "early");
    expect(screen.getByLabelText("Level to start at")).toHaveValue("0");
    await user.click(screen.getByRole("button", { name: "Add child" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/tick the box/);
    await user.click(screen.getByRole("checkbox", { name: /I am this child's parent or guardian/ }));
    await user.click(screen.getByRole("button", { name: "Add child" }));
    expect(await screen.findByRole("heading", { name: "Happy Hippo" })).toBeInTheDocument();
    expect(screen.getByText("NCF, Grade R")).toBeInTheDocument();
  });
});

describe("rule review", () => {
  it("lets specialists review each adaptation rule and see colleagues' reviews; families don't review", async () => {
    const user = start();
    await signInDemo(user, "Demo specialist");
    await user.click(await screen.findByRole("button", { name: "Review the adaptation rules" }));
    expect(await screen.findByRole("heading", { name: "Review the adaptation rules" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(7);
    await user.click(screen.getByRole("button", { name: "Save my review of Shorter lessons" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Choose your view first.");
    const shorter = within(screen.getByRole("region", { name: "Shorter lessons" }));
    await user.click(shorter.getByRole("radio", { name: "Needs a change" }));
    await user.type(shorter.getByLabelText(/What would you change/), "Start with 4 questions, not 3.");
    await user.click(shorter.getByRole("button", { name: "Save my review of Shorter lessons" }));
    expect(await screen.findByText('Review of "Shorter lessons" saved. Thank you.')).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await signInDemo(user, "Demo therapist");
    await user.click(await screen.findByRole("button", { name: "Review the adaptation rules" }));
    const seen = within(await screen.findByRole("region", { name: "Shorter lessons" }));
    await user.click(seen.getByText("1 other review"));
    expect(seen.getByText(/Demo Specialist/)).toBeInTheDocument();
    expect(seen.getByText(/Needs a change\. "Start with 4 questions, not 3\."/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await signInDemo(user, "Demo parent");
    await screen.findByRole("heading", { name: "Your children" });
    expect(screen.queryByRole("button", { name: "Review the adaptation rules" })).toBeNull();
  });
});

describe("adding staff", () => {
  it("lets a school admin add a colleague who has an account, invite one who hasn't, and remove staff", async () => {
    const user = start();
    await signInDemo(user, "Demo school admin");
    await user.type(await screen.findByLabelText(/Their email address/), "parent@example.org");
    await user.selectOptions(screen.getByLabelText("Their role"), "teacher");
    await user.click(screen.getByRole("button", { name: /^Add to / }));
    expect(await screen.findByText(/parent@example\.org already had an account and is now staff/)).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: /Demo Parent/ })).toBeInTheDocument();
    await user.type(screen.getByLabelText(/Their email address/), "New.Teacher@School.org");
    await user.click(screen.getByRole("button", { name: /^Add to / }));
    expect(await screen.findByText(/Invitation saved for new\.teacher@school\.org/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Waiting to register" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancel the invitation for new.teacher@school.org" }));
    expect(await screen.findByText("Invitation for new.teacher@school.org cancelled.")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Waiting to register" })).toBeNull();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    await user.click(screen.getByRole("button", { name: /^Remove Demo Therapist from / }));
    expect(await screen.findByText(/Demo Therapist is no longer staff/)).toBeInTheDocument();
    expect(screen.queryByRole("rowheader", { name: /Demo Therapist/ })).toBeNull();
  });
});

describe("check-ins and breaks", () => {
  it("asks how the learner feels, offers a break with movement ideas, and a help card for a grown-up", async () => {
    const user = start();
    await signInDemo(user, "Demo parent");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Sharing" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await user.click(screen.getByRole("button", { name: "I'm a learner" }));
    await user.click(await screen.findByRole("button", { name: "Brave Meerkat" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    expect(await screen.findByRole("heading", { name: "How are you feeling?" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Worried" }));
    await user.click(await screen.findByRole("button", { name: "A quiet break first" }));
    expect(await screen.findByRole("heading", { name: "Take a break. Stay as long as you like." })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Stretch up high" }));
    expect(screen.getByRole("status")).toHaveTextContent(/Reach your arms up high/);
    await user.click(screen.getByRole("button", { name: "I'm ready" }));
    expect(await screen.findByRole("heading", { name: "Hello, Brave Meerkat" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "I need help" }));
    expect(await screen.findByRole("heading", { name: "I would like some help, please." })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(await screen.findByRole("heading", { name: "Hello, Brave Meerkat" })).toBeInTheDocument();
    // Energy is checked before every second activity, not before the first
    await user.click(screen.getByRole("button", { name: "Thinking Lab" }));
    for (let i = 0; i < 2; i++) {
      await user.click(await screen.findByRole("button", { name: /^Light the Village\./ }));
      await user.click(await screen.findByRole("button", { name: "Back to games" }));
    }
    expect(screen.queryByRole("heading", { name: "How's your battery?" })).toBeNull();
    await user.click(await screen.findByRole("button", { name: /^Light the Village\./ }));
    expect(await screen.findByRole("heading", { name: "How's your battery?" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Low" }));
    await user.click(screen.getByRole("button", { name: "Take a break first" }));
    await user.click(await screen.findByRole("button", { name: "I'm ready" }));
    expect(await screen.findByRole("heading", { name: "Light the Village" })).toBeInTheDocument(); // the game starts after the break
  });
});

describe("talk board", () => {
  it("is in reach on every learner screen, says the picture tapped, and 'I feel unsafe' gets help", async () => {
    const user = start();
    await signInDemo(user, "Demo parent");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Sharing" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await user.click(screen.getByRole("button", { name: "I'm a learner" }));
    await user.click(await screen.findByRole("button", { name: "Brave Meerkat" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    expect(await screen.findByRole("button", { name: "Talk board" })).toBeInTheDocument(); // even on "How are you feeling?"
    await user.click(screen.getByRole("button", { name: "Skip" }));
    await user.click(screen.getByRole("button", { name: "Thinking Lab" }));
    await user.click(await screen.findByRole("button", { name: /^Light the Village\./ }));
    await user.click(screen.getByRole("button", { name: "Talk board" })); // mid-game
    const board = within(await screen.findByRole("dialog", { name: "Talk board" }));
    await user.click(board.getByRole("button", { name: "I need the toilet" }));
    expect(board.getByRole("status")).toHaveTextContent("I need the toilet");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: "Talk board" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Talk board" }));
    await user.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "I feel unsafe" }));
    expect(await screen.findByText(/You did the right thing/)).toBeInTheDocument();
    expect((await store.kv.all("concerns"))[0]).toMatchObject({ where: "talk board" });
  });
});

describe("my character", () => {
  it("lets the learner make a character that waves on their home, and sends it for their family and team", async () => {
    const user = start();
    await signInDemo(user, "Demo parent");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Sharing" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await user.click(screen.getByRole("button", { name: "I'm a learner" }));
    await user.click(await screen.findByRole("button", { name: "Brave Meerkat" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await user.click(await screen.findByRole("button", { name: "Skip" }));
    await user.click(screen.getByRole("button", { name: "Make my character" }));
    expect(await screen.findByRole("heading", { name: "Make your character" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^Sky watcher/ }));
    await user.click(screen.getByRole("button", { name: "Robot" }));
    expect(screen.queryByRole("group", { name: "Skin tone" })).toBeNull(); // robots have no skin or hair
    await user.clear(screen.getByLabelText("Name for your character"));
    await user.type(screen.getByLabelText("Name for your character"), "Zuzu<b>!");
    expect(screen.getByLabelText("Name for your character")).toHaveValue("Zuzub"); // only letters, numbers, spaces
    await user.click(screen.getByRole("button", { name: "I like it" }));
    await user.click(await screen.findByRole("button", { name: "Wave and say hello, Zuzub" }));
    expect(screen.getByText("Hi, I'm Zuzub!")).toBeInTheDocument();
    expect((await store.kv.all("learner_settings"))[0]).toMatchObject({ avatar: { base: "robot", name: "Zuzub", prop: "telescope" } });
    expect((await store.kv.outbox()).some(e => e.table === "learner_settings")).toBe(true); // goes to the server for the family and team
  });
});

describe("My way on every device", () => {
  it("sends the learner's choices for their other devices, and applies choices made elsewhere", async () => {
    const user = start();
    await store.receive("learner_settings", [{ id: DEMO.kid, adaptAuto: true, adaptOff: {}, levels: {}, decisions: {}, log: [], prefs: { size: "larger", grey: true } }]);
    await signInDemo(user, "Demo parent");
    await user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
    await user.click(screen.getByRole("tab", { name: "Sharing" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await user.click(screen.getByRole("button", { name: "I'm a learner" }));
    await user.click(await screen.findByRole("button", { name: "Brave Meerkat" }));
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await user.click(await screen.findByRole("button", { name: "Skip" }));
    await waitFor(() => expect(document.documentElement.hasAttribute("data-grey")).toBe(true)); // chosen on another device
    await user.click(screen.getByRole("button", { name: /My way/ }));
    await user.click(screen.getByRole("checkbox", { name: "Calm mode: fewer things on the screen" }));
    const sent = (await store.kv.outbox()).filter(e => e.table === "learner_settings").pop()!;
    expect(sent.row).toEqual({ id: DEMO.kid, prefs: expect.objectContaining({ calm: true, grey: true, size: "larger" }) }); // only what changed
  });
});
