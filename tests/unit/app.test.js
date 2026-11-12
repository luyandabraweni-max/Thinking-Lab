import { describe, it, expect, beforeEach } from "vitest";
import { loadApp } from "./load-app.js";

let app;
beforeEach(() => { app = loadApp(); });

describe("boot", () => {
  it("renders the welcome screen", () => {
    expect(app.main()).toContain("Welcome");
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
  it("gives each Rule Machine pattern its own texture", () => {
    const tok = f => app.run(`rmToken({ shape: "square", fill: "${f}", size: "big" }, 40)`);
    expect(tok("striped")).toContain("<pattern"); expect(tok("dotted")).toContain("<circle cx=\"3.5\""); expect(tok("solid")).not.toContain("<pattern");
  });
  it("draws each veld population with its own line style and marker", () => {
    const h = app.run(`veldCharts(veldRun(VELD_START, 1, 3), 4)`);
    expect(h).toContain('stroke-dasharray="6 3"'); expect(h).toContain('stroke-dasharray="2 3"'); expect(h).toContain("<rect"); expect(h).toContain("<circle");
  });
  it("says in words when a hut is lit, not only with colour", () => {
    app.run(`S.motion = true; startExercise(EXERCISES.find(x => x.id === "light")); document.getElementById("xBegin").click()`);
    expect(app.main()).toContain("lamp not lit");
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
