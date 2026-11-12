import { fromAttempt, type Row } from "@tl/adaptation";
import { CATALOGUE } from "@tl/content";
import { canSeeHealth, type Account, type Learner } from "@tl/data";
import { CHART_KINDS, domainMonths, DOMAINS, monthName, shortDate, timeline, weeklyCounts, weekTotal, type Week } from "@tl/reports";
import type { CSSProperties } from "react";
import { useServices } from "../../platform";
import { GAMES, type GameId } from "../thinking-lab";
import { useLoad } from "./use-load";

// How a learner is developing (ported from js/portal/charts.js and developmentHtml in js/portal/team.js):
// a weekly chart, the thinking domains month by month, and a timeline of everything the team did.
const domainOf = (id: string) => GAMES[id as GameId]?.domain ?? CATALOGUE.find(u => u.id === id)?.domain;

export function Progress({ me, learner }: { me: Account; learner: Learner }) {
  const { store } = useServices(), s = store.as(me), health = canSeeHealth(me, learner);
  const [data] = useLoad(async () => ({
    rows: (await s.attempts(learner.id)).map(fromAttempt).filter(r => domainOf(r[1])),
    goals: await s.goals(learner.id), obs: await s.observations(learner.id), notes: await s.notes(learner.id),
    settings: await s.settings(learner.id), health: health ? await s.healthLog(learner.id) : []
  }), [store, me, learner.id, health]);
  if (!data) return <p>Loading…</p>;
  const name = learner.nickname, dm = domainMonths(data.rows, domainOf, DOMAINS);
  const events = timeline({ rows: data.rows, goals: data.goals, observations: data.obs, changes: data.settings.log,
    notes: data.notes.map(n => ({ at: n.createdAt, by: n.authorName, body: n.body })), health: data.health });
  return (
    <div className="tl-stack">
      <h2>How {name} is developing</h2>
      <p className="note">Growth over time, from sessions, goals, notes and changes. It describes activities, not ability, and is not a diagnosis.</p>
      <h3>Activities each week</h3>
      <Chart name={name} rows={data.rows} />
      <h3>Thinking domains, month by month</h3>
      {dm.months.length ? <div className="tablewrap" tabIndex={0} role="region" aria-label="Thinking domains by month"><table className="hist dev">
        <thead><tr><th scope="col">Domain</th>{dm.months.map(m => <th key={m} scope="col">{monthName(m)}</th>)}</tr></thead>
        <tbody>{dm.cells.map(c => <tr key={c.domain}><th scope="row">{c.domain}</th>{c.months.map(x => x.total
          ? <td key={x.month}><span className="dev-bar" style={{ "--p": `${Math.round(x.alone / x.total * 100)}%` } as CSSProperties} aria-hidden="true" />{x.alone} of {x.total} on their own</td>
          : <td key={x.month} className="muted">–</td>)}</tr>)}</tbody></table></div> : <p className="tl-muted">No sessions yet.</p>}
      <h3>Timeline</h3>
      {events.length ? <ol className="timeline">{events.map((e, i) => <li key={i}><span className="tl-date">{shortDate(e.date)}</span><span className="em" aria-hidden="true">{e.icon}</span><span>{e.text}</span></li>)}</ol> : <p className="tl-muted">Nothing yet.</p>}
      {health ? <p className="note">Health entries (💊) show here because you may see {name}'s health records. They never appear in reports.</p> : null}
    </div>
  );
}

// Drawn as SVG. Each result has a pattern as well as a colour, so the chart reads in greyscale and for
// colour-blind viewers, and the same numbers are always available as a table.
function Chart({ name, rows }: { name: string; rows: Row[] }) {
  const weeks = weeklyCounts(rows);
  if (!weeks.length) return <p className="tl-muted">The chart appears after the first session.</p>;
  const W = 560, H = 220, left = 34, bottom = 30, top = 10, max = Math.max(...weeks.map(weekTotal), 1);
  const step = (W - left) / weeks.length, bw = Math.min(48, step * 0.6), y = (n: number) => H - bottom - n / max * (H - bottom - top);
  const ticks = [...new Set([0, Math.ceil(max / 2), max])];
  const all = Object.fromEntries(CHART_KINDS.map(([k]) => [k, weeks.reduce((n, w) => n + w[k], 0)])) as Record<keyof Omit<Week, "week">, number>;
  const summary = `${name}'s activities over the last ${weeks.length} week${weeks.length > 1 ? "s" : ""} with sessions: ${CHART_KINDS.filter(([k]) => all[k]).map(([k, t]) => `${all[k]} ${t.toLowerCase()}`).join(", ")}.`;
  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary} focusable="false">
        <defs>
          <pattern id="chp-support" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" className="ch-bg-support" /><line x1="0" y1="0" x2="0" y2="8" className="ch-line" /></pattern>
          <pattern id="chp-notyet" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" className="ch-bg-notyet" /><circle cx="4" cy="4" r="1.6" className="ch-dot" /></pattern>
          <pattern id="chp-open" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" className="ch-bg-open" /><line x1="0" y1="4" x2="8" y2="4" className="ch-line" /></pattern>
        </defs>
        {ticks.map(t => <g key={t}><line className="ch-grid" x1={left} x2={W} y1={y(t)} y2={y(t)} /><text className="ch-label" x={left - 8} y={y(t) + 4} textAnchor="end">{t}</text></g>)}
        {weeks.map((w, i) => {
          const x = left + i * step + (step - bw) / 2; let base = 0;
          return <g key={w.week}>{CHART_KINDS.map(([k]) => {
            if (!w[k]) return null;
            const y0 = y(base), y1 = y(base + w[k]); base += w[k];
            return <rect key={k} className={`ch-${k}`} x={x} y={y1} width={bw} height={y0 - y1} />;
          })}<text className="ch-label" x={x + bw / 2} y={H - 10} textAnchor="middle">{shortDate(w.week)}</text></g>;
        })}
      </svg>
      <figcaption>
        <ul className="ch-legend">{CHART_KINDS.map(([k, t]) => <li key={k}><svg width="16" height="16" aria-hidden="true" focusable="false"><rect className={`ch-${k}`} width="16" height="16" rx="3" /></svg>{t}</li>)}</ul>
        <p className="note">Activities each week, starting on Monday. Counting activities, not marks: "not yet" is part of learning.</p>
      </figcaption>
      <details className="ch-table"><summary>Show as a table</summary>
        <div className="tablewrap" tabIndex={0} role="region" aria-label="Activities each week"><table className="hist">
          <thead><tr><th scope="col">Week of</th>{CHART_KINDS.map(([k, t]) => <th key={k} scope="col">{t}</th>)}<th scope="col">Total</th></tr></thead>
          <tbody>{weeks.map(w => <tr key={w.week}><th scope="row">{shortDate(w.week)}</th>{CHART_KINDS.map(([k]) => <td key={k}>{w[k]}</td>)}<td>{weekTotal(w)}</td></tr>)}</tbody></table></div>
      </details>
    </figure>
  );
}
