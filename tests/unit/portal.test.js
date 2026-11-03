import { describe, it, expect, beforeEach } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadApp } from "./load-app.js";

let app;
const layer = () => app.window.document.getElementById("layer").innerHTML;
// Generated files: swap in a Blob that keeps its parts, so the bytes can be read straight away.
const bytesOf = expr => {
  app.window.TextEncoder = TextEncoder;
  app.run(`window.Blob = class { constructor(p, o) { this.parts = p; this.type = (o || {}).type; } }`);
  return Buffer.concat(app.run(`(${expr}).parts`).map(p => Buffer.from(typeof p === "string" ? new TextEncoder().encode(p) : p)));
};
beforeEach(() => { app = loadApp(); });

describe("front door", () => {
  it("offers parents, specialists and a try-out session", () => {
    expect(app.main()).toContain("Parents and guardians");
    expect(app.main()).toContain("Specialists and teachers");
    expect(app.main()).toContain("Try it now");
  });
  it("still reaches the try-out setup", () => {
    app.run(`document.getElementById("wTry").click()`);
    expect(app.main()).toContain("Start a try-out session");
  });
});

describe("access", () => {
  it("parents see only their children; specialists only learners shared with them", () => {
    expect(app.run(`const p = PORTAL.accounts.find(a => a.id === "demo-parent"); [canSee(p, portalLearner("demo-l0")), canSee(p, portalLearner("demo-l2"))]`)).toEqual([true, false]);
    expect(app.run(`canSee(PORTAL.accounts.find(a => a.id === "demo-specialist"), portalLearner("demo-l2"))`)).toBe(true);
    expect(app.run(`canSee(null, portalLearner("demo-l0"))`)).toBe(false);
  });
  it("renders the parent and specialist screens", () => {
    app.run(`PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-parent"); parentHome()`);
    expect(app.main()).toContain("My children");
    for (const t of ["progress", "support", "sharing"]) { app.run(`parentChild("demo-l1", "${t}")`); expect(app.main()).toContain("Brave Meerkat"); }
    app.run(`PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-specialist"); specialistHome()`);
    expect(app.main()).toContain("My learners");
    for (const t of ["overview", "goals", "notes", "profile"]) { app.run(`specialistLearner("demo-l1", "${t}")`); expect(app.main()).toContain("Brave Meerkat"); }
  });
  it("a share code works once", () => {
    app.run(`const L = portalLearner("demo-l0"); L.specialists = []; L.shareCode = "ABC-234"; L.shareCodeExp = Date.now() + 1e6;
      PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-specialist"); specialistHome();
      document.getElementById("spCode").value = "abc234"; document.getElementById("spAdd").click();`);
    expect(app.run(`[portalLearner("demo-l0").specialists.includes("demo-specialist"), portalLearner("demo-l0").shareCode]`)).toEqual([true, null]);
  });
});

describe("registration", () => {
  it("shows every problem before moving on", () => {
    app.run(`registerStart("parent"); document.getElementById("rgNext").click()`);
    expect(app.main()).toContain("Enter your name.");
    expect(app.main()).toContain("Enter an email address");
  });
  it("needs the required consents", () => {
    app.run(`registerStart("parent");
      document.getElementById("rgName").value = "Test Parent"; document.getElementById("rgEmail").value = "t@example.org"; document.getElementById("rgNext").click();
      const code = document.querySelector(".demo-flag .code").textContent; document.getElementById("vcCode").value = code; document.getElementById("vcGo").click();
      document.getElementById("cgNext").click();`);
    expect(app.main()).toContain("This box needs to be ticked to continue.");
    expect(app.run(`PORTAL.accounts.some(a => a.email === "t@example.org")`)).toBe(false);
  });
});

describe("the learner's own character and settings", () => {
  it("start each session and are saved back", () => {
    app.run(`const L = portalLearner("demo-l0"); L.my = { grey: true, calm: true }; L.display = { textSize: 1.15 }; L.learnLevels = { maths: 2 };
      L.avatar = Object.assign(defaultAvatar(), { name: "Pip" }); startPortalSession(L);`);
    expect(app.run(`[S.my.grey, S.my.calm, S.textSize, S.avatar.name, S.levels.maths]`)).toEqual([true, true, 1.15, "Pip", 2]);
    app.run(`S.avatar.name = "Pip Two"; S.my.plain = true; syncPortalLearner()`);
    expect(app.run(`[portalLearner("demo-l0").avatar.name, portalLearner("demo-l0").my.plain]`)).toEqual(["Pip Two", true]);
  });
  it("demo data survives a reload, but sign-in does not", () => {
    app.run(`PORTAL.me = PORTAL.accounts[0]; PORTAL.learners.push({ id: "keep", nickname: "Kept", cohort: "3-6", rows: [], goals: [], notes: [], specialists: [], consent: {} });
      savePortal(); PORTAL.learners = PORTAL.learners.filter(L => L.id !== "keep"); PORTAL.me = null; loadPortal();`);
    expect(app.run(`[PORTAL.learners.some(L => L.id === "keep"), PORTAL.me, DEMO[0].rows === portalLearner("demo-l0").rows]`)).toEqual([true, null, true]);
  });
});

