import { DEMO, LocalStore, MemoryKv } from "@tl/data";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { createServices, type Services } from "./platform";

// Automated accessibility checks (axe-core, WCAG 2.2 A and AA rules) on the main screens for each role. Colour contrast
// needs real layout, so it is checked in a browser instead; everything else is checked here, on every commit.
let services: Services, store: LocalStore;
beforeEach(async () => { localStorage.clear(); store = new LocalStore(new MemoryKv()); services = await createServices({} as ImportMetaEnv, store); });

async function noProblems(where: string) {
  const res = await axe.run(document.body, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] }, rules: { "color-contrast": { enabled: false } } });
  const found = res.violations.map(v => `${where}: ${v.id} (${v.help}) at ${v.nodes.map(n => n.target.join(" ")).slice(0, 3).join(", ")}`);
  expect(found).toEqual([]);
}
type User = ReturnType<typeof userEvent.setup>;
const signIn = async (user: User, who: string) => user.click(await screen.findByRole("button", { name: who }));
const openKid = async (user: User) => user.click(await screen.findByRole("button", { name: /^Open Brave Meerkat/ }));
const tab = async (user: User, name: string) => { await user.click(screen.getByRole("tab", { name })); await screen.findByRole("tabpanel"); };

describe("accessibility", () => {
  it("the front door and sign-in", async () => {
    const user = userEvent.setup(); render(<App services={services} />);
    await screen.findByRole("heading", { name: "Welcome" });
    await noProblems("front door");
    await user.click(screen.getAllByRole("button", { name: "Sign in or register" })[0]!);
    await noProblems("sign in");
  });
  it("a parent's screens", async () => {
    const user = userEvent.setup(); render(<App services={services} />);
    await signIn(user, "Demo parent");
    await screen.findByRole("heading", { name: "Your children" });
    await noProblems("parent home");
    await openKid(user);
    for (const t of ["Messages", "Goals", "Progress", "Next session", "Adapting", "Report", "Health", "Sharing"]) {
      await tab(user, t);
      await new Promise(r => setTimeout(r, 50)); // lazy tabs
      await noProblems(`parent: ${t}`);
    }
  });
  it("the school profile and the support tracker", async () => {
    const user = userEvent.setup(); render(<App services={services} />);
    await signIn(user, "Demo specialist");
    await openKid(user);
    await user.click(await screen.findByRole("tab", { name: "School profile" }));
    for (const t of ["Profile", "Phase guide", "Their words", "Observations", "Concerns", "Support map", "Plan", "Term reviews"]) {
      await user.click(await screen.findByRole("tab", { name: t }));
      await screen.findAllByRole("tabpanel");
      if (t === "Observations") await user.click(await screen.findByText(/^Communication & language ·/));
      if (t === "Plan") await user.click(screen.getByRole("button", { name: "Add an action" }));
      await noProblems(`school profile: ${t}`);
    }
    await user.click(screen.getByRole("button", { name: "All learners" }));
    await user.click(await screen.findByRole("button", { name: "Support tracker" }));
    await screen.findByRole("heading", { name: "Support tracker" });
    await screen.findByRole("button", { name: "Brave Meerkat" });
    await noProblems("support tracker");
  }, 60000); // eight large pages, each scanned in full
  it("a specialist's and a school admin's screens", async () => {
    const user = userEvent.setup(); render(<App services={services} />);
    await signIn(user, "Demo specialist");
    await screen.findByRole("heading", { name: "Your learners" });
    await noProblems("specialist home");
    await openKid(user);
    await tab(user, "Notes");
    await noProblems("specialist: notes");
    await user.click(screen.getByRole("button", { name: "All learners" }));
    await user.click(await screen.findByRole("button", { name: "Review the adaptation rules" }));
    await screen.findByRole("heading", { name: "Review the adaptation rules" });
    await noProblems("rule review");
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await signIn(user, "Demo school admin");
    await screen.findByRole("heading", { name: "Add staff" });
    await noProblems("school admin");
  });
  it("a learner's screens", async () => {
    const user = userEvent.setup(); render(<App services={services} />);
    await signIn(user, "Demo parent");
    await openKid(user);
    await tab(user, "Sharing");
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await user.click(screen.getByRole("button", { name: "I'm a learner" }));
    await user.click(await screen.findByRole("button", { name: "Brave Meerkat" }));
    await noProblems("picture password");
    for (const p of ["lion", "star", "moon"]) await user.click(screen.getByRole("button", { name: p }));
    await screen.findByRole("heading", { name: "How are you feeling?" });
    await noProblems("feelings");
    await user.click(screen.getByRole("button", { name: "Skip" }));
    await noProblems("learner home");
    await user.click(screen.getByRole("button", { name: "Talk board" }));
    await noProblems("talk board");
    await user.keyboard("{Escape}");
    for (const [open, heading] of [["My way", "How I like it"], ["Make my character", "Make your character"], ["Take a break", "Take a break. Stay as long as you like."]] as const) {
      await user.click(screen.getByRole("button", { name: new RegExp(open) }));
      await screen.findByRole("heading", { name: heading });
      await noProblems(open);
      await user.click(screen.getByRole("button", { name: /^(Done|Back|I'm ready)$/ }));
      await screen.findByRole("heading", { name: "Hello, Brave Meerkat" });
    }
    await user.click(screen.getByRole("button", { name: "Learn" }));
    await new Promise(r => setTimeout(r, 100));
    await noProblems("learn menu");
    expect(DEMO.kid).toBeTruthy();
  });
});
