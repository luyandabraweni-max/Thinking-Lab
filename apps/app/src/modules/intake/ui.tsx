import type { IntakeValue } from "@tl/data";
import { Button } from "@tl/ui";
import { useState } from "react";
import type { Question, Section } from "./bank";

// Small building blocks shared by the family's pages and the team's pages.

/** One question. Text saves when the person leaves the box; lists and dates save as soon as they change. */
export function Ask({ id, q, why, list, kind, value, onSave, readOnly }: { id: string; q: string; why?: string; list?: string[]; kind?: Question["kind"]; value: string; onSave: (v: string) => void; readOnly?: boolean }) {
  const [v, setV] = useState(value), [was, setWas] = useState(value);
  if (value !== was) { setWas(value); setV(value); } // saved elsewhere or synced: show the newer value
  if (readOnly) return <div className="tl-field"><span><b>{q}</b></span><span style={{ whiteSpace: "pre-wrap" }}>{value || <span className="tl-muted">Not answered</span>}</span></div>;
  const blur = () => { if (v !== value) onSave(v); };
  const described = why ? `${id}-why` : undefined;
  return (
    <div className="tl-field">
      <label htmlFor={id}>{q}</label>
      {why ? <span className="tl-hint" id={`${id}-why`}>{why}</span> : null}
      {list ? <select id={id} value={v} aria-describedby={described} onChange={e => { setV(e.target.value); onSave(e.target.value); }}><option value="">Not answered</option>{list.map(o => <option key={o}>{o}</option>)}</select>
        : kind === "long" ? <textarea id={id} value={v} onChange={e => setV(e.target.value)} onBlur={blur} aria-describedby={described} />
        : <input id={id} type={kind === "date" ? "date" : "text"} value={v} aria-describedby={described}
            onChange={e => { setV(e.target.value); if (kind === "date") onSave(e.target.value); }} onBlur={kind === "date" ? undefined : blur} />}
    </div>
  );
}

const str = (d: Record<string, IntakeValue>, k: string) => (typeof d[k] === "string" ? (d[k] as string) : "");

/** A page of sections, as questions to answer or as answers to read. */
export function Sections({ secs, data, save, readOnly, idPrefix = "in" }: { secs: Section[]; data: Record<string, IntakeValue>; save: (patch: Record<string, IntakeValue>) => void; readOnly?: boolean; idPrefix?: string }) {
  return <>{secs.map(sec => (
    <section key={sec.title} className="tl-stack"><h2>{sec.title}</h2>
      {sec.note ? <p className="note">{sec.note}</p> : null}
      <div className="pf-grid">{sec.questions.map(q => <Ask key={q.key} id={`${idPrefix}-${q.key}`} q={q.q} why={readOnly ? undefined : q.why} list={q.list} kind={q.kind} value={str(data, q.key)} readOnly={readOnly} onSave={v => save({ [q.key]: v })} />)}</div>
    </section>))}</>;
}

/** A table the family adds rows to, such as previous professionals or allergies. */
export function RowsTable({ table, title, note, cols, data, save, readOnly }: { table: string; title: string; note?: string; cols: [string, string, string[]?][]; data: Record<string, IntakeValue>; save: (patch: Record<string, IntakeValue>) => void; readOnly?: boolean }) {
  const rows = Object.entries(data).filter(([k, v]) => k.startsWith(`${table}:`) && typeof v === "object" && !v.removed).sort(([, a], [, b]) => ((a as Record<string, string>).at ?? "").localeCompare((b as Record<string, string>).at ?? ""));
  return (
    <section className="tl-stack"><h2>{title}</h2>{note ? <p className="note">{note}</p> : null}
      {rows.length ? rows.map(([k, v], i) => {
        const r = v as Record<string, string>;
        return <div key={k} className="pf-item"><b>{i + 1}.</b>
          <div className="pf-grid">{cols.map(([c, label, list]) => <Ask key={c} id={`${k}-${c}`} q={label} list={list} value={r[c] ?? ""} readOnly={readOnly} onSave={x => save({ [k]: { ...r, [c]: x } })} />)}</div>
          {readOnly ? null : <div className="tl-row"><Button small variant="quiet" onClick={() => save({ [k]: { ...r, removed: "1" } })}>Remove this row</Button></div>}
        </div>;
      }) : <p className="tl-muted">None added.</p>}
      {readOnly ? null : <div className="tl-row"><Button small onClick={() => save({ [`${table}:${crypto.randomUUID()}`]: { at: new Date().toISOString() } })}>Add a row</Button></div>}
    </section>
  );
}

/** The one-page "How to support me", for printing or reading. */
export function SupportCard({ data, title }: { data: Record<string, string>; title: string }) {
  return (
    <div className="tl-stack">
      <h2>{title}</h2>
      <div className="pf-scroll"><table className="pf-table"><tbody>{Object.entries(data).map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td style={{ whiteSpace: "pre-wrap" }}>{v}</td></tr>)}</tbody></table></div>
      <p className="note">This page describes support needs. It is not a diagnosis and must not be used as one. It was built from what the family and the person said, so read it with them and correct it where it is wrong.</p>
    </div>
  );
}
