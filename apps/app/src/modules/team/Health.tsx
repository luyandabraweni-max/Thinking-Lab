import { canEditHealth, canSeeHealth, type Account, type Learner } from "@tl/data";
import { Button, Card, Notice } from "@tl/ui";
import { VoiceField, VoiceFormGuide, type VoiceFormField } from "@tl/voice/react";
import { useState } from "react";
import { useServices } from "../../platform";
import { useLoad } from "./use-load";

const FIELDS: (VoiceFormField & { hint?: string })[] = [
  { key: "name", label: "Medicine name", question: "What is the medicine called?", kind: "name", required: true },
  { key: "dose", label: "Dose", question: "How much is each dose? For example, ten milligrams, or two drops.", kind: "dose", required: true, hint: "As written on the label, for example 10 mg or 2 drops." },
  { key: "schedule", label: "When it's taken", question: "When is it taken? For example, mornings with breakfast.", kind: "text" },
  { key: "reason", label: "What it's for (optional)", question: "What is it for? You can say next to skip this.", kind: "text" }
];
const EMPTY = { name: "", dose: "", schedule: "", reason: "" };

/** Medicines and doses: entered by the family, shared with the team only with consent, never in reports. */
export function Health({ me, learner }: { me: Account; learner: Learner }) {
  const { store, syncNow } = useServices();
  const s = store.as(me), edit = canEditHealth(me, learner);
  const [data, reload, error] = useLoad(async () => canSeeHealth(me, learner)
    ? { meds: await s.medications(learner.id), doses: await s.doses(learner.id), log: await s.healthLog(learner.id) } : null, [store, me, learner]);
  const [form, setForm] = useState(EMPTY), [formError, setFormError] = useState(""), [saved, setSaved] = useState("");
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const after = (msg: string) => { setSaved(msg); reload(); void syncNow().catch(() => {}); };

  if (!canSeeHealth(me, learner)) return <Notice>Not shared. {learner.nickname}'s family hasn't shared health records with you.</Notice>;
  if (error) return <p className="tl-error">{error}</p>;
  const add = async (v: typeof EMPTY = form) => {
    try { await s.addMedication(learner.id, v); setForm(EMPTY); setFormError(""); after(`Saved ${v.name}.`); }
    catch (e) { setFormError((e as Error).message); }
  };
  const meds = data?.meds ?? [], current = meds.filter(m => !m.stoppedOn);
  return (
    <div className="tl-stack">
      <p className="tl-muted">{edit ? "Only you and the people you allow on the Sharing tab can see this. It's never included in reports." : "Shared by the family. You can read it, but only the family can change it."}</p>
      <p role="status" className="tl-muted">{saved}</p>
      <h2>Medicines now</h2>
      {current.length ? current.map(m => (
        <Card key={m.id} as="article">
          <h3>{m.name}</h3>
          <p>{m.dose}{m.schedule ? `, ${m.schedule}` : ""}</p>
          {m.reason ? <p className="tl-muted">{m.reason}</p> : null}
          <p className="tl-muted">Since {m.startedOn}. Last given: {data?.doses.find(d => d.medicationId === m.id)?.givenAt.slice(0, 16).replace("T", " ") ?? "not recorded"}</p>
          {edit ? <div className="tl-row">
            <Button small onClick={() => void s.recordDose(learner.id, m.id).then(() => after(`Recorded a dose of ${m.name}.`))}>Given now</Button>
            <Button small variant="quiet" onClick={() => void s.stopMedication(learner.id, m.id).then(() => after(`${m.name} marked as stopped.`))}>Stopped taking it</Button>
          </div> : null}
        </Card>)) : <p className="tl-muted">No medicines recorded.</p>}
      {edit ? <Card>
        <h2>Add a medicine</h2>
        <VoiceFormGuide fields={FIELDS} values={form} onChange={set} onSave={v => void add({ ...EMPTY, ...v })} />
        <form className="tl-stack" onSubmit={e => { e.preventDefault(); void add(); }}>
          {FIELDS.map(f => <VoiceField key={f.key} label={f.label} value={form[f.key as keyof typeof EMPTY]} onChange={v => set(f.key, v)} kind={f.kind} hint={f.hint} required={f.required} />)}
          {formError ? <p className="tl-error" role="alert">{formError}</p> : null}
          <div className="tl-row"><Button type="submit" variant="primary">Save medicine</Button></div>
        </form>
      </Card> : null}
      <h2>History</h2>
      {data?.log.length ? <ul>{data.log.map(e => <li key={e.id}>{e.at.slice(0, 10)}: {e.text} ({e.by})</li>)}</ul> : <p className="tl-muted">Nothing yet.</p>}
    </div>
  );
}
