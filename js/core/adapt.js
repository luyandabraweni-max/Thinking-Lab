"use strict";

// ---------- Adaptation layer ----------
// The platform responds to what the learner does, not to a label: it reads their earlier sessions and today's, then
// adjusts support. Every threshold below is PROVISIONAL until specialists review it (docs/adaptation-rules.md explains each rule).
// Ground rules: changes for the learner are gentle and they can undo them on the spot; a change of level is only ever
// suggested to an adult, who decides; adults can turn the automatic changes off for a learner.
const ADAPT = {
  window: 3,        // recent = the last 3 session days
  minQs: 6,         // no automatic change on fewer than 6 answered questions
  helpShare: 0.6,   // help used on 60% or more of recent questions: offer help sooner
  skips: 3,         // moved on without an answer 3 or more times recently: shorter lessons
  breakDays: 2,     // chose a break on 2 or more recent days: offer breaks every few questions
  breakEvery: 4,
  easierOf: 6, easierMin: 3, // chose "make it easier" on 3 of the last 6 questions in an area: start there with fewer choices
  quickMs: 3000, quickMin: 2, // 2 wrong answers given within 3 seconds in one session: a gentle "take your time"
  moreQs: 8, moreShare: 0.8, // 80% of the last 8 questions at a level shown without support: suggest the next level
  lessQs: 6, lessShare: 0.5, // half of the last 6 not yet shown or made easier: suggest the level below
  minDays: 2,       // level suggestions need evidence from 2 or more days
  snoozeDays: 14    // "Not now" hides a suggestion for 14 days
};
const ADAPT_NAMES = { sooner: "Help is offered sooner", shorter: "Shorter lessons (3 questions)", breaks: `A break is offered every ${ADAPT.breakEvery} questions`, fewer: "Questions start with 2 choices" };

// History rows: [date, activity, status, answer mode, hints, what the learner said, support flags (optional)].
// Flags: e = chose "make it easier", a = started with fewer choices, s = moved on without an answer, b = chose a break, q = quick wrong answers.
function rowFlags(it) {
  const f = {};
  if (it.easier && !it.autoEasier) f.e = 1; if (it.autoEasier) f.a = 1; if (it.movedOn) f.s = 1; if (it.adapt === "break") f.b = 1; if (it.quick) f.q = it.quick;
  return Object.keys(f).length ? f : null;
}
const todayIsoDate = () => new Date().toISOString().slice(0, 10);
function recRow(it, id, reflection, date) { const r = [date || todayIsoDate(), id, statusOf(it), it.mode || "tap", it.hints || 0, reflection || ""], f = rowFlags(it); if (f) r.push(f); return r; }
const sessionRows = () => S.obs.flatMap(o => o.items.map(it => recRow(it, o.id, o.reflection)));
const flagsOf = r => r[6] || {};
const unitById = id => UNITS.find(u => u.id === id);
const inArea = (r, a, grade) => { const u = unitById(r[1]); return !!u && areaOf(u.subject) === a && (grade == null || u.grade === grade); };
// Answered questions from the last n session days (open-ended ideas have no right answer, so they don't count)
function recentRows(rows, n) {
  const qs = rows.filter(r => r[2] !== "open"), days = [...new Set(qs.map(r => r[0]))].sort().slice(-n);
  return qs.filter(r => days.includes(r[0]));
}

