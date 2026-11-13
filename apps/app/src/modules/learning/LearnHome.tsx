import { AREAS, CATALOGUE, DEFAULT_LEVEL, lessonsIn, levelName, type Area, type Cohort } from "@tl/content";
import type { Learner } from "@tl/data";
import { levelFromName } from "./logic";

const COHORT: Record<Learner["cohort"], Cohort> = { early: "3-6", child: "7-12", teen: "13-18", adult: "19-25" };

/** Lessons at the learner's level, grouped by learning area. Age only sets the starting level when none is set. */
export function LearnHome({ learner, levels = {}, mathsSubject, curriculum, onPick, onBack }: { learner: Learner; levels?: Partial<Record<string, number>>; mathsSubject?: "maths" | "lit" | null; curriculum?: string | null; onPick: (unitId: string) => void; onBack: () => void }) {
  const choice = { curriculum: curriculum ?? learner.curriculum, maths: mathsSubject };
  const level = levelFromName(learner.level) ?? DEFAULT_LEVEL[COHORT[learner.cohort]];
  // Each learning area can be at its own level (set by the adults, for example from a level suggestion).
  const levelOf = (a: Area) => levels[a] ?? level;
  const found = (a: Area) => lessonsIn(CATALOGUE, a, levelOf(a), choice);
  const unitsIn = (a: Area) => found(a).units;
  const areas = (Object.keys(AREAS) as Area[]).filter(a => unitsIn(a).length);
  return (
    <section className="card">
      <p className="eyebrow">Learn · {levelName(level)}</p>
      <h1>Choose a lesson</h1>
      {areas.length ? areas.map(a => (
        <div key={a} className="tl-stack">
          <h2>{AREAS[a][0]}{levelOf(a) !== level ? <span className="tl-muted"> · {levelName(levelOf(a))}</span> : null}</h2>
          {found(a).standIn ? <p className="tl-muted">{choice.curriculum} lessons for this are on their way. Until then, these are the CAPS lessons for the same grade.</p> : null}
          <div className="grid">{unitsIn(a).map(u =>
            <button key={u.id} className="tile" onClick={() => onPick(u.id)}><span className="tile-t">{u.title}</span><span className="muted">{u.topic}</span></button>)}</div>
        </div>)) : <p className="muted">No lessons at this level yet.</p>}
      <div className="row"><button className="btn quiet" onClick={onBack}>Back</button></div>
    </section>
  );
}
