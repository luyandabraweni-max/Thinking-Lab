import type { Account, Learner, ProfilePart, ProfilePlanRow, ProfileRating, SchoolProfile } from "@tl/data";
import { Button, Card, Notice, TabPanel, Tabs } from "@tl/ui";
import { useEffect, useState } from "react";
import { useServices } from "../../platform";
import * as B from "./bank";
import * as R from "./rules";

// The School Neurodevelopmental Learner Profile (Pholoso Afrika Foundation, v2.0), kept by the learner's teachers and
// specialists. It records what the school sees and turns it into prompts, a support map and a plan. It is not a
// diagnostic tool, not a screening test, and it produces no diagnosis or total score.

type Save = <K extends ProfilePart>(part: K, patch: SchoolProfile[K]) => Promise<void>;
const TABS = [
  { id: "about", label: "Profile" }, { id: "guide", label: "Phase guide" }, { id: "voice", label: "Their words" }, { id: "obs", label: "Observations" },
  { id: "alerts", label: "Concerns" }, { id: "map", label: "Support map" }, { id: "plan", label: "Plan" }, { id: "progress", label: "Term reviews" }
];
const today = () => new Date().toISOString().slice(0, 10);

export function SchoolProfileView({ me, learner }: { me: Account; learner: Learner }) {
  const { store, syncNow } = useServices(), s = store.as(me);
  const [p, setP] = useState<SchoolProfile>(), [error, setError] = useState(""), [tab, setTab] = useState("about");
  const [concerns, setConcerns] = useState(0);
  useEffect(() => {
    let live = true;
    s.schoolProfile(learner.id).then(x => { if (live) setP(x); }, (e: Error) => { if (live) setError(e.message); });
    s.concernsOnDevice(learner.id).then(c => { if (live) setConcerns(c.length); }, () => {});
    return () => { live = false; };
  }, [store, me, learner.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const save: Save = async (part, patch) => {
    setP(await s.updateProfile(learner.id, part, patch));
    void syncNow().catch(() => {});
  };

  if (!learner.consent.support) return <Notice tone="warn">{learner.nickname}'s family hasn't agreed to support needs being recorded, so there is no school profile. They can turn on <b>Record support needs</b> in Sharing.</Notice>;
  if (error) return <p className="tl-error">{error}</p>;
  if (!p) return <p>Loading…</p>;
  const phase = R.phaseOf(p, learner.level), items = R.itemsFor(phase);

  return (
    <div className="tl-stack">
      <p className="note pf-noprint">For the school. It records what staff observe, rates how much each thing limits access to learning, and raises a prompt when something needs action. It is <b>not</b> a diagnostic tool or a screening test, and it gives no diagnosis or score. Under SIAS a learner does not need a diagnosis to receive support. Only {learner.nickname}'s teachers and specialists see it.</p>
      <Tabs label="School profile sections" tabs={TABS} current={tab} onChange={setTab} />
      <TabPanel id={tab}>
        {tab === "about" ? <About p={p} learner={learner} phase={phase} save={save} />
          : tab === "guide" ? <Guide phase={phase} />
          : tab === "voice" ? <Voice p={p} save={save} />
          : tab === "obs" ? <Observations p={p} phase={phase} save={save} />
          : tab === "alerts" ? <Concerns p={p} learner={learner} phase={phase} concerns={concerns} />
          : tab === "map" ? <SupportMap p={p} learner={learner} items={items} save={save} onPlan={() => setTab("plan")} />
          : tab === "plan" ? <Plan p={p} items={items} save={save} />
          : <Progress p={p} items={items} me={me} save={save} />}
      </TabPanel>
    </div>
  );
}

// ---------- Questions ----------
/** One question. Text saves when the person leaves the box; lists and dates save as soon as they change. */
function Ask({ id, q, why, list, kind, value, onSave }: { id: string; q: string; why?: string; list?: string[]; kind?: B.Question["kind"]; value: string; onSave: (v: string) => void }) {
  const [v, setV] = useState(value), [was, setWas] = useState(value);
  if (value !== was) { setWas(value); setV(value); } // saved elsewhere (another teacher, a sync): show the newer value
  const blur = () => { if (v !== value) onSave(v); };
  return (
    <div className="tl-field">
      <label htmlFor={id}>{q}</label>
      {why ? <span className="tl-hint" id={`${id}-why`}>{why}</span> : null}
      {list ? <select id={id} value={v} aria-describedby={why ? `${id}-why` : undefined} onChange={e => { setV(e.target.value); onSave(e.target.value); }}>
        <option value="">Not answered</option>{list.map(o => <option key={o}>{o}</option>)}</select>
        : kind === "long" ? <textarea id={id} value={v} onChange={e => setV(e.target.value)} onBlur={blur} aria-describedby={why ? `${id}-why` : undefined} />
        : <input id={id} type={kind === "date" ? "date" : kind === "number" ? "number" : "text"} min={kind === "number" ? 0 : undefined} value={v}
            onChange={e => { setV(e.target.value); if (kind === "date") onSave(e.target.value); }} onBlur={kind === "date" ? undefined : blur} aria-describedby={why ? `${id}-why` : undefined} />}
    </div>
  );
}

function About({ p, learner, phase, save }: { p: SchoolProfile; learner: Learner; phase: B.Phase | null; save: Save }) {
  const rate = R.attendanceRate(p);
  return (
    <div className="tl-stack">
      <Notice>Fill this in first. The phase decides which observations apply{phase ? <>: for {learner.nickname} it is <b>{B.PHASE_NAME[phase]}</b>{p.answers.phase ? "" : `, worked out from ${learner.level}`}</> : <>. Choose it below: it couldn't be worked out from "{learner.level}"</>}. Record only what the school needs in order to teach this learner. Record observable facts, not opinions about a family, and never a diagnosis the school has inferred.</Notice>
      {B.CONTEXT.map(sec => (
        <details key={sec.title} className="pf-group" open={sec.title === "Who this learner is"}>
          <summary>{sec.title}</summary>
          <div className="tl-stack">
            {sec.note ? <p className="note">{sec.note}</p> : null}
            <div className="pf-grid">{sec.questions.map(q => <Ask key={q.key} id={`pf-${q.key}`} q={q.q} why={q.why} list={q.list} kind={q.kind} value={p.answers[q.key] ?? (q.key === "grade" ? learner.level : "")} onSave={v => void save("answers", { [q.key]: v })} />)}</div>
            {sec.title === "Attendance" ? <p className="tl-muted">Attendance rate: <b>{rate === null ? "not worked out yet" : `${rate}%`}</b>{rate !== null && rate < 90 ? " (below 90 per cent)" : ""}</p> : null}
          </div>
        </details>))}
      <p className="note">Health conditions, allergies and medicines are in the <b>Health</b> section, entered by the family and shown to the team only with their consent.</p>
    </div>
  );
}

// ---------- Page 02 ----------
function Guide({ phase }: { phase: B.Phase | null }) {
  const show = phase ? B.PHASES.slice(B.PHASES.indexOf(phase), B.PHASES.indexOf(phase) + 2) : [];
  return (
    <div className="tl-stack">
      <p>The same learner meets a different set of demands in each phase. Most new difficulties are not new difficulties: they are the same profile meeting a demand that did not exist before. Read the column for this learner's phase, and the one to its right.</p>
      {show.length ? <div className="pf-grid">{show.map(ph => (
        <Card key={ph} as="article"><h2>{B.PHASE_NAME[ph]}{ph === phase ? " (this learner)" : " (next)"}</h2>
          <dl>{B.GUIDE_ROWS.map(([row, cells]) => <div key={row}><dt><b>{row}</b></dt><dd style={{ margin: "0 0 10px" }}>{cells[ph]}</dd></div>)}</dl></Card>))}</div>
        : <Notice tone="warn">Choose the school phase in Profile to see this learner's column.</Notice>}
      <h2>The transition years carry the most risk</h2>
      <p>Grade R, Grade 1, Grade 4, Grade 7 and Grade 10 are the years in which support most often falls away without anyone deciding that it should. The adult who held the picture changes, and the new adult inherits a file rather than a relationship.</p>
      <h2>Reading the same learner across phases</h2>
      <ul>{B.ACROSS_PHASES.map(t => <li key={t}>{t}</li>)}</ul>
      <details className="pf-group"><summary>All five phases side by side</summary>
        <div className="pf-scroll"><table className="pf-table"><thead><tr><th scope="col">Phase</th>{B.PHASES.map(ph => <th key={ph} scope="col">{B.PHASE_NAME[ph]}</th>)}</tr></thead>
          <tbody>{B.GUIDE_ROWS.map(([row, cells]) => <tr key={row}><th scope="row">{row}</th>{B.PHASES.map(ph => <td key={ph}>{cells[ph]}</td>)}</tr>)}</tbody></table></div>
      </details>
    </div>
  );
}

// ---------- Page 03 ----------
function Voice({ p, save }: { p: SchoolProfile; save: Save }) {
  const groups = [...new Set(B.VOICE.map(v => v.group))];
  return (
    <div className="tl-stack">
      <Notice>This page is for the learner. An adult may read the questions aloud, scribe the answers, or use pictures, signs or a device. <b>The words must stay the learner's own.</b> For a very young child, record what was observed during play instead, and say so. A learner may decline any question, and that is itself information.</Notice>
      <div className="pf-grid">
        <Ask id="pf-vhow" q="How this page was completed" list={B.VOICEHOW} value={p.voice.how ?? ""} onSave={v => void save("voice", { how: v })} />
        <Ask id="pf-vwho" q="Date, and who supported the learner" value={p.voice.who ?? ""} onSave={v => void save("voice", { who: v })} />
      </div>
      {groups.map(g => (
        <section key={g} className="tl-stack"><h2>{g}</h2>
          <div className="pf-grid">{B.VOICE.filter(v => v.group === g).map(v => (
            <Ask key={v.key} id={`pf-${v.key}`} q={v.q} why={v.when} list={v.choice} kind={v.choice ? undefined : "long"} value={p.voice[v.key] ?? ""} onSave={x => void save("voice", { [v.key]: x })} />))}</div>
        </section>))}
      <Notice tone="warn">If a learner tells you something that worries you: stay calm and listen, don't ask leading questions, and don't promise to keep it secret. Any answer other than No to "Is anyone unkind to me?" is followed up the same day. A teacher who concludes on reasonable grounds that a child has been abused or deliberately neglected must report it (Children's Act, section 110, Form 22), and that duty doesn't wait for this profile.</Notice>
    </div>
  );
}

// ---------- Page 04 and the phase page ----------
function Observations({ p, phase, save }: { p: SchoolProfile; phase: B.Phase | null; save: Save }) {
  const pages: [string, string, B.Item[]][] = [["Core observations, every phase", "What does not change between a four year old and a Grade 12 learner.", B.CORE]];
  if (phase) pages.push([`${B.PHASE_NAME[phase]} observations`, B.PHASE_INTRO[phase], B.PHASE_ITEMS[phase]]);
  const c = R.counts(p, R.itemsFor(phase));
  return (
    <div className="tl-stack">
      <Notice>Go down the list. Rate the impact first. Where there is no barrier, choose <b>No barrier observed</b> and move on. Evidence is what makes this defensible, so write a real example with a date wherever you rate something moderate or higher. A blank is not a zero.</Notice>
      <p role="status"><b>{c.critical}</b> critical · <b>{c.watch}</b> watch · <b>{c.ok}</b> OK · <b>{c.blank}</b> not yet rated · {c.share}% rated</p>
      {!phase ? <Notice tone="warn">Choose the school phase in Profile to add the observations for this learner's phase.</Notice> : null}
      {pages.map(([title, intro, its]) => (
        <section key={title} className="tl-stack"><h2>{title}</h2><p className="tl-muted">{intro}</p>
          {R.domainsOf(its).map(d => {
            const dom = its.filter(i => i.domain === d), dc = R.counts(p, dom);
            return (
              <details key={d} className="pf-group"><summary>{d} · {dc.total - dc.blank} of {dc.total} rated{dc.critical ? ` · ${dc.critical} critical` : ""}{dc.watch ? ` · ${dc.watch} watch` : ""}</summary>
                <div className="tl-stack">{dom.map(it => <ItemEditor key={it.id} item={it} r={p.ratings[it.id]} onSave={r => void save("ratings", { [it.id]: r })} />)}</div>
              </details>);
          })}
        </section>))}
    </div>
  );
}

function Flag({ f }: { f: R.Flag }) { return <span className={`pf-flag pf-${f}`}>{R.FLAG_NAME[f]}</span>; }

function ItemEditor({ item, r, onSave }: { item: B.Item; r: ProfileRating | undefined; onSave: (r: ProfileRating) => void }) {
  const cur: ProfileRating = r ?? {}, f = R.flagOf(r), id = `pf-${item.id}`, n = item.id.slice(1);
  const [ev, setEv] = useState(cur.evidence ?? ""), [was, setWas] = useState(cur.evidence ?? "");
  if ((cur.evidence ?? "") !== was) { setWas(cur.evidence ?? ""); setEv(cur.evidence ?? ""); }
  const set = (patch: ProfileRating) => onSave({ impact: cur.impact ?? null, often: cur.often ?? "", support: cur.support ?? null, source: cur.source ?? "", evidence: ev, ...patch });
  const sel = (key: string, label: string, opts: [string, string][], value: string, onChange: (v: string) => void) => (
    <div className="tl-field"><label htmlFor={`${id}-${key}`}>{label}</label>
      <select id={`${id}-${key}`} value={value} onChange={e => onChange(e.target.value)}><option value="">Not rated</option>{opts.map(([l, v]) => <option key={v} value={v}>{l}</option>)}</select></div>);
  return (
    <div className={`pf-item pf-${f}`} role="group" aria-labelledby={`${id}-q`}>
      <div className="tl-row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}><b id={`${id}-q`}>{n}. {item.text}</b><Flag f={f} /></div>
      <div className="pf-grid">
        {sel("impact", "Impact on access and participation", B.IMPACT.map(([l, v]) => [l, String(v)]), cur.impact === null || cur.impact === undefined ? "" : String(cur.impact), v => set({ impact: v === "" ? null : Number(v) }))}
        {sel("often", "How often?", B.FREQUENCY.map(x => [x, x]), cur.often ?? "", v => set({ often: v }))}
        {sel("support", "Support needed right now", B.SUPPORT_NOW.map(([l, v]) => [l, String(v)]), cur.support === null || cur.support === undefined ? "" : String(cur.support), v => set({ support: v === "" ? null : Number(v) }))}
        {sel("source", "Where this comes from", B.EVIDENCE_SRC.map(x => [x, x]), cur.source ?? "", v => set({ source: v }))}
      </div>
      <div className="tl-field"><label htmlFor={`${id}-ev`}>Evidence: example, date, setting</label>
        <textarea id={`${id}-ev`} value={ev} onChange={e => setEv(e.target.value)} onBlur={() => { if (ev !== (cur.evidence ?? "")) set({ evidence: ev }); }} style={{ minHeight: 64 }} /></div>
      {r?.by ? <span className="note">Last rated by {r.by}{r.at ? `, ${new Date(r.at).toLocaleDateString("en-ZA")}` : ""}</span> : null}
    </div>
  );
}

// ---------- Page 10 ----------
function Concerns({ p, learner, phase, concerns }: { p: SchoolProfile; learner: Learner; phase: B.Phase | null; concerns: number }) {
  const items = R.itemsFor(phase), c = R.counts(p, items), al = R.alerts(p, phase, learner.level), rate = R.attendanceRate(p);
  const stage = p.answers.siasStage, rows = R.byDomain(p, items);
  return (
    <div className="tl-stack">
      <p>This page fills in on its own. It is the page the support team reads first. <b>Every line is a prompt to check something, not a conclusion.</b></p>
      {concerns ? <div className="safety-alert" role="alert"><h2><span aria-hidden="true">🛟</span> {learner.nickname} said they feel unsafe in the app ({concerns} time{concerns > 1 ? "s" : ""})</h2><p>Follow your organisation's child protection policy and tell its designated safeguarding lead today.</p></div> : null}
      <div className="pf-scroll"><table className="pf-table"><tbody>
        <tr><th scope="row">Learner</th><td>{learner.nickname}, {learner.level}{phase ? `, ${B.PHASE_NAME[phase]}` : ""}</td></tr>
        <tr><th scope="row">SIAS stage</th><td>{stage || "Not entered"}</td></tr>
        <tr><th scope="row">Support level</th><td>{p.answers.supportLevel || "Not entered"}</td></tr>
        <tr><th scope="row">Individual Support Plan in place</th><td>{p.answers.isp || "Not entered"}</td></tr>
        <tr><th scope="row">Attendance rate</th><td>{rate === null ? "Not entered" : `${rate}%`}</td></tr>
        <tr><th scope="row">Observations</th><td><b>{c.critical}</b> critical, <b>{c.watch}</b> watch, <b>{c.ok}</b> OK, <b>{c.blank}</b> not yet rated ({c.share}% rated). A profile with many blanks cannot carry a placement decision.</td></tr>
      </tbody></table></div>
      <h2>Alerts</h2>
      <p className="tl-muted">Each line tests one rule against what was entered. ACTION NEEDED means a person must do something, not that a conclusion has been reached.</p>
      <div className="tl-stack">{al.map(a => (
        <div key={a.key} className={`pf-item ${a.status === "action" ? "pf-critical" : a.status === "clear" ? "pf-ok" : ""}`}>
          <div className="tl-row" style={{ justifyContent: "space-between" }}><b>{a.check}</b><span className={`pf-flag ${a.status === "action" ? "pf-critical" : a.status === "clear" ? "pf-ok" : ""}`}>{R.ALERT_STATUS[a.status]}</span></div>
          <span>{a.seeing}</span>{a.status !== "clear" ? <span className="tl-muted">{a.todo}</span> : null}
        </div>))}</div>
      <h2>Where the concerns sit</h2>
      <div className="pf-scroll"><table className="pf-table"><thead><tr><th scope="col">Domain</th><th scope="col">Critical</th><th scope="col">Watch</th><th scope="col">OK</th><th scope="col">Not yet rated</th><th scope="col">Highest impact</th></tr></thead>
        <tbody>{rows.map(r => <tr key={r.domain}><th scope="row">{r.domain}</th><td>{r.critical}</td><td>{r.watch}</td><td>{r.ok}</td><td>{r.blank}</td><td>{r.highest ?? ""}</td></tr>)}</tbody></table></div>
      <p className="note">Highest impact: 0 no barrier, 1 slight, 2 moderate, 3 significant, 4 severe. A domain with nothing rated has not been observed yet, which is different from no concern.</p>
      <h2>The escalation ladder</h2>
      <p className="tl-muted">SIAS allocates support by level of need, not by diagnosis. Each step must be documented before the next one is used. Current stage: <b>{stage || "not entered"}</b>.</p>
      <div className="pf-scroll"><table className="pf-table"><thead><tr><th scope="col">Step</th><th scope="col">What must already be in place</th><th scope="col">Form</th><th scope="col">Who owns it</th></tr></thead>
        <tbody>{B.LADDER.map(([step, need, form, who], i) => <tr key={step}><th scope="row">{i + 1}. {step}</th><td>{need}</td><td>{form}</td><td>{who}</td></tr>)}</tbody></table></div>
      <h2>Safeguarding: what a teacher must do</h2>
      <ul>
        <li>Section 110 of the Children's Act 38 of 2005 names teachers among the professionals who must report.</li>
        <li>The threshold is a conclusion on reasonable grounds that a child has been abused in a way causing physical injury, sexually abused, or deliberately neglected. Reasonable grounds is lower than proof. It is not the teacher's job to establish what happened.</li>
        <li>The report is made on Form 22 to a designated child protection organisation, the provincial Department of Social Development, or a police official.</li>
        <li>Do not investigate, do not question the child repeatedly, and do not promise confidentiality you cannot keep.</li>
        <li>Record what was seen or heard, in the child's own words where possible, with the date, time and place, on the day it happened.</li>
        <li>Report first and complete this profile afterwards. Tell the school's designated safeguarding lead. Where the concern involves a staff member, follow the route that does not go through that person.</li>
      </ul>
      <h2>Attendance: the two points at which the school must act</h2>
      <ul>
        <li>Three consecutive school days of unexplained absence: the class teacher reports it to the principal, who must contact the parent and, where necessary, bring in social development support.</li>
        <li>Ten consecutive school days of absence without a valid reason: the learner's record may be cancelled in the class register. Act well before this point.</li>
        <li>Where absence is driven by anxiety or by something happening at school, attendance is a symptom. Treat the cause, and put a phased return in writing with a date to review it.</li>
      </ul>
    </div>
  );
}

// ---------- Page 11 ----------
function SupportMap({ p, learner, items, save, onPlan }: { p: SchoolProfile; learner: Learner; items: B.Item[]; save: Save; onPlan: () => void }) {
  const a = p.answers, v = p.voice, list = R.barriers(p, items);
  const summary: [string, string | undefined][] = [
    ["Learner", `${learner.nickname}, ${learner.level}`], ["What this learner is good at", a.goodAt], ["What they enjoy", a.enjoys], ["What already works", a.works],
    ["What does not work", a.notWork], ["How they communicate", a.commsMode], ["Adult they respond to best", a.bestAdult], ["What helps when it gets too much", v.v20],
    ["What they ask adults to stop doing", v.v23], ["The learner's own priority", v.v25], ["What they want the team to know", v.v31],
    ["Emergency plan", a.emergencyPlan ? `${a.emergencyPlan}${a.planKept ? `, kept: ${a.planKept}` : ""}` : undefined], ["Help in an evacuation", a.evacuation ? `${a.evacuation}${a.evacuationStaff ? `: ${a.evacuationStaff}` : ""}` : undefined]
  ];
  const addToPlan = async (b: R.Barrier) => {
    const id = crypto.randomUUID();
    const row: ProfilePlanRow = { domain: b.item.domain, barrier: [b.item.text, b.rating.evidence].filter(Boolean).join(" Evidence: "), strength: a.goodAt ?? "", action: b.strategies[0] ? `${b.strategies[0].title}. ${b.strategies[0].how}` : "",
      who: "", often: "", start: today(), baseline: "", review: "", happened: "", learnerSays: "", decision: "", next: "", at: new Date().toISOString() };
    await save("plan", { [id]: row });
    onPlan();
  };
  return (
    <div className="tl-stack">
      <div className="tl-row pf-noprint"><Button onClick={() => window.print()}><span aria-hidden="true">🖨️</span>Print the one page summary</Button></div>
      <h2>One page summary: share this with every teacher who sees {learner.nickname}</h2>
      <div className="pf-scroll"><table className="pf-table"><tbody>{summary.map(([k, val]) => <tr key={k}><th scope="row">{k}</th><td>{val?.trim() || "Not entered"}</td></tr>)}</tbody></table></div>
      <p className="note">Health conditions and allergies: see the family's health records. Emergency contacts: held by the family and the school office.</p>
      <h2>Barriers, highest impact first</h2>
      <p className="tl-muted">Ordered by impact on access, then by how much adult support is needed. The order reflects what was recorded, not clinical priority: the team decides what to act on first. Strategies are suggestions from the catalogue, matched by domain. Check them against what has already been tried.</p>
      {list.length ? list.map((b, i) => (
        <div key={b.item.id} className={`pf-item pf-${R.flagOf(b.rating)}`}>
          <div className="tl-row" style={{ justifyContent: "space-between" }}><b>{i + 1}. {b.item.domain}</b><Flag f={R.flagOf(b.rating)} /></div>
          <span>{b.item.text}</span>
          <span className="tl-muted">Impact: {B.IMPACT.find(x => x[1] === b.rating.impact)?.[0] ?? "not rated"} · Support now: {B.SUPPORT_NOW.find(x => x[1] === b.rating.support)?.[0] ?? "not rated"}{b.rating.evidence ? ` · ${b.rating.evidence}` : ""}</span>
          {b.strategies.length ? <ol>{b.strategies.map(st => <li key={st.n}><b>{st.title}</b> ({st.cost.toLowerCase()}). {st.how}</li>)}</ol> : <span className="note">No strategies in the catalogue for this domain.</span>}
          <div className="tl-row pf-noprint"><Button small onClick={() => void addToPlan(b)}>Add to the plan</Button></div>
        </div>)) : <p className="tl-muted">No barriers rated moderate or higher yet. They appear here as observations are rated.</p>}
      <details className="pf-group pf-noprint"><summary>The whole strategies catalogue ({B.STRATEGIES.length})</summary>
        <p className="note">Most of what works costs nothing. Start with the no cost strategies before asking for a device or a facilitator.</p>
        {[...new Set(B.STRATEGIES.map(x => x.domain))].map(d => <div key={d}><h3>{d}</h3><ul>{B.STRATEGIES.filter(x => x.domain === d).map(x => <li key={x.n}><b>{x.title}</b> ({x.cost.toLowerCase()}). {x.how}</li>)}</ul></div>)}
      </details>
    </div>
  );
}

// ---------- Page 12 ----------
const PLAN_FIELDS: [keyof ProfilePlanRow, string, ("date" | "long" | "list")?, string[]?][] = [
  ["domain", "Domain or priority"], ["barrier", "Barrier, stated specifically", "long"], ["strength", "Strength to build on", "long"], ["action", "What will be done", "long"],
  ["who", "Who does it"], ["often", "How often", "list", B.REVIEW_FREQ], ["start", "Start date", "date"], ["baseline", "Baseline before support", "long"], ["review", "Review date", "date"],
  ["happened", "What happened, with evidence", "long"], ["learnerSays", "What the learner says about it", "long"], ["decision", "Decision", "list", B.DECISION], ["next", "Next action and owner", "long"]
];
function Plan({ p, items, save }: { p: SchoolProfile; items: B.Item[]; save: Save }) {
  const rows = Object.entries(p.plan).filter(([, r]) => !r.removed).sort(([, a], [, b]) => a.at.localeCompare(b.at)), sum = R.planSummary(p);
  const blank = (): ProfilePlanRow => ({ domain: "", barrier: "", strength: "", action: "", who: "", often: "", start: today(), baseline: "", review: "", happened: "", learnerSays: "", decision: "", next: "", at: new Date().toISOString() });
  return (
    <div className="tl-stack">
      <p>Take the top barriers from the support map, state each one specifically, and record what was done and what happened. This is the evidence that SNA 2, DBE 120 and any later concession application rest on, so write it as though a district official will read it, because one may.</p>
      <Notice tone="warn">A plan without a named owner and a date is not a plan. A support that was never applied consistently has not been tried, and recording it as tried and failed will cost the learner later.</Notice>
      <p role="status">{sum.actions} actions · {sum.overdue} reviews overdue with no decision · {sum.helped} supports that helped · {sum.changed} being changed or stopped · {sum.escalated} escalations</p>
      {rows.map(([id, r], i) => {
        const late = R.isOverdue(r);
        return (
          <div key={id} className={`pf-item ${late ? "pf-watch" : ""}`}>
            <div className="tl-row" style={{ justifyContent: "space-between" }}><b>{i + 1}. {r.domain || "New action"}</b>{late ? <span className="pf-flag pf-watch">Review overdue</span> : null}</div>
            <div className="pf-grid">{PLAN_FIELDS.map(([k, label, kind, list]) => (
              <Ask key={k} id={`pf-plan-${id}-${k}`} q={label} list={kind === "list" ? list : k === "domain" ? R.domainsOf(items) : undefined} kind={kind === "date" ? "date" : kind === "long" ? "long" : undefined}
                value={String(r[k] ?? "")} onSave={v => void save("plan", { [id]: { ...r, [k]: v } })} />))}</div>
            <div className="tl-row"><Button small variant="quiet" onClick={() => { if (window.confirm("Remove this action from the plan?")) void save("plan", { [id]: { ...r, removed: true } }); }}>Remove this action</Button></div>
          </div>);
      })}
      <div className="tl-row"><Button variant="primary" onClick={() => void save("plan", { [crypto.randomUUID()]: blank() })}>Add an action</Button></div>
    </div>
  );
}

// ---------- Page 15 ----------
const REVIEWS: [string, string][] = [["baseline", "Baseline"], ["t1", "Term 1"], ["t2", "Term 2"], ["t3", "Term 3"]];
function Progress({ p, items, me, save }: { p: SchoolProfile; items: B.Item[]; me: Account; save: Save }) {
  const now = R.domainAverages(p, items), domains = R.domainsOf(items);
  const latest = [...REVIEWS].reverse().find(([k]) => k !== "baseline" && p.reviews[k]);
  const take = (k: string, label: string) => {
    if (p.reviews[k] && !window.confirm(`Replace the saved ${label}?`)) return;
    void save("reviews", { [k]: { date: today(), by: me.name, avg: now } });
  };
  return (
    <div className="tl-stack">
      <p>The observations give a baseline. Re-rate the same observations at the end of each term, then save the term here, and the direction of travel becomes visible. Without this, a support plan can run for years without anyone knowing whether it works.</p>
      <div className="tl-row">{REVIEWS.map(([k, label]) => <Button key={k} small onClick={() => take(k, label)}>{p.reviews[k] ? `Update ${label}` : `Save ${label}`}</Button>)}</div>
      <p className="tl-muted">{REVIEWS.filter(([k]) => p.reviews[k]).map(([k, label]) => `${label}: ${p.reviews[k]!.date}, ${p.reviews[k]!.by}`).join(" · ") || "Nothing saved yet. Save the baseline once the observations are rated."}</p>
      <div className="pf-scroll"><table className="pf-table">
        <thead><tr><th scope="col">Domain</th><th scope="col">Now</th>{REVIEWS.map(([k, label]) => <th key={k} scope="col">{label}</th>)}<th scope="col">Change since baseline</th></tr></thead>
        <tbody>{domains.map(d => {
          const ch = R.change(p.reviews.baseline?.avg[d], latest ? p.reviews[latest[0]]!.avg[d] : undefined);
          return <tr key={d}><th scope="row">{d}</th><td>{now[d] ?? ""}</td>{REVIEWS.map(([k]) => <td key={k}>{p.reviews[k]?.avg[d] ?? ""}</td>)}
            <td className={ch ? `pf-${ch.tone}` : ""}>{ch ? `${ch.d > 0 ? "+" : ""}${ch.d}${ch.tone === "better" ? " (better)" : ch.tone === "worse" ? " (harder)" : ""}` : ""}</td></tr>;
        })}</tbody></table></div>
      <p className="note">Scale: 0 no barrier, 1 slight, 2 moderate, 3 significant, 4 severe. Not observed yet is left out of the average rather than counted as zero. A negative change means the reported barrier has come down. Half a point or more higher means something has got harder, and the team should say why.</p>
      <Ask id="pf-why" q="What changed, and what the team thinks caused it" why="Record the cause even when it sits outside the support plan, such as a change of teacher, a move, a bereavement or a medication change." kind="long" value={p.answers.progressWhy ?? ""} onSave={v => void save("answers", { progressWhy: v })} />
    </div>
  );
}