describe("safeguarding", () => {
  it("I feel unsafe shows helplines, alerts the adult and records a concern", () => {
    app.run(`S.portalLearner = "demo-l1"; feelUnsafe("talk board")`);
    expect(layer()).toContain("116");
    expect(app.run(`portalLearner("demo-l1").concerns.slice(-1)[0].status`)).toBe("open");
    expect(app.run(`concernsAdultHtml()`)).toContain("Safeguarding");
    expect(app.run(`[TALK.some(t => t[1] === UNSAFE), TELL.some(t => t[1] === UNSAFE)]`)).toEqual([true, true]);
  });
  it("only the safeguarding lead sees concerns, and never in reports", () => {
    app.run(`S.portalLearner = "demo-l1"; feelUnsafe("talk board"); PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-specialist"); specialistLearner("demo-l1", "overview")`);
    expect(app.main()).toContain("designated safeguarding lead");
    app.run(`PORTAL.me.consents.dsl = false; specialistLearner("demo-l1", "overview")`);
    expect(app.main()).not.toContain("designated safeguarding lead");
    expect(app.run(`JSON.stringify(buildReport(portalLearner("demo-l1"), "specialist", PORTAL.me, { support: true, history: true }))`)).not.toMatch(/unsafe/i);
  });
  it("sensitive lessons end with Who can help me", () => {
    expect(app.run(`safetyNote(UNITS.find(u => u.id === "gr-body"))`)).toContain("Who can help me?");
    expect(app.run(`safetyNote(UNITS.find(u => u.id === "m4-place"))`)).toBe("");
    expect(app.run(`SAFEGUARDING_UNITS.every(id => UNITS.some(u => u.id === id))`)).toBe(true);
  });
});

describe("reports", () => {
  it("build as PDF and Word for every learner", () => {
    const n = app.run(`PORTAL.learners.length`);
    for (let i = 0; i < n; i++) for (const k of ["family", "specialist"]) {
      const rep = `buildReport(PORTAL.learners[${i}], "${k}", PORTAL.accounts.find(a => a.id === "demo-specialist"), { support: true, history: true })`;
      const pdf = bytesOf(`reportToPdf(${rep})`).toString("latin1"), docx = bytesOf(`reportToDocx(${rep})`);
      expect(pdf.startsWith("%PDF-1.4") && pdf.trimEnd().endsWith("%%EOF")).toBe(true);
      expect(docx.subarray(0, 2).toString()).toBe("PK");
    }
  });
  it("include support needs only with consent", () => {
    const has = () => app.run(`JSON.stringify(buildReport(portalLearner("demo-l1"), "specialist", PORTAL.accounts[1], { support: true })).includes("Support needs")`);
    expect(has()).toBe(true);
    app.run(`portalLearner("demo-l1").consent.support = false`);
    expect(has()).toBe(false);
  });
  it("write samples for the file checks", () => {
    const dir = process.env.REPORT_DIR; if (!dir) return;
    mkdirSync(dir, { recursive: true });
    app.run(`portalLearner("demo-l1").notes.push({ date: "2026-11-01", by: "Dr Zoë (OT)", byId: "x", text: "Uses <talk board> & says \\"more\\" (100%) \\\\ 😀", shareFamily: true })`);
    const spec = `PORTAL.accounts.find(a => a.id === "demo-specialist")`, par = `PORTAL.accounts.find(a => a.id === "demo-parent")`;
    writeFileSync(join(dir, "sample-report.pdf"), bytesOf(`reportToPdf(buildReport(portalLearner("demo-l1"), "specialist", ${spec}, { support: true, history: true }))`));
    writeFileSync(join(dir, "sample-report.docx"), bytesOf(`reportToDocx(buildReport(portalLearner("demo-l1"), "specialist", ${spec}, { support: true, history: true }))`));
    writeFileSync(join(dir, "sample-family.pdf"), bytesOf(`reportToPdf(buildReport(portalLearner("demo-l1"), "family", ${par}, {}))`));
    writeFileSync(join(dir, "sample-family.docx"), bytesOf(`reportToDocx(buildReport(portalLearner("demo-l1"), "family", ${par}, {}))`));
  });
});

