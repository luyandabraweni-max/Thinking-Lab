import { describe, it, expect, beforeEach } from "vitest";
import { loadApp } from "./load-app.js";

let app;
// A maths unit at grade 5 with a multiple-choice question of more than 2 options, and history rows for it.
const setup = `var MU = UNITS.find(u => areaOf(u.subject) === "maths" && u.grade === 5 && u.questions.some(q => q.type === "mcq" && q.options.length > 2));
  var MQ = MU.questions.findIndex(q => q.type === "mcq" && q.options.length > 2);
  var row = (d, st, h, f) => { const r = [d, MU.id, st, "chose", h || 0, ""]; if (f) r.push(f); return r; };
  var startQ = qi => { S.obs = []; const run = { x: { id: MU.id }, acted: false, recs: [], qs: MU.questions, parts: 2 }; unitQuestion(MU, run, qi); return run; };`;
beforeEach(() => { app = loadApp(); app.run(setup); });
const click = sel => app.run(`document.querySelector(${JSON.stringify(sel)}).click()`);
const wrongIndex = () => app.run(`[...document.querySelectorAll("[data-o]")].map(b => +b.dataset.o).find(i => i !== MU.questions[MQ].answer)`);

describe("adaptation rules", () => {
  it("counts an answer after 'make it easier' as support", () => {
    expect(app.run(`statusOf({ firstMatched: true, latestMatched: true, hints: 0, easier: true })`)).toBe("support");
  });
  it("needs enough evidence before changing anything", () => {
    expect(app.run(`adaptFor([row("2026-11-01", "support", 1)])`)).toEqual({ fewer: {} });
  });
  it("offers help sooner when help was used on most recent questions", () => {
    expect(app.run(`adaptFor(["2026-11-01", "2026-11-02"].flatMap(d => [row(d, "support", 1), row(d, "support", 2), row(d, "alone"), row(d, "support", 1)])).sooner`)).toContain("help was used on 6 of the last 8");
  });
  it("shortens lessons after repeated moving on, but only from recent sessions", () => {
    expect(app.run(`!!adaptFor([1, 2, 3].map(i => row("2026-11-0" + i, "notyet", 0, { s: 1 }))).shorter`)).toBe(true);
    expect(app.run(`!!adaptFor([row("2026-10-01", "notyet", 0, { s: 1 }), row("2026-10-02", "notyet", 0, { s: 1 }), row("2026-11-01", "alone"), row("2026-11-02", "alone"), row("2026-11-03", "alone")]).shorter`)).toBe(false);
  });
  it("starts with fewer choices only while the learner keeps asking for easier", () => {
    expect(app.run(`!!adaptFor([row("d1", "support", 0, { e: 1 }), row("d1", "support", 0, { e: 1 }), row("d2", "support", 0, { e: 1 })]).fewer.maths`)).toBe(true);
    expect(app.run(`adaptFor([1, 2, 3, 4, 5, 6].map(i => row("d" + i, "support", 0, { a: 1 }))).fewer`)).toEqual({});
  });
  it("stops when an adult turns automatic changes off", () => {
    expect(app.run(`S.history = [1, 2, 3].map(i => row("2026-11-0" + i, "notyet", 0, { s: 1 })); S.adaptAuto = false; adaptLive([], MU.id)`)).toEqual({ fewer: {} });
  });
  it("records the support used with each question", () => {
    app.run(`S.obs = [{ id: MU.id, reflection: "ok", items: [{ firstMatched: true, latestMatched: true, hints: 1, easier: true, movedOn: false, quick: 1 }] }]`);
    expect(app.run(`sessionRows()[0][6]`)).toEqual({ e: 1, q: 1 });
  });
});

describe("adaptation in a lesson", () => {
  it("starts with two choices and lets the learner show them all", () => {
    app.run(`S.history = [row("d1", "support", 0, { e: 1 }), row("d1", "support", 0, { e: 1 }), row("d2", "support", 0, { e: 1 })]; startQ(MQ)`);
    expect(app.main()).toContain("Two choices to start");
    expect(app.run(`document.querySelectorAll("[data-o]").length`)).toBe(2);
    click("#qAll");
    expect(app.run(`document.querySelectorAll("[data-o]").length`)).toBe(app.run(`MU.questions[MQ].options.length`));
    expect(app.run(`S.adaptSkip["fewer:maths"]`)).toBe(true);
  });
  it("offers help after one wrong answer when help is often used", () => {
    app.run(`S.history = ["2026-11-01", "2026-11-02"].flatMap(d => [row(d, "support", 1), row(d, "support", 2), row(d, "alone"), row(d, "support", 1)]); startQ(MQ)`);
    click(`[data-o="${wrongIndex()}"]`); click("#qCheck");
    expect(app.main()).toContain("This one is tricky. What would help?");
  });
  it("says 'take your time' after two very quick wrong answers", () => {
    app.run(`startQ(MQ)`);
    click(`[data-o="${wrongIndex()}"]`); click("#qCheck");
    expect(app.main()).not.toContain("Take your time");
    click(`[data-o="${wrongIndex()}"]`); click("#qCheck");
    expect(app.main()).toContain("Take your time. Read the question again, then choose.");
  });
  it("offers the full lesson when it was shortened", () => {
    app.run(`S.history = [1, 2, 3].map(i => row("2026-11-0" + i, "notyet", 0, { s: 1 })); var BIG = UNITS.find(u => u.questions.length > 3); unitIntro(BIG)`);
    expect(app.main()).toContain("This lesson is shorter today: 3 questions");
    click("#uFull");
    expect(app.main()).not.toContain("This lesson is shorter today");
  });
});

