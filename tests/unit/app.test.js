import { describe, it, expect, beforeEach } from "vitest";
import { loadApp } from "./load-app.js";

let app;
beforeEach(() => { app = loadApp(); });

describe("boot", () => {
  it("renders the adult setup screen", () => {
    expect(app.main()).toContain("Start a try-out session");
  });
});

describe("age and learning level are separate", () => {
  it("starts from the age group's usual level", () => {
    expect(app.run(`S.cohort = "13-18"; S.grade = undefined; curGrade()`)).toBe(9);
  });
  it("allows a usual level outside the age group", () => {
    expect(app.run(`S.cohort = "13-18"; S.grade = 2; curGrade()`)).toBe(2);
  });
  it("uses a different level per learning area", () => {
    const res = app.run(`S.cohort = "13-18"; S.grade = 9; S.levels = { maths: 2 };
      myUnits().map(u => [areaOf(u.subject), u.grade])`);
    expect(res.filter(([a]) => a === "maths").every(([, g]) => g === 2)).toBe(true);
    expect(res.filter(([a]) => a !== "maths").every(([, g]) => g === 9)).toBe(true);
    expect(res.some(([a]) => a === "maths")).toBe(true);
  });
  it("shows the level next to a subject at a different level", () => {
    app.run(`S.cohort = "13-18"; S.grade = 9; S.levels = { maths: 2 }; learnHome()`);
    expect(app.main()).toContain('<span class="pill">Grade 2</span>');
  });
});

describe("colour is never the only cue", () => {
  it("gives every base paint and mix its own texture combination", () => {
    const combos = app.run(`Object.keys(PAINT).concat(Object.values(MIXES).map(m => m[0])).map(n => paintTex(n).slice().sort().join("+"))`);
    expect(new Set(combos).size).toBe(combos.length);
  });
  it("draws textures on Paint Pots", () => {
    app.run(`gamePaint({})`);
    expect(app.main()).toContain("url(#tx");
  });
  it("turns the Sort colour rule into a pattern rule in greyscale", () => {
    app.run(`S.my.grey = true; S.band = "older"; gameSort({})`);
    const h = app.main();
    expect(h).toContain("Sort by pattern");
    expect(h).toContain("striped");
    expect(h).not.toContain("Sort by colour");
  });
  it("keeps colour words in Sort when greyscale is off", () => {
    app.run(`gameSort({})`);
    expect(app.main()).toContain("Sort by colour");
  });
});

describe("display modes", () => {
  it("sets greyscale and palette attributes from My way", () => {
    app.run(`S.my.grey = true; S.my.palette = "redgreen"; applyMyWay()`);
    const root = app.window.document.documentElement;
    expect(root.hasAttribute("data-grey")).toBe(true);
    expect(root.getAttribute("data-palette")).toBe("redgreen");
  });
  it("low stimulation turns on grey, calm, still and quiet together", () => {
    app.run(`openMyWay(); document.querySelector("[data-low]").click()`);
    expect(app.run(`[S.my.grey, S.my.calm, S.motion, S.quiet, lowStim()]`)).toEqual([true, true, true, true, true]);
  });
});

describe("Support Passport", () => {
  it("carries screen settings and levels", () => {
    const list = app.run(`S.my.grey = true; S.my.palette = "blueyellow"; S.levels = { life: 4 }; screenSettings()`);
    expect(list).toContain("Grey screen, no colours");
    expect(list).toContain("Blue-yellow safe colours");
    expect(list).toContain("Life skills: Grade 4");
  });
});
