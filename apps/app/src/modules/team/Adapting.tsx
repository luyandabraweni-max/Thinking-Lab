import { ADAPT_NAMES, adaptList, fromAttempt, levelSuggestions, supportText, type Rule } from "@tl/adaptation";
import { AREAS, cohortFor, levelName, type Area } from "@tl/content";
import type { Account, Learner } from "@tl/data";
import { Button } from "@tl/ui";
import { useState } from "react";
import { useServices } from "../../platform";
import { levelFromName } from "../learning";
import { useLoad } from "./use-load";

// How the platform adapts for a learner (ported from js/core/adapt.js adaptPanelHtml and the specialist's supports tab):
// what is changing now and why, level suggestions to accept or set aside, switches for each rule, and every change made.
const RULES: Rule[] = ["sooner", "shorter", "breaks", "fewer"];
const day = (iso: string) => new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });

export function Adapting({ me, learner }: { me: Account; learner: Learner }) {
  const { store, syncNow } = useServices(), s = store.as(me), name = learner.nickname;
  const [data, reload] = useLoad(async () => ({ settings: await s.settings(learner.id), rows: (await s.attempts(learner.id)).map(fromAttempt) }), [store, me, learner.id]);
  const [said, setSaid] = useState("");
  if (!data) return <p>Loading…</p>;
  const { settings, rows } = data, level = levelFromName(learner.level) ?? undefined;
  const change = async (patch: Parameters<typeof s.changeSettings>[1], text: string, msg = text) => { await s.changeSettings(learner.id, patch, text); setSaid(msg); reload(); void syncNow().catch(() => {}); };
  const now = adaptList(rows, settings.adaptOff);
  const suggestions = levelSuggestions({ rows, cohort: cohortFor(learner.cohort), level, levels: settings.levels as Partial<Record<Area, number>>, decisions: settings.decisions });
  return (
    <div className="adapt tl-stack">
      <p role="status" className="tl-muted">{said}</p>
      <h2>How the platform adapts for {name}</h2>
      <p className="note">These rules respond to what {name} does in sessions, not to a label. They are provisional until specialists review them.</p>
      <label className="consent"><input type="checkbox" checked={settings.adaptAuto}
        onChange={e => void change({ adaptAuto: e.target.checked }, `Automatic changes turned ${e.target.checked ? "on" : "off"}`)} />
        <span>Adjust support for {name} automatically during sessions. {name} can always undo a change on the spot.</span></label>
      {!settings.adaptAuto ? <p className="tl-muted">Automatic changes are off.</p>
        : now.length ? <ul className="plain">{now.map(([t, why]) => <li key={t}><b>{t}</b>, because {name} {why}.</li>)}</ul>
        : <p className="tl-muted">No changes at the moment: the usual support is working.</p>}
      {settings.adaptAuto ? <details><summary>Switch single rules off</summary>
        {RULES.map(r => <label key={r} className="consent"><input type="checkbox" checked={!settings.adaptOff[r]}
          onChange={e => void change({ adaptOff: { ...settings.adaptOff, [r]: !e.target.checked } }, `${ADAPT_NAMES[r]}: ${e.target.checked ? "on" : "off"}`)} /><span>{ADAPT_NAMES[r]}</span></label>)}
      </details> : null}
      <h3>Suggested changes</h3>
      {suggestions.length ? suggestions.map(sg => (
        <div key={sg.key} className="obs-item"><b>{sg.text}</b><div className="note">{sg.why}</div>
          <div className="row">
            <Button small onClick={() => void change({ levels: { ...settings.levels, [sg.area]: sg.to }, decisions: { ...settings.decisions, [sg.key]: { d: "yes", at: Date.now() } } },
              `${AREAS[sg.area][0]} level set to ${levelName(sg.to)}`, `Done. ${name}'s ${AREAS[sg.area][0].toLowerCase()} lessons now use ${levelName(sg.to)}.`)}>Use this</Button>
            <Button small variant="quiet" onClick={() => void change({ decisions: { ...settings.decisions, [sg.key]: { d: "no", at: Date.now() } } }, `Set aside: ${sg.text}`, "Set aside for 2 weeks.")}>Not now</Button>
          </div></div>))
        : <p className="tl-muted">No level changes suggested. Suggestions appear once there is enough evidence from more than one day.</p>}
      {settings.log.length ? <details><summary>Changes made ({settings.log.length})</summary><ul className="plain">{[...settings.log].reverse().map((e, i) => <li key={i}>{day(e.date)}: {e.text} ({e.by})</li>)}</ul></details> : null}
      {rows.length ? <><h3>Support used recently</h3>
        <div className="tablewrap" tabIndex={0} role="region" aria-label="Support used recently"><table className="hist">
          <thead><tr><th scope="col">Day</th><th scope="col">Activity</th><th scope="col">Support used</th></tr></thead>
          <tbody>{rows.slice(-12).reverse().map((r, i) => <tr key={i}><td>{day(r[0])}</td><td>{r[1]}</td><td>{supportText(r)}</td></tr>)}</tbody></table></div></> : null}
    </div>
  );
}
