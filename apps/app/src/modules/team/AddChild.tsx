import { COHORT_LEVELS, COHORTS, cohortFor, DEFAULT_LEVEL, levelName } from "@tl/content";
import type { Account, Learner } from "@tl/data";
import { Button, Card, Field } from "@tl/ui";
import { useState } from "react";
import { useServices } from "../../platform";

// A parent or guardian adds their child (the server links them as guardian and records their consent).
// Children are known by a nickname: no real name, birthday or school is asked for.
const AGES: [Learner["cohort"], string][] = [["early", COHORTS["3-6"]], ["child", COHORTS["7-12"]], ["teen", COHORTS["13-18"]], ["adult", COHORTS["19-25"]]];
const CURRICULA = ["CAPS", "D-CAPS (differentiated)", "NCF (early years)", "Other or not sure"];

export function AddChild({ me, first, onAdded }: { me: Account; first: boolean; onAdded: () => void }) {
  const { registerLearner } = useServices();
  const [open, setOpen] = useState(first), [nickname, setNickname] = useState(""), [cohort, setCohort] = useState<Learner["cohort"]>("child");
  const [level, setLevel] = useState(DEFAULT_LEVEL[cohortFor("child")]), [curriculum, setCurriculum] = useState(CURRICULA[0]!);
  const [agree, setAgree] = useState(false), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  if (!open) return <div className="tl-row"><Button onClick={() => setOpen(true)}><span aria-hidden="true">➕</span>Add a child</Button></div>;
  const pickAge = (c: Learner["cohort"]) => { setCohort(c); setLevel(DEFAULT_LEVEL[cohortFor(c)]); setCurriculum(c === "early" ? CURRICULA[2]! : CURRICULA[0]!); };
  const save = async () => {
    if (!nickname.trim()) return setError("Please give your child a nickname.");
    if (!agree) return setError("Please tick the box to agree, so we can keep your child's learning records.");
    setBusy(true); setError("");
    try {
      await registerLearner(me, { nickname: nickname.trim(), cohort, curriculum: curriculum.replace(/ \(.*\)$/, ""), level: levelName(level) });
      setNickname(""); setAgree(false); setOpen(false); onAdded();
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };
  return (
    <Card as="section">
      <h2>Add a child</h2>
      <form className="tl-stack" onSubmit={e => { e.preventDefault(); void save(); }}>
        <Field label="Nickname" value={nickname} onChange={setNickname} hint="A made-up name like Brave Meerkat keeps your child private. They can use their first name if you prefer." error={error && !nickname.trim() ? error : ""} />
        <div className="tl-field"><label htmlFor="acAge">Age</label>
          <select id="acAge" value={cohort} onChange={e => pickAge(e.target.value as Learner["cohort"])}>{AGES.map(([k, t]) => <option key={k} value={k}>{t}</option>)}</select></div>
        <div className="tl-field"><label htmlFor="acLevel">Level to start at</label>
          <select id="acLevel" value={level} onChange={e => setLevel(Number(e.target.value))}>{COHORT_LEVELS[cohortFor(cohort)].map(g => <option key={g} value={g}>{levelName(g)}</option>)}</select>
          <p className="tl-muted">You, or your child's teachers, can change this later. Lessons also suggest moving up or down.</p></div>
        <div className="tl-field"><label htmlFor="acCurr">Curriculum</label>
          <select id="acCurr" value={curriculum} onChange={e => setCurriculum(e.target.value)}>{CURRICULA.map(c => <option key={c}>{c}</option>)}</select></div>
        <label className="consent"><input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
          <span>I am this child's parent or guardian, and I agree to Thinking Lab keeping their learning records. Only I can see them until I choose to share them with a teacher or therapist.</span></label>
        {error && nickname.trim() ? <p className="tl-error" role="alert">{error}</p> : null}
        <div className="tl-row"><Button type="submit" variant="primary" disabled={busy}>{busy ? "Adding…" : "Add child"}</Button>{first ? null : <Button variant="quiet" onClick={() => setOpen(false)}>Cancel</Button>}</div>
      </form>
    </Card>
  );
}
