// Phase 0 gate: every screen works in every display mode, with no accessibility faults,
// no sideways scrolling and no script errors.
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const MODES = {
  standard: "",
  "high contrast": "S.contrast = true;",
  greyscale: "S.my.grey = true;",
  "greyscale + high contrast": "S.my.grey = true; S.contrast = true;",
  "red-green safe": `S.my.palette = "redgreen";`,
  "blue-yellow safe": `S.my.palette = "blueyellow";`,
  "low stimulation": "S.my.grey = true; S.my.calm = true; S.motion = true; S.quiet = true;",
  "largest text, wide letters": `S.textSize = 1.3; S.font = "lexend";`
};

const SCREENS = {
  welcome: "welcome()",
  setup: "setup()",
  home: "S.need = 'explore'; home()",
  "learn home": "learnHome()",
  "lesson intro": "unitIntro(UNITS.find(u => u.grade === curGrade()))",
  "thinking lab": "labHome()",
  "thinking lab game intro": `startExercise(EXERCISES[0])`,
  // Every Thinking Lab game's first screen, alternating the gentler and more challenging levels
  ...Object.fromEntries(["light", "rule", "story", "invent", "literal", "veld", "describe", "sure"].map((id, i) =>
    [`game: ${id}`, `S.band = "${i % 2 ? "older" : "younger"}"; startExercise(EXERCISES.find(x => x.id === "${id}")); document.getElementById("xBegin").click()`])),
  "my way": "openMyWay()",
  "support passport": "passportStart(); passportView()",
  "avatar builder": "avatarBuilder()",
  "registration": `registerStart("parent")`,
  "parent child": `PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-parent"); parentChild("demo-l1", "progress")`,
  "specialist learner": `PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-specialist"); specialistLearner("demo-l1", "goals")`,
  "specialist overview with chart": `PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-specialist"); specialistLearner("demo-l0", "overview"); document.querySelector(".ch-table").open = true`,
  "saved 3D character (shown as a drawing)": `S.avatar = Object.assign(defaultAvatar(), { base: "robot3d", name: "Bolt" }); avatarBuilder()`,
  "adapted question with captions": `S.my.captions = true; S.my.voiceIn = true; S.history = [1, 2, 3].map(i => ["2026-11-0" + i, "m5-fractions", "support", "chose", 0, "", { e: 1, b: 1 }]);
    unitQuestion(UNITS.find(u => u.id === "m5-fractions"), { x: { id: "m5-fractions" }, acted: false, recs: [], qs: UNITS.find(u => u.id === "m5-fractions").questions, parts: 2 }, 4); caption("Take your time. Read the question again, then choose.")`,
  "parent support with adaptation": `PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-parent"); const PL = portalLearner("demo-l1"); PL.learnGrade = 5;
    PL.rows = ["2026-11-01", "2026-11-03"].flatMap(d => [1, 2, 3, 4].map(() => [d, "m5-fractions", "alone", "chose", 0, ""])); PL.adaptLog = [{ date: "2026-11-04", text: "Maths level set to Grade 5", by: "Demo Parent" }];
    parentChild("demo-l1", "support"); document.querySelector(".adapt details").open = true`,
  "specialist development": `PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-specialist"); specialistLearner("demo-l1", "development")`,
  "specialist messages": `PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-specialist"); specialistLearner("demo-l1", "messages")`,
  "specialist supports and plan": `PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-specialist"); portalLearner("demo-l1").nextPlan = ["x:veld", "brk"]; specialistLearner("demo-l1", "supports")`,
  "specialist goals with observations": `PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-specialist"); specialistLearner("demo-l1", "goals"); document.querySelector(".goal-add").open = true`,
  "parent health and medication": `PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-parent"); parentChild("demo-l1", "health"); document.querySelector(".goal-add").open = true`,
  "rule review": `PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-specialist"); ruleReview()`,
  "learner home with a message and a plan": `const K = portalLearner("demo-l1"); K.nextPlan = ["x:story", "brk"]; K.nextPlanBy = "Demo Specialist";
    K.messages.push({ id: "t1", date: new Date().toISOString(), fromId: "demo-specialist", fromName: "Demo Specialist", fromRole: "specialist", to: "learner", text: "Have fun today!", readBy: [] });
    startPortalSession(K); S.need = "explore"; home()`,
  "school admin": `PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-admin"); adminHome()`,
  "report preview": `PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-specialist"); reportScreen(portalLearner("demo-l1"), PORTAL.me, specialistHome)`,
  "i feel unsafe": `feelUnsafe("talk board")`
};

for (const [mode, setMode] of Object.entries(MODES)) {
  for (const [screen, show] of Object.entries(SCREENS)) {
    test(`${screen} in ${mode}`, async ({ page }) => {
      const errors = [];
      page.on("pageerror", e => errors.push(e.message));
      await page.goto("/index.html");
      await page.evaluate(`window.__SKIP_BATTERY__ = true; ${setMode} applySettings(); ${show};`);
      await page.waitForTimeout(100); // applyMyWay runs on the next tick

      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      const faults = results.violations.map(v => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map(n => n.target.join(" ")).join(", ")}`);
      expect(faults, "accessibility faults").toEqual([]);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, "sideways scrolling in px").toBeLessThanOrEqual(0);
      expect(errors, "script errors").toEqual([]);
    });
  }
}
