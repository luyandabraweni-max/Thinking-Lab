import { describe, it, expect, beforeEach } from "vitest";
import { loadApp } from "./load-app.js";

// Plays each Thinking Lab game to the end, as a learner would, with movement off so animations finish at once.
let app;
const click = sel => app.run(`document.querySelector(${JSON.stringify(sel)}).click()`);
const has = sel => app.run(`!!document.querySelector(${JSON.stringify(sel)})`);
const tick = () => new Promise(r => setTimeout(r, 20));
const begin = (id, band) => app.run(`S.motion = true; S.band = "${band || "younger"}"; S.obs = []; startExercise(EXERCISES.find(x => x.id === "${id}")); document.getElementById("xBegin").click()`);
const finished = id => { click('[data-r="0"]'); expect(app.main()).toContain("Choose another"); return app.run(`S.obs[S.obs.length - 1]`); };
beforeEach(() => { app = loadApp(); });

describe("the Thinking Lab", () => {
  it("has two games in each of the four domains, each with a blueprint, curriculum link, prompt and home idea", () => {
    expect(app.run(`[...new Set(EXERCISES.map(x => x.domain))].map(d => EXERCISES.filter(x => x.domain === d).length)`)).toEqual([2, 2, 2, 2]);
    expect(app.run(`EXERCISES.every(x => GAMES[x.id] && SPEC[x.id] && CAPS_LINK[x.id] && NCF_LINK[x.id] && THINK[x.id] && HOME_IDEA[x.id])`)).toBe(true);
  });
  it("drops saved records of the old games and gives demo learners the new history", () => {
    app.window.localStorage.setItem("tl-demo-portal-v1", JSON.stringify({ v: 1, seq: 0, accounts: [], learners: [{ id: "demo-l0", demoIndex: 0, nickname: "x", rows: [["2026-10-01", "pattern", "alone", "pair", 0, ""]], specialists: [], consent: {} }] }));
    app.run(`loadPortal()`);
    expect(app.run(`portalLearner("demo-l0").rows.every(r => exById(r[1]))`)).toBe(true);
    expect(app.run(`portalLearner("demo-l0").rows.length`)).toBeGreaterThan(1);
  });
});

describe("Light the Village", () => {
  it("lights every hut with the planned mirrors, and records a first-time success", async () => {
    begin("light");
    click('[data-cell="0,2"]'); click('[data-cell="0,2"]'); // empty, then /, then \
    click("#ltShine"); await tick();
    expect(app.main()).toContain("The hut has light!");
    click("#ltNext");
    click('[data-cell="2,0"]'); click('[data-cell="2,3"]'); click("#ltShine"); await tick();
    expect(app.main()).toContain("Every hut has light!");
    click("#ltNext");
    const o = finished();
    expect(o.items.map(i => i.firstMatched)).toEqual([true, true]);
    expect(o.extra).toContain("Mirrors placed before the first shine: 1, 2");
  });
  it("says where the light went when it misses", async () => {
    begin("light"); click("#ltShine"); await tick();
    expect(app.main()).toContain("The light reached 0 of 1 hut. It left the village at row 1, column 4.");
  });
});

describe("The Literal Robot", () => {
  it("goes wrong in a funny way when steps are out of order, then works when fixed", () => {
    begin("literal");
    for (const id of ["spread", "bread", "open", "close"]) click(`[data-add="${id}"]`);
    click("#lrRun");
    expect(app.main()).toContain("Step 1 went wrong");
    click('[data-up="1"]'); click('[data-up="2"]'); // now bread, open, spread, close
    click("#lrRun");
    expect(app.main()).toContain("You found the problem and fixed it");
    click("#lrNext");
    for (const id of ["coat", "door", "walk", "umbrella"]) click(`[data-add="${id}"]`);
    click("#lrRun"); click("#lrNext");
    const o = finished();
    expect(o.items[0].runs).toBe(2); expect(o.items[1].firstMatched).toBe(true);
  });
});

describe("The Secret Rule Machine", () => {
  it("tests objects, learns from a wrong guess, proves the rule and records fair tests", async () => {
    begin("rule");
    click('[data-k="shape"][data-v="circle"]'); click("#rmTest"); await tick();
    click('[data-k="size"][data-v="small"]'); click("#rmTest"); await tick(); // one change from the last test: a fair test
    for (let round = 0; round < 2; round++) {
      // Each guess shows the right rule and 3 of the other 4, shuffled, so trying every rule by name takes at most 5 guesses.
      const tried = [];
      while (!app.main().includes("Prove it") && tried.length < 5) {
        click("#rmGuess");
        tried.push(app.run(`(() => { const b = [...document.querySelectorAll("[data-g]")].find(b => !${JSON.stringify(tried)}.includes(b.textContent.trim())); b.click(); return b.textContent.trim(); })()`));
      }
      expect(app.main()).toContain("Prove it");
      while (has("[data-p]")) click('[data-p="1"]');
      expect(app.main()).toContain("You predicted");
      click("#rmNext");
    }
    const o = finished();
    expect(o.items[0].tests).toBe(2); expect(o.items[0].fairTests).toBeGreaterThanOrEqual(1);
    expect(o.items.every(i => i.guesses >= 1 && i.latestMatched)).toBe(true);
  });
});