// What the platform changes for the learner, each with the reason an adult will see.
function adaptFor(rows) {
  const recent = recentRows(rows, ADAPT.window), out = { fewer: {} };
  const helped = recent.filter(r => r[4] > 0 || flagsOf(r).e || flagsOf(r).s).length;
  if (recent.length >= ADAPT.minQs && helped / recent.length >= ADAPT.helpShare) out.sooner = `help was used on ${helped} of the last ${recent.length} questions`;
  const skips = recent.filter(r => flagsOf(r).s).length, breakDays = new Set(recent.filter(r => flagsOf(r).b).map(r => r[0])).size;
  if (skips >= ADAPT.skips) out.shorter = `moved on without an answer ${skips} times in recent sessions`;
  if (breakDays >= ADAPT.breakDays) out.breaks = `chose a break on ${breakDays} recent days`;
  Object.keys(AREAS).forEach(a => {
    const ar = rows.filter(r => r[2] !== "open" && inArea(r, a)).slice(-ADAPT.easierOf), n = ar.filter(r => flagsOf(r).e).length;
    if (n >= ADAPT.easierMin) out.fewer[a] = `chose "make it easier" on ${n} of the last ${ar.length} ${AREAS[a][0].toLowerCase()} questions`;
  });
  return out;
}
// During a session: earlier sessions, today's finished work and the lesson under way. Off when an adult turned it off.
function adaptLive(recs, id) {
  if (!S.adaptAuto) return { fewer: {} };
  const a = adaptFor((S.history || []).concat(sessionRows(), (recs || []).map(it => recRow(it, id)))), off = S.adaptOff || {};
  Object.keys(off).forEach(k => { if (off[k]) { if (k === "fewer") a.fewer = {}; else delete a[k]; } }); // rules an adult switched off for this learner
  return a;
}
const quickToday = recs => S.obs.reduce((n, o) => n + o.items.reduce((m, it) => m + (it.quick || 0), 0), 0) + (recs || []).reduce((n, it) => n + (it.quick || 0), 0);
function adaptList(L) {
  const a = adaptFor(L.rows), out = [], off = L.adaptOff || {};
  Object.keys(off).forEach(k => { if (off[k]) { if (k === "fewer") a.fewer = {}; else delete a[k]; } });
  ["sooner", "shorter", "breaks"].forEach(k => { if (a[k]) out.push([ADAPT_NAMES[k], a[k]]); });
  Object.entries(a.fewer).forEach(([ar, why]) => out.push([`${ADAPT_NAMES.fewer} in ${AREAS[ar][0].toLowerCase()}`, why]));
  return out;
}

// Suggestions for an adult: a change of level in one learning area, with its evidence. Never applied without them.
function levelSuggestions(L) {
  const out = [], dec = L.adaptDecisions || {};
  const nearest = (a, g, step) => { for (let i = ALL_LEVELS.indexOf(g) + step; i >= 0 && i < ALL_LEVELS.length; i += step) if (UNITS.some(u => u.grade === ALL_LEVELS[i] && areaOf(u.subject) === a)) return ALL_LEVELS[i]; return null; };
  Object.keys(AREAS).forEach(a => {
    const g = (L.learnLevels || {})[a] ?? L.learnGrade ?? DEFAULT_GRADE[L.cohort], name = AREAS[a][0].toLowerCase();
    const ar = L.rows.filter(r => r[2] !== "open" && inArea(r, a, g));
    if (new Set(ar.map(r => r[0])).size < ADAPT.minDays) return;
    const more = ar.slice(-ADAPT.moreQs), alone = more.filter(r => r[2] === "alone").length, up = nearest(a, g, 1);
    if (more.length >= ADAPT.moreQs && alone / more.length >= ADAPT.moreShare && up != null)
      out.push({ key: `up:${a}:${g}`, area: a, to: up, text: `Ready for more in ${name}: try ${gradeName(up)}`, why: `${alone} of the last ${more.length} ${name} questions at ${gradeName(g)} were answered without support, on different days.` });
    const less = ar.slice(-ADAPT.lessQs), hard = less.filter(r => r[2] === "notyet" || flagsOf(r).e).length, down = nearest(a, g, -1);
    if (less.length >= ADAPT.lessQs && hard / less.length >= ADAPT.lessShare && down != null)
      out.push({ key: `down:${a}:${g}`, area: a, to: down, text: `${AREAS[a][0]} may be too hard right now: try ${gradeName(down)}`, why: `On ${hard} of the last ${less.length} ${name} questions at ${gradeName(g)}, the answer wasn't shown yet or the learner asked for it to be made easier.` });
  });
  return out.filter(s => !dec[s.key] || (dec[s.key].d === "no" && Date.now() - dec[s.key].at > ADAPT.snoozeDays * 864e5));
}
function supportText(r) {
  const f = flagsOf(r);
  return [r[4] ? `${r[4]} hint${r[4] > 1 ? "s" : ""}` : "", f.e ? "made easier" : "", f.a ? "started with fewer choices" : "", f.s ? "moved on" : "", f.b ? "took a break" : "", f.q ? "answered very quickly" : ""].filter(Boolean).join(", ") || "None";
}

