import { CURRICULA, CURRICULUM_NAME } from "@tl/content";
import type { Account, Learner } from "@tl/data";
import { useServices } from "../../platform";
import { useLoad } from "./use-load";

type Maths = "maths" | "lit" | "";
const MATHS: [Maths, string][] = [["", "Not chosen yet (show both)"], ["maths", "Mathematics"], ["lit", "Mathematical Literacy"]];
const MATHS_NAME: Record<Maths, string> = { "": "not chosen", maths: "Mathematics", lit: "Mathematical Literacy" };

/** The learner's curriculum and, from Grade 10, their maths subject. Their lessons follow both. */
export function School({ me, learner, onChanged }: { me: Account; learner: Learner; onChanged?: () => void }) {
  const { store, syncNow } = useServices();
  const s = store.as(me);
  const [settings, reload] = useLoad(() => s.settings(learner.id), [store, me, learner.id]);
  if (!settings) return null;
  const change = (patch: Parameters<typeof s.changeSettings>[1], log: string) =>
    void s.changeSettings(learner.id, patch, log).then(() => { reload(); onChanged?.(); void syncNow().catch(() => {}); });
  const curriculum = settings.curriculum ?? learner.curriculum;
  const known = (CURRICULA as readonly string[]).includes(curriculum) ? curriculum : "Other";
  return (
    <div className="tl-row">
      <div className="tl-field">
        <label htmlFor="schoolCurr">Curriculum</label>
        <select id="schoolCurr" value={known} onChange={e => change({ curriculum: e.target.value }, `Curriculum: ${CURRICULUM_NAME[e.target.value]}`)}>
          {CURRICULA.map(c => <option key={c} value={c}>{CURRICULUM_NAME[c]}</option>)}
        </select>
      </div>
      {learner.cohort === "teen" && known !== "Cambridge" ? <div className="tl-field">
        <label htmlFor="mathsAt">Maths at school (Grades 10 to 12)</label>
        <select id="mathsAt" value={settings.mathsSubject ?? ""} onChange={e => change({ mathsSubject: (e.target.value as Maths) || null }, `Maths at school: ${MATHS_NAME[e.target.value as Maths]}`)}>
          {MATHS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
        </select>
      </div> : null}
    </div>);
}
/** The curriculum to show for a learner: the one chosen later, or the one they were added with. */
export const curriculumOf = (learner: Learner, chosen?: string | null) => CURRICULUM_NAME[chosen ?? learner.curriculum] ?? chosen ?? learner.curriculum;