describe("adaptation in the portal", () => {
  const asSpecialist = `PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-specialist"); var PL = portalLearner("demo-l1"); PL.learnGrade = 5; PL.learnLevels = {};
    PL.rows = ["2026-11-01", "2026-11-03"].flatMap(d => [1, 2, 3, 4].map(() => row(d, "alone"))); specialistLearner("demo-l1", "overview")`;
  it("suggests a level change with its evidence, and applies it only when an adult chooses it", () => {
    app.run(asSpecialist);
    expect(app.main()).toContain("Ready for more in maths: try Grade 6");
    expect(app.run(`PL.learnLevels.maths`)).toBeUndefined();
    click("[data-adyes]");
    expect(app.run(`PL.learnLevels.maths`)).toBe(6);
    expect(app.run(`PL.adaptLog[0].text`)).toBe("Maths level set to Grade 6");
    expect(app.main()).not.toContain("Ready for more in maths");
  });
  it("sets a suggestion aside with Not now", () => {
    app.run(asSpecialist); click("[data-adno]");
    expect(app.main()).not.toContain("Ready for more in maths");
    expect(app.run(`PL.learnLevels.maths`)).toBeUndefined();
  });
  it("lets an adult turn automatic changes off, and the next session respects it", () => {
    app.run(asSpecialist);
    app.run(`const b = document.getElementById("adAuto"); b.checked = false; b.dispatchEvent(new Event("change"))`);
    expect(app.run(`PL.adaptAuto`)).toBe(false);
    expect(app.main()).toContain("Automatic changes are off");
    app.run(`startPortalSession(PL)`);
    expect(app.run(`S.adaptAuto`)).toBe(false);
  });
  it("shows the support used in recent sessions", () => {
    app.run(asSpecialist.replace(`row(d, "alone")`, `row(d, "support", 1, { e: 1 })`));
    expect(app.main()).toContain("1 hint, made easier");
  });
});

describe("access", () => {
  it("captions what the voice says when the learner wants them", () => {
    app.run(`S.my.captions = true; caption("Press Begin when you are ready.")`);
    expect(app.run(`document.querySelector(".captions").hidden`)).toBe(false);
    expect(app.run(`document.querySelector(".captions").textContent`)).toBe("Press Begin when you are ready.");
    app.run(`stopSpeaking()`);
    expect(app.run(`document.querySelector(".captions").hidden`)).toBe(true);
  });
  it("captions a long read-aloud a sentence at a time", () => {
    expect(app.run(`sentenceAt("One two. Three four! Five?", 10)`)).toBe("Three four!");
  });
  it("only offers sign language videos once there are some", () => {
    app.run(`openMyWay()`);
    expect(app.run(`document.getElementById("layer").innerHTML`)).not.toContain("Sign language videos");
    app.run(`window.__SIGNS = { "Hello.": "assets/signs/hello.mp4" }; openMyWay()`);
    expect(app.run(`document.getElementById("layer").innerHTML`)).toContain("Sign language videos");
  });
  it("matches a spoken answer to a choice", () => {
    app.run(`var O = ["Triangle", "Square", "Circle", "12.5"], SH = [2, 0, 1, 3]`);
    expect(app.run(`matchSpoken(["a square"], O, SH)`)).toBe(1);
    expect(app.run(`matchSpoken(["the first one"], O, SH)`)).toBe(2);
    expect(app.run(`matchSpoken(["twelve point five"], O, SH)`)).toBe(3);
    expect(app.run(`matchSpoken(["banana"], O, SH)`)).toBe(null);
    expect(app.run(`[spokenNumber("twenty three"), spokenNumber("one hundred and five"), spokenNumber("hello")]`)).toEqual(["23", "105", null]);
  });
  it("chooses a button when the pointer rests on it", async () => {
    app.run(`S.my.dwell = true; S.my.dwellSpeed = "fast"; welcome()`);
    app.run(`const e = new MouseEvent("pointermove", { bubbles: true, clientX: 5, clientY: 5 }); Object.defineProperty(e, "pointerType", { value: "mouse" }); document.getElementById("wTry").dispatchEvent(e)`);
    expect(app.run(`document.getElementById("wTry").classList.contains("dwelling")`)).toBe(true);
    await new Promise(r => setTimeout(r, 1100));
    expect(app.main()).toContain("Start a try-out session");
  });
});
