import { AREAS, areaOf, CATALOGUE, DEFAULT_LEVEL, levelName, type Area, type Cohort } from "@tl/content";
import type { Learner } from "@tl/data";
import { levelFromName } from "./logic";

const COHORT: Record<Learner["cohort"], Cohort> = { early: "3-6", child: "7-12", teen: "13-18", adult: "19-25" };

/** Lessons at the learner's level, grouped by learning area. Age only sets the starting level when none is set. */
export function LearnHome({ learner, onPick, onBack }: { learner: Learner; onPick: (unitId: string) => void; onBack: () => void }) {
  const level = levelFromName(learner.level) ?? DEFAULT_LEVEL[COHORT[learner.cohort]];
  const units = CATALOGUE.filter(u => u.grade === level);
  const areas = (Object.keys(AREAS) as Area[]).filter(a => units.some(u => areaOf(u.subject) === a));
  return (
    <section className="card">
      <p className="eyebrow">Learn · {levelName(level)}</p>
      <h1>Choose a lesson</h1>
      {areas.length ? areas.map(a => (
        <div key={a} className="tl-stack">
          <h2>{AREAS[a][0]}</h2>
          <div className="grid">{units.filter(u => areaOf(u.subject) === a).map(u =>
            <button key={u.id} className="tile" onClick={() => onPick(u.id)}><span className="tile-t">{u.title}</span><span className="muted">{u.topic}</span></button>)}</div>
        </div>)) : <p className="muted">No lessons at this level yet.</p>}
      <div className="row"><button className="btn quiet" onClick={onBack}>Back</button></div>
    </section>
  );
}
