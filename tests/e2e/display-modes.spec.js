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
  "paint pots": "gamePaint({})",
  "colour and shape sort": `S.band = "older"; gameSort({})`,
  "my way": "openMyWay()",
  "support passport": "passportStart(); passportView()",
  "avatar builder": "avatarBuilder()",
  "registration": `registerStart("parent")`,
  "parent child": `PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-parent"); parentChild("demo-l1", "progress")`,
  "specialist learner": `PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-specialist"); specialistLearner("demo-l1", "goals")`,
  "specialist overview with chart": `PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-specialist"); specialistLearner("demo-l0", "overview"); document.querySelector(".ch-table").open = true`,
  "3D robot builder (drawing fallback)": `S.avatar = Object.assign(defaultAvatar(), { base: "robot3d", name: "Bolt" }); avatarBuilder()`,
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
