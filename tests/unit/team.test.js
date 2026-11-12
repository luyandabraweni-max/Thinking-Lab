import { describe, it, expect, beforeEach } from "vitest";
import { loadApp } from "./load-app.js";

// Family, specialists and the learner working together: messages, goals, health, supports, plans and rule reviews.
let app;
const click = sel => app.run(`document.querySelector(${JSON.stringify(sel)}).click()`);
const as = id => app.run(`PORTAL.me = PORTAL.accounts.find(a => a.id === "${id}")`);
const type = (id, v) => app.run(`document.getElementById("${id}").value = ${JSON.stringify(v)}`);
beforeEach(() => { app = loadApp(); app.run(`window.__SKIP_BATTERY__ = true; var KID = portalLearner("demo-l1")`); });

describe("messages", () => {
  it("reach the rest of the team, with an unread count until read", () => {
    as("demo-parent"); app.run(`parentChild("demo-l1", "messages")`);
    type("msgText", "Slept badly last night, so today may be harder."); click("#msgSend");
    as("demo-specialist"); app.run(`specialistLearner("demo-l1", "overview")`);
    expect(app.main()).toContain("Messages (1 new)");
    app.run(`specialistLearner("demo-l1", "messages")`);
    expect(app.main()).toContain("Slept badly last night");
    app.run(`specialistLearner("demo-l1", "overview")`);
    expect(app.main()).not.toContain("new)");
  });
  it("to a learner appear at their next session, can be answered, and are always visible to the family", () => {
    as("demo-specialist"); app.run(`specialistLearner("demo-l1", "messages")`);
    type("msgText", "I loved your story about Gogo!"); click("#msgKid"); click("#msgSend");
    app.run(`startPortalSession(KID); S.need = "explore"; home()`);
    expect(app.main()).toContain("I loved your story about Gogo!");
    click('[data-reply$=":0"]');
    expect(app.main()).not.toContain("I loved your story about Gogo!");
    expect(app.run(`KID.messages[KID.messages.length - 1]`)).toMatchObject({ fromRole: "learner", text: "Thank you!" });
    as("demo-parent"); app.run(`parentChild("demo-l1", "messages")`);
    expect(app.main()).toContain("I loved your story about Gogo!");
    expect(app.main()).toContain("to Brave Meerkat");
  });
});

describe("support plan goals", () => {
  it("record observations over time, shown on the development timeline", () => {
    as("demo-specialist"); app.run(`specialistLearner("demo-l1", "goals")`);
    const g = app.run(`KID.goals[1].id`);
    app.run(`document.getElementById("go-${g}-alone").checked = true`); type(`gn-${g}`, "Tapped 'I need help' without a prompt."); click(`[data-gobs="${g}"]`);
    expect(app.run(`KID.goals[1].obs.length`)).toBe(2);
    app.run(`specialistLearner("demo-l1", "development")`);
    expect(app.main()).toContain("Tapped 'I need help' without a prompt.");
    expect(app.main()).toContain("Thinking domains, month by month");
  });
});

describe("health and medication", () => {
  it("is entered by the family, shared only with consent, and never in reports", () => {
    as("demo-parent"); app.run(`parentChild("demo-l1", "health")`);
    click(".goal-add summary"); type("mName", "Sleep drops (made up)"); type("mDose", "2 drops"); type("mWhen", "Bedtime"); click("#mAdd");
    expect(app.run(`KID.healthLog[KID.healthLog.length - 1].text`)).toBe("Started Sleep drops (made up), 2 drops, Bedtime");
    click(`[data-mgiven="${app.run(`KID.meds[1].id`)}"]`);
    expect(app.run(`KID.doses.length`)).toBe(1);
    as("demo-specialist"); app.run(`specialistLearner("demo-l1", "health")`);
    expect(app.main()).toContain("Sleep drops (made up)");
    expect(app.main()).not.toContain("data-mgiven"); // specialists can read, not change
    app.run(`KID.consent.health = false; specialistLearner("demo-l1", "health")`);
    expect(app.main()).toContain("Not shared");
    app.run(`specialistLearner("demo-l1", "development")`);
    expect(app.main()).not.toContain("Sleep drops");
    const report = app.run(`JSON.stringify(buildReport(KID, "specialist", PORTAL.me, {}))`);
    expect(report).not.toContain("Sleep drops"); expect(report).not.toContain("Example medicine");
  });
});

describe("supports and the next-session plan", () => {
  it("lets a specialist switch off one automatic rule and plan the next session", () => {
    as("demo-specialist"); app.run(`specialistLearner("demo-l1", "supports")`);
    app.run(`document.getElementById("ar-shorter").checked = false`); click("#spAuto");
    expect(app.run(`KID.adaptOff`)).toEqual({ shorter: true });
    app.run(`document.getElementById("npAdd").value = "x:veld"`); click("#npPush");
    app.run(`document.getElementById("npAdd").value = "brk"`); click("#npPush");
    expect(app.run(`KID.nextPlan`)).toEqual(["x:veld", "brk"]);
    app.run(`KID.rows = [1, 2, 3].map(i => ["2026-11-0" + i, "m5-fractions", "notyet", "chose", 0, "", { s: 1 }]); startPortalSession(KID); S.need = "explore"; home()`);
    expect(app.run(`[S.plan, S.adaptOff, adaptLive([], "m5-fractions").shorter]`)).toEqual([["x:veld", "brk"], { shorter: true }, undefined]);
    expect(app.main()).toContain("Demo Specialist made this plan for you.");
    expect(app.main()).toContain("Veld Balance");
    expect(app.run(`[KID.nextPlan, KID.lastPlan.steps]`)).toEqual([null, ["x:veld", "brk"]]);
    app.run(`planDone("lab", "veld")`);
    expect(app.run(`S.planStep`)).toBe(1);
  });
});

describe("rule review", () => {
  it("records each specialist's view of a rule and keeps it with the demo data", () => {
    as("demo-specialist"); app.run(`ruleReview()`);
    app.run(`document.getElementById("rv-slow-change").checked = true`); type("rc-slow", "3 seconds is too short for learners who use switch access."); click('[data-rv="slow"]');
    expect(app.run(`PORTAL.ruleReviews`)).toMatchObject([{ rule: "slow", verdict: "change", by: "Demo Specialist" }]);
    expect(JSON.parse(app.window.localStorage.getItem("tl-demo-portal-v1")).ruleReviews.length).toBe(1);
    as("demo-ot"); app.run(`ruleReview()`);
    expect(app.main()).toContain("1 other review");
  });
});
