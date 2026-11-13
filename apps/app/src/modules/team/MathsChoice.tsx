import type { Account, Learner } from "@tl/data";
import { useServices } from "../../platform";
import { useLoad } from "./use-load";

type Choice = "maths" | "lit" | "";
const CHOICES: [Choice, string][] = [["", "Not chosen yet (show both)"], ["maths", "Mathematics"], ["lit", "Mathematical Literacy"]];
const NAME: Record<Choice, string> = { "": "not chosen", maths: "Mathematics", lit: "Mathematical Literacy" };

/** From Grade 10, a learner takes Mathematics or Mathematical Literacy at school; their lessons follow this choice. */
export function MathsChoice({ me, learner }: { me: Account; learner: Learner }) {
  const { store, syncNow } = useServices();
  const s = store.as(me);
  const [settings, reload] = useLoad(() => s.settings(learner.id), [store, me, learner.id]);
  if (!settings) return null;
  const choose = (c: Choice) => void s.changeSettings(learner.id, { mathsSubject: c || null }, `Maths at school: ${NAME[c]}`)
    .then(() => { reload(); void syncNow().catch(() => {}); });
  return (
    <div className="tl-field">
      <label htmlFor="mathsAt">Maths at school (Grades 10 to 12)</label>
      <select id="mathsAt" value={settings.mathsSubject ?? ""} onChange={e => choose(e.target.value as Choice)}>
        {CHOICES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </select>
      <p className="tl-muted">{learner.nickname} sees lessons for this subject only, from Grade 10.</p>
    </div>);
}