// The portal panel: what is changing for the learner now, level suggestions to accept or set aside, and what was changed.
function adaptPanelHtml(L) {
  const now = adaptList(L), sug = levelSuggestions(L), log = L.adaptLog || [], name = esc(L.nickname);
  return `<div class="adapt">
      <h2>How the platform adapts for ${name}</h2>
      <p class="note">These rules respond to what ${name} does in sessions, not to a label. They are provisional until specialists review them.</p>
      <label class="consent" for="adAuto"><input type="checkbox" id="adAuto"${L.adaptAuto !== false ? " checked" : ""}><span>Adjust support for ${name} automatically during sessions. ${name} can always undo a change on the spot.</span></label>
      ${L.adaptAuto === false ? `<p class="muted">Automatic changes are off.</p>` : now.length ? `<ul class="plain">${now.map(([t, why]) => `<li><b>${esc(t)}</b>, because ${name} ${esc(why)}.</li>`).join("")}</ul>` : `<p class="muted">No changes at the moment: the usual support is working.</p>`}
      <h3>Suggested changes</h3>
      ${sug.length ? sug.map(s => `<div class="obs-item"><b>${esc(s.text)}</b><div class="note">${esc(s.why)}</div>
          <div class="row"><button class="btn small" data-adyes="${esc(s.key)}">Use this</button><button class="btn small quiet" data-adno="${esc(s.key)}">Not now</button></div></div>`).join("")
        : `<p class="muted">No level changes suggested. Suggestions appear once there is enough evidence from more than one day.</p>`}
      ${log.length ? `<details><summary>Changes made (${log.length})</summary><ul class="plain">${log.slice().reverse().map(e => `<li>${niceDate(e.date)}: ${esc(e.text)} (${esc(e.by)})</li>`).join("")}</ul></details>` : ""}
    </div>`;
}
function wireAdaptPanel(L, redraw) {
  const by = () => (PORTAL.me || {}).name || "an adult";
  const auto = document.getElementById("adAuto");
  if (auto) auto.addEventListener("change", () => { L.adaptAuto = auto.checked; (L.adaptLog = L.adaptLog || []).push({ date: todayIsoDate(), text: `Automatic changes turned ${auto.checked ? "on" : "off"}`, by: by() }); savePortal(); redraw(); });
  const find = k => levelSuggestions(L).find(s => s.key === k), decide = (k, d) => { (L.adaptDecisions = L.adaptDecisions || {})[k] = { d, at: Date.now(), by: by() }; };
  on("[data-adyes]", e => { const s = find(e.currentTarget.dataset.adyes); if (!s) return; decide(s.key, "yes");
    L.learnLevels = Object.assign({}, L.learnLevels, { [s.area]: s.to });
    (L.adaptLog = L.adaptLog || []).push({ date: todayIsoDate(), text: `${AREAS[s.area][0]} level set to ${gradeName(s.to)}`, by: by() });
    savePortal(); redraw(); flash(`Done. ${L.nickname}'s ${AREAS[s.area][0].toLowerCase()} lessons now use ${gradeName(s.to)}.`); });
  on("[data-adno]", e => { decide(e.currentTarget.dataset.adno, "no"); savePortal(); redraw(); flash("Set aside for 2 weeks."); });
}