describe("Veld Balance", () => {
  it("checks predictions against the model and records the open experiment", () => {
    begin("veld");
    click("#vbGo"); click('[data-t="fewer"]');
    expect(app.main()).toContain("Your prediction was right!");
    click("#vbNext"); click('[data-t="same"]');
    expect(app.main()).toContain("It turned out more, not about the same.");
    click("#vbNext");
    click("#vbRun"); click('[data-sk="rain"][data-sv="0"]'); click("#vbRun"); click("#vbDone");
    const o = finished();
    expect(o.items.map(i => i.firstMatched)).toEqual([true, false, null]);
    expect(o.items[2]).toMatchObject({ open: true, runs: 2, fairRuns: 1 });
  });
});

describe("Story Weaver", () => {
  it("builds a storybook with the learner's choices and records how they told it", () => {
    begin("story");
    click('[data-who="gogo"]'); click('[data-where="river"]'); click('[data-prob="lost"]');
    for (let p = 0; p < 3; p++) { click('[data-ev="0"]'); click('[data-feel="brave"]'); click("#swNext"); }
    click("[data-title]");
    expect(app.main()).toContain("Once upon a time, Gogo was by the river.");
    expect(app.main()).toContain("Gogo felt brave.");
    click("#swFwd"); click("#swFwd"); click("#swEnd");
    const o = finished();
    expect(o.items[0]).toMatchObject({ open: true, feelings: ["brave", "brave", "brave"] });
    expect(o.extra).toContain("Gogo looked everywhere for the lost key.");
  });
});

describe("Describe It", () => {
  it("lets Bolt find the learner's Blip from their clues, and the learner find Bolt's", () => {
    begin("describe");
    for (let r = 0; r < 3; r++) {
      if (has("#diTell")) {
        // Choose every clue that is true of the learner's own Blip, read from its label.
        const label = app.run(`document.querySelector(".di-blip.mine").getAttribute("aria-label")`);
        const want = [label.includes("a round") ? "is round" : "is tall", /one eye/.test(label) ? "has one eye" : /two eyes/.test(label) ? "has two eyes" : "has three eyes",
          /no hat/.test(label) ? "has no hat" : "wears a hat", /spots/.test(label) ? "has spots" : /stripes/.test(label) ? "has stripes" : "has no pattern"];
        // Each click redraws the screen, so find each clue button afresh before clicking it.
        const picks = app.run(`[...document.querySelectorAll("[data-cl]")].filter(b => ${JSON.stringify(want)}.some(w => b.textContent.trim() === "It " + w)).map(b => b.dataset.cl)`);
        for (const i of picks) click(`[data-cl="${i}"]`);
        click("#diTell");
        expect(app.main()).toContain("Found it!");
      } else {
        for (let i = 0; i < 4 && !app.main().includes("That's the one!"); i++) app.run(`document.querySelectorAll("[data-pick]")[${i}].click()`);
        expect(app.main()).toContain("That's the one!");
      }
      click("#diNext");
    }
    const o = finished();
    expect(o.items.filter(i => i.mode === "described").every(i => i.clues >= i.fewest)).toBe(true);
  });
});

describe("Invention Workshop", () => {
  it("explains why water stops, works once fixed, and keeps the learner's own name for it", () => {
    begin("invent");
    click('[data-part="pipe"]'); click('[data-part="gutter"]'); click('[data-part="pipe"]');
    click("#iwTest");
    expect(app.main()).toContain("pours into the ditch");
    click('[data-slot="1"]'); click('[data-part="pipe"]'); click("#iwTest");
    expect(app.main()).toContain("Water reached the garden!");
    click("#iwNext"); click("#iwTest"); click("#iwNext");
    app.run(`const n = document.getElementById("iwName"); n.value = "Splash Line"; n.dispatchEvent(new Event("input"))`);
    click('[data-gd="1"]'); click("#iwDone");
    const o = finished();
    expect(o.items[0]).toMatchObject({ tests: 2, revisions: 1, firstMatched: false, latestMatched: true });
    expect(o.extra).toContain('Invention: "Splash Line". Judged it: Water flows fast.');
  });
});

describe("How Sure Am I?", () => {
  it("asks how sure before revealing, and ends with the learner's Sure-o-meter", () => {
    begin("sure");
    for (let i = 0; i < 5; i++) { click('[data-a="1"]'); expect(app.main()).toContain("How sure are you?"); click('[data-c="very"]'); expect(has("#hsNext")).toBe(true); click("#hsNext"); }
    expect(app.main()).toContain("My Sure-o-meter");
    click("#hsOn");
    const o = finished();
    expect(o.items.every(i => i.conf === "very")).toBe(true);
    expect(o.extra).toMatch(/very sure \d\/5/);
  });
});
