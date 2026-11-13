import { ADAPT, RULES_FOR_REVIEW } from "@tl/adaptation";
import type { Account, RuleReview as Review } from "@tl/data";
import { Button, Card } from "@tl/ui";
import { useState } from "react";
import { useServices } from "../../platform";
import { useLoad } from "./use-load";

// Specialists review the adaptation rules (ported from ruleReview in js/portal/team.js). The rules were written
// before any specialist review; these reviews decide how they change. Colleagues in the same organisation see each other's.
const VERDICTS: Record<Review["verdict"], string> = { agree: "Agree as it is", change: "Needs a change", unsure: "Not sure yet" };

export function RuleReview({ me, onBack }: { me: Account; onBack: () => void }) {
  const { store, syncNow } = useServices(), s = store.as(me);
  const [reviews, reload] = useLoad(() => s.ruleReviews(), [store, me]);
  const [said, setSaid] = useState("");
  if (!reviews) return <Card><p>Loading…</p></Card>;
  const download = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ exported: new Date().toISOString(), thresholds: ADAPT, reviews }, null, 2)], { type: "application/json" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `ThinkingLab-rule-reviews-${new Date().toISOString().slice(0, 10)}.json` });
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 5000);
  };
  return (
    <Card>
      <p className="tl-eyebrow">For specialists</p>
      <h1>Review the adaptation rules</h1>
      <p className="lead">These rules decide how the platform adapts to each learner. They were written before any specialist review. Please say whether each one is right, and what you would change.</p>
      <p role="status" className="tl-muted">{said}</p>
      {RULES_FOR_REVIEW.map(([k, name, text]) => <OneRule key={k} rule={k} name={name} text={text} mine={reviews.find(r => r.rule === k && r.by === me.id)} others={reviews.filter(r => r.rule === k && r.by !== me.id)}
        onSave={async (v, c) => { await s.reviewRule(k, v, c); setSaid(`Review of "${name}" saved. Thank you.`); reload(); void syncNow().catch(() => {}); }} />)}
      <div className="tl-row"><Button onClick={download}><span aria-hidden="true">⬇️</span>Download all reviews</Button><Button variant="quiet" onClick={onBack}>Back to my learners</Button></div>
      <p className="note">Your reviews go to the 2to.iQ team, who revise the rules from them. Colleagues in your organisation see them too.</p>
    </Card>
  );
}

function OneRule({ rule, name, text, mine, others, onSave }: { rule: string; name: string; text: string; mine?: Review; others: Review[]; onSave: (v: Review["verdict"], c: string) => Promise<void> }) {
  const [verdict, setVerdict] = useState<Review["verdict"] | "">(mine?.verdict ?? ""), [comment, setComment] = useState(mine?.comment ?? ""), [error, setError] = useState("");
  return (
    <section className="obs-item rule-rev" aria-labelledby={`rr-${rule}`}>
      <h2 id={`rr-${rule}`}>{name}</h2><p>{text}</p>
      <fieldset><legend>Your view</legend>{(Object.keys(VERDICTS) as Review["verdict"][]).map(v =>
        <label key={v} className="consent"><input type="radio" name={`rv-${rule}`} checked={verdict === v} onChange={() => setVerdict(v)} /><span>{VERDICTS[v]}</span></label>)}</fieldset>
      <div className="tl-field"><label htmlFor={`rc-${rule}`}>What would you change, and why? (optional)</label>
        <textarea id={`rc-${rule}`} rows={2} maxLength={800} value={comment} onChange={e => setComment(e.target.value)} /></div>
      {error ? <p className="tl-error" role="alert">{error}</p> : null}
      <div className="tl-row"><Button small variant="primary" onClick={() => { if (!verdict) return setError("Choose your view first."); setError(""); void onSave(verdict, comment); }}>Save my review of {name}</Button></div>
      {others.length ? <details><summary>{others.length} other review{others.length > 1 ? "s" : ""}</summary><ul className="plain">{others.map(r =>
        <li key={r.id}><b>{r.byName}</b>{r.profession ? ` (${r.profession})` : ""}: {VERDICTS[r.verdict]}{r.comment ? `. "${r.comment}"` : ""}</li>)}</ul></details> : null}
    </section>
  );
}
