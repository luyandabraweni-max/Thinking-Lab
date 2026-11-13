import { AREAS, CATALOGUE, COHORTS, cohortFor, DEFAULT_LEVEL, lessonsIn, levelName, type Area } from "@tl/content";
import type { Account, Learner, PlanStep } from "@tl/data";
import { Button } from "@tl/ui";
import { useState } from "react";
import { useServices } from "../../platform";
import { levelFromName } from "../learning";
import { PLAN_KINDS, PLAN_MAX } from "../learner";
import { GAME_LIST } from "../thinking-lab";
import { useLoad } from "./use-load";

// Plan the next session (ported from supportsHtml in js/portal/team.js). The learner sees the plan as "My plan today"
// when their next session starts, and can still choose something else.
const day = (iso: string) => new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });

export function NextSession({ me, learner }: { me: Account; learner: Learner }) {
  const { store, syncNow } = useServices(), s = store.as(me), name = learner.nickname;
  const [settings, reload] = useLoad(() => s.settings(learner.id), [store, me, learner.id]);
  const [pick, setPick] = useState(""), [said, setSaid] = useState("");
  if (!settings) return <p>Loading…</p>;
  const level = levelFromName(learner.level) ?? DEFAULT_LEVEL[cohortFor(learner.cohort)];
  const levelOf = (a: Area) => settings.levels[a] ?? level;
  const choice = { curriculum: settings.curriculum ?? learner.curriculum, maths: settings.mathsSubject };
  const units = (Object.keys(AREAS) as Area[]).flatMap(a => lessonsIn(CATALOGUE, a, levelOf(a), choice).units).slice(0, 60);
  const options: PlanStep[] = [...GAME_LIST.map(g => ({ key: `x:${g.id}`, pic: g.pic, label: g.name })), ...units.map(u => ({ key: `u:${u.id}`, pic: "📚", label: u.title })), ...PLAN_KINDS];
  const steps = settings.plan?.steps ?? [];
  const save = async (next: PlanStep[] | null, msg: string) => { await s.setPlan(learner.id, next); setSaid(msg); reload(); void syncNow().catch(() => {}); };
  const add = () => { const o = options.find(x => x.key === pick); if (o) void save([...steps, o], `Added: ${o.label}.`).then(() => setPick("")); };
  return (
    <div className="tl-stack">
      <h2>Plan the next session</h2>
      <p className="note">Up to {PLAN_MAX} steps. {name} sees it as "My plan today" at their next session, and can still choose something else.</p>
      <p role="status" className="tl-muted">{said}</p>
      {steps.length ? <>
        <ol className="plan-strip" aria-label={`${name}'s plan for next session`}>{steps.map((x, i) => <li key={i}><span className="em" aria-hidden="true">{x.pic}</span><span>{x.label}</span></li>)}</ol>
        <p className="note">Planned by {settings.plan!.by}, {day(settings.plan!.at)}.</p>
        <div className="tl-row"><Button small onClick={() => void save(steps.slice(0, -1), "Took the last step off.")}>Take the last step off</Button><Button small variant="quiet" onClick={() => void save(null, "Plan cleared.")}>Clear the plan</Button></div>
      </> : <p className="tl-muted">No plan set.{settings.lastPlan ? ` The last one was used on ${day(settings.lastPlan.used)}.` : ""}</p>}
      <div className="tl-field"><label htmlFor="npAdd">Add a step</label>
        <select id="npAdd" value={pick} onChange={e => setPick(e.target.value)}>
          <option value="">Choose…</option>
          <optgroup label="Thinking Lab">{GAME_LIST.map(g => <option key={g.id} value={`x:${g.id}`}>{g.name}</option>)}</optgroup>
          <optgroup label={`Lessons at ${name}'s levels`}>{units.map(u => <option key={u.id} value={`u:${u.id}`}>{u.subject}: {u.title} ({levelName(u.grade)})</option>)}</optgroup>
          <optgroup label="Other">{PLAN_KINDS.map(k => <option key={k.key} value={k.key}>{k.label}</option>)}</optgroup>
        </select></div>
      <div className="tl-row"><Button variant="primary" disabled={!pick || steps.length >= PLAN_MAX} onClick={add}>Add to the plan</Button></div>
      <p className="note">Lessons follow {name}'s level in each area ({COHORTS[cohortFor(learner.cohort)]}; {(Object.keys(AREAS) as Area[]).map(a => `${AREAS[a][0].toLowerCase()} ${levelName(levelOf(a))}`).join(", ")}).</p>
    </div>
  );
}