describe("progress chart", () => {
  it("counts every activity in Monday-to-Sunday weeks", () => {
    expect(app.run(`[weekStart("2026-11-01"), weekStart("2026-11-02")]`)).toEqual(["2026-10-26", "2026-11-02"]);
    expect(app.run(`const L = portalLearner("demo-l0"); weeklyCounts(L.rows).reduce((n, w) => n + weekTotal(w), 0) === L.rows.length`)).toBe(true);
  });
  it("is described for screen readers and has a table", () => {
    const html = app.run(`progressChart(portalLearner("demo-l0"))`);
    expect(html).toContain('role="img"');
    expect(html).toContain("Show as a table");
    expect(app.run(`progressChart({ nickname: "x", rows: [] })`)).toContain("after the first session");
  });
  it("shows on the parent and specialist pages", () => {
    app.run(`PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-parent"); parentChild("demo-l1", "progress")`);
    expect(app.main()).toContain("Activities each week");
    app.run(`PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-specialist"); specialistLearner("demo-l1", "overview")`);
    expect(app.main()).toContain("Activities each week");
  });
});

describe("school admin", () => {
  it("sees staff and totals, never a learner's records", () => {
    app.run(`PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-admin"); adminHome()`);
    expect(app.main()).toContain("Demo Therapist");
    expect(app.run(`PORTAL.learners.some(L => canSee(PORTAL.me, L))`)).toBe(false);
    for (const n of app.run(`PORTAL.learners.map(L => L.nickname)`)) expect(app.main()).not.toContain(n);
  });
  it("warns when nobody is the safeguarding lead, and can choose one", () => {
    app.run(`PORTAL.accounts.find(a => a.id === "demo-specialist").consents.dsl = false; PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-admin"); adminHome()`);
    expect(app.main()).toContain("No safeguarding lead");
    app.run(`const b = document.getElementById("dsl-demo-ot"); b.checked = true; b.dispatchEvent(new Event("change"))`);
    expect(app.run(`PORTAL.accounts.find(a => a.id === "demo-ot").consents.dsl`)).toBe(true);
  });
  it("removing staff ends access to school-held learners only", () => {
    app.run(`PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-admin"); adminHome();
      document.querySelector('[data-leave="demo-specialist"]').click(); document.getElementById("lvYes").click()`);
    expect(app.run(`[portalLearner("demo-l2").specialists.includes("demo-specialist"), portalLearner("demo-l0").specialists.includes("demo-specialist")]`)).toEqual([false, true]);
  });
});

describe("avatar and motion", () => {
  it("every avatar combination draws a balanced picture", () => {
    const bad = app.run(`const out = [];
      for (const base of ["person", "robot"]) for (const [hair] of AV.hair) for (const [eyes] of AV.eyes) for (const [mouth] of AV.mouth) for (const [extra] of AV.extra) {
        const s = avatarSvg(Object.assign(defaultAvatar(), { base, hair, eyes, mouth, extra }), 200, "", { full: true });
        if (!s.startsWith("<svg") || s.split("<g").length !== s.split("</g>").length) out.push(base + "/" + hair);
      } out`);
    expect(bad).toEqual([]);
  });
  it("names are cleaned and capped", () => {
    expect(app.run(`cleanAvatarName("<b>Zoë</b>!!")`)).toBe("bZoëb");
    expect(app.run(`cleanAvatarName("A".repeat(40)).length`)).toBe(16);
  });
  it("the avatar waves and says its name", () => {
    app.run(`S.avatar = Object.assign(defaultAvatar(), { name: "Nova" }); home(); avatarSayHello(document.querySelector(".hub-hello"), S.avatar)`);
    expect(app.window.document.querySelector(".av-bubble").textContent).toBe("Hi, I'm Nova!");
    expect(app.window.document.querySelector(".av3d").classList.contains("av-waving")).toBe(true);
  });
  it("motion is off for No movement, calm mode and low stimulation", () => {
    expect(app.run(`motionAllowed()`)).toBe(true);
    expect(app.run(`S.motion = true; motionAllowed()`)).toBe(false);
    expect(app.run(`S.motion = false; S.my.calm = true; motionAllowed()`)).toBe(false);
  });
});
