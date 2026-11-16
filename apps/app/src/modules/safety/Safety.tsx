import { useState } from "react";

// Child safeguarding (docs/system-design.md, section 13), ported from js/support/safety.js. A child can say they feel
// unsafe. The app answers kindly, points to a trusted adult and a free child helpline, and records a concern for the
// adult and the safeguarding lead. It never investigates, judges or reports on its own, and it does not tell the family automatically.
const HELPLINES = { ZA: ["Childline South Africa", "116", "Free from any phone, day or night."], EU: ["Child helpline", "116 111", "Free in every EU country."] } as const;
/** Lessons about body safety, bullying and relationships end with "Who can help me?" */
export const SAFEGUARDING_UNITS = ["ey-safe", "gr-body", "g1-homesafe", "g2-bully", "g3-feelings", "g3-safety", "l4-body", "l5-relationships", "l6-peer", "g8-decisions", "g11-relationships"];
export const UNSAFE = "I feel unsafe";

/** The learner's country decides the helpline. Unknown: both. */
export function Helplines({ country }: { country: "ZA" | "EU" | null }) {
  const lines = country === "ZA" ? [HELPLINES.ZA] : country ? [HELPLINES.EU] : [HELPLINES.ZA, HELPLINES.EU];
  return <ul className="helplines">{lines.map(([n, num, note]) => <li key={n}><span className="hl-name">{n}{lines.length > 1 && n !== HELPLINES.ZA[0] ? " (Europe)" : ""}</span><span className="hl-num">{num}</span><span className="note">{note}</span></li>)}</ul>;
}

/** The "I feel unsafe" response: thanks, a trusted adult, a helpline, and a card to show a grown-up. */
export function UnsafeDialog({ older, country, onClose }: { older: boolean; country: "ZA" | "EU" | null; onClose: () => void }) {
  const [show, setShow] = useState(false);
  const say = older ? "Thank you for telling us. You did the right thing. Please talk to an adult you trust, like a teacher, counsellor or family member."
    : "Thank you for telling us. You did the right thing, and you are not in trouble. Please tell a grown-up you trust, like a teacher or someone in your family.";
  if (show) return (
    <div className="card" style={{ textAlign: "center" }} role="alertdialog" aria-labelledby="sfShow">
      <p className="eyebrow">Show this to a grown-up you trust</p><h1 id="sfShow">I feel unsafe. I need to talk to someone.</h1>
      <div className="row" style={{ justifyContent: "center" }}><button className="btn primary" autoFocus onClick={onClose}>Done</button></div>
    </div>);
  return (
    <div className="card safety-card" role="alertdialog" aria-labelledby="sfTitle" aria-describedby="sfText">
      <span className="safety-ic" aria-hidden="true">🛟</span>
      <h2 id="sfTitle">Thank you for telling us</h2>
      <p id="sfText">{say}</p>
      <Helplines country={country} />
      <div className="row"><button className="btn primary" autoFocus onClick={() => setShow(true)}><span className="em" aria-hidden="true">🙋</span><span>Show a grown-up</span></button><button className="btn" onClick={onClose}>Close</button></div>
    </div>
  );
}

/** "Who can help me?" at the end of sensitive lessons. */
export function SafetyNote({ unitId, country, onUnsafe }: { unitId: string; country: "ZA" | "EU" | null; onUnsafe: () => void }) {
  if (!SAFEGUARDING_UNITS.includes(unitId)) return null;
  return (
    <div className="safety-note">
      <h2>Who can help me?</h2>
      <p>If anything ever makes you feel unsafe or worried, tell a grown-up you trust. You can keep telling until someone helps.</p>
      <Helplines country={country} />
      <div className="row"><button className="btn" onClick={onUnsafe}><span className="em" aria-hidden="true">🛟</span><span>{UNSAFE}</span></button></div>
    </div>
  );
}
