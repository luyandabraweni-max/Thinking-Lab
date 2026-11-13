import { AREAS, areaOf, CATALOGUE, DEFAULT_LEVEL, levelName, type Area, type Cohort } from "@tl/content";
import type { Learner } from "@tl/data";
import { levelFromName } from "./logic";

const COHORT: Record<Learner["cohort"], Cohort> = { early: "3-6", child: "7-12", teen: "13-18", adult: "19-25" };
/** From Grade 10, learners take either Mathematics or Mathematical Literacy. Until the adults choose, both show. */
const takes = (u: { subject: string; grade: number }, maths?: "maths" | "lit" | null) =>
  !maths || u.grade < 10 || u.grade > 12 || !(u.subject === "Mathematical Literacy" || u.subject === "Mathematics") || (u.subject === "Mathematical Literacy") === (maths === "lit");

/** Lessons at the learner's level, grouped by learning area. Age only sets the starting level when none is set. */
export function LearnHome({ learner, levels = {}, mathsSubject, onPick, onBack }: { learner: Learner; levels?: Partial<Record<string, number>>; mathsSubject?: "maths" | "lit" | null; onPick: (unitId: string) => void; onBack: () => void }) {
  const level = levelFromName(learner.level) ?? DEFAULT_LEVEL[COHORT[learner.cohort]];
  // Each learning area can be at its own level (set by the adults, for example from a level suggestion).
  const levelOf = (a: Area) => levels[a] ?? level;
  const unitsIn = (a: Area) => CATALOGUE.filter(u => areaOf(u.subject) === a && u.grade === levelOf(a) && takes(u, mathsSubject));
  const areas = (Object.keys(AREAS) as Area[]).filter(a => unitsIn(a).length);
  return (
    <section className="card">
      <p className="eyebrow">Learn · {levelName(level)}</p>
      <h1>Choose a lesson</h1>
      {areas.length ? areas.map(a => (
        <div key={a} className="tl-stack">
          <h2>{AREAS[a][0]}{levelOf(a) !== level ? <span className="tl-muted"> · {levelName(levelOf(a))}</span> : null}</h2>
          <div className="grid">{unitsIn(a).map(u =>
            <button key={u.id} className="tile" onClick={() => onPick(u.id)}><span className="tile-t">{u.title}</span><span className="muted">{u.topic}</span></button>)}</div>
        </div>)) : <p className="muted">No lessons at this level yet.</p>}
      <div className="row"><button className="btn quiet" onClick={onBack}>Back</button></div>
    </section>
  );
}
