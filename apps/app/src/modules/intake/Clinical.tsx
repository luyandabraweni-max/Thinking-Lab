import type { Account, IntakeValue, Learner, SupportProfile } from "@tl/data";
import { Button, Notice, TabPanel, Tabs } from "@tl/ui";
import { useEffect, useState } from "react";
import { useServices } from "../../platform";
import { domainAveragesFor, ratedCount } from "../school-profile";
import * as B from "./bank";
import { FAMILY_TABS, FamilyPage } from "./Family";
import * as R from "./rules";
import { Ask, RowsTable, Sections, SupportCard } from "./ui";

// The clinical team's side of the intake: the summary and triage page, which fills in on its own from what the family
// and the school entered, then the team's own pages. Only team members with health access see it. Nothing above the
// formulation is a finding; every line must be checked against the source page before it is used.

type Data = Record<string, IntakeValue>;
const TABS = [{ id: "summary", label: "Summary" }, { id: "family", label: "The family's answers" }, { id: "support", label: "How to support me" },
  { id: "pros", label: "Professional view" }, { id: "safety", label: "Safety review" }, { id: "formulation", label: "Formulation" }, { id: "reviews", label: "Reviews and goals" }];

export function ClinicalIntake({ me, learner, family, onChange }: { me: Account; learner: Learner; family: Data; onChange: () => void }) {
  const { store, syncNow } = useServices(), s = store.as(me);
  const [team, setTeam] = useState<Data>(), [extra, setExtra] = useState<{ meds: number | null; school: Record<string, number> | null; schoolRated: boolean | null }>({ meds: null, school: null, schoolRated: null });
  const [tab, setTab] = useState("summary"), [page, setPage] = useState("consent");
  useEffect(() => {
    let live = true;
    void (async () => {
      const t = await s.intakeTeam(learner.id);
      const meds = (await s.medications(learner.id).catch(() => null))?.filter(m => !m.stoppedOn).length ?? null;
      let school: Record<string, number> | null = null, schoolRated: boolean | null = null;
      if (await s.mayKeepProfile(learner.id)) { const p = await s.schoolProfile(learner.id); school = domainAveragesFor(p, learner.level); schoolRated = ratedCount(p, learner.level) > 0; }
      if (live) { setTeam(t.data); setExtra({ meds, school, schoolRated }); }
    })();
    return () => { live = false; };
  }, [store, me, learner.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const save = (patch: Data) => void s.updateIntakeTeam(learner.id, patch).then(t => { setTeam(t.data); onChange(); void syncNow().catch(() => {}); });
  if (!team) return <p>Loading…</p>;

  return (
    <div className="tl-stack">
      <p className="note pf-noprint">For the clinical team: {learner.nickname}'s team members with health access. The family's pages are read-only here. This is an information gathering pack: it is not a screening instrument, it has no norms and it produces no diagnostic score. Diagnosis needs qualified assessment with validated tools, direct observation and clinical judgement, and the conclusion belongs in a conversation with the family.</p>
      <Tabs label="Intake for the team" tabs={TABS} current={tab} onChange={setTab} />
      <TabPanel id={tab}>
        {tab === "summary" ? <Summary learner={learner} d={family} extra={extra} />
          : tab === "family" ? <div className="tl-stack">
              <div className="tl-field"><label htmlFor="in-page">Page</label><select id="in-page" value={page} onChange={e => setPage(e.target.value)}>{FAMILY_TABS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}</select></div>
              <FamilyPage tab={page} learner={learner} data={family} save={() => {}} readOnly me={me} />
            </div>
          : tab === "support" ? <><div className="tl-row pf-noprint"><Button onClick={() => window.print()}><span aria-hidden="true">🖨️</span>Print</Button></div><SupportCard data={R.supportSnapshot(family, learner.nickname)} title={`How to support ${learner.nickname}`} /><p className="note">Share it only where the family's consent allows. Check their sharing list (Consent, in the family's answers) before it leaves the team.</p></>
          : tab === "pros" ? <Professionals d={team} save={save} />
          : tab === "safety" ? <div className="tl-stack"><p>For the team to complete after reviewing the family's safety page.</p><Sections secs={[{ title: "Safety review", questions: B.SAFETY_REVIEW }]} data={team} save={save} /></div>
          : tab === "formulation" ? <div className="tl-stack"><Notice>Nothing in the summary is a finding. Everything written here is.</Notice><Sections secs={[{ title: "Clinical formulation", questions: B.FORMULATION }]} data={team} save={save} /></div>
          : <Reviews family={family} d={team} save={save} me={me} />}
      </TabPanel>
    </div>
  );
}

function Summary({ learner, d, extra }: { learner: Learner; d: Data; extra: { meds: number | null; school: Record<string, number> | null; schoolRated: boolean | null } }) {
  const t = (k: string) => R.text(d, k) || "Not entered";
  const flags = R.flags(d, extra.meds), top = R.topDaily(d), senses = R.topSenses(d), areas = R.areaAverages(d), compare = R.homeAndSchool(d, extra.school), prompts = R.prompts(d, extra.schoolRated);
  return (
    <div className="tl-stack">
      <p>This page fills in on its own from everything the family and the school entered. It is a reading aid, not an assessment result and not a score.</p>
      {R.immediateDanger(d) ? <div className="safety-alert" role="alert"><h2>The family reported an immediate safety concern</h2><p>Contact them today. Read the safety page.</p></div> : null}
      <h2>Identification</h2>
      <div className="pf-scroll"><table className="pf-table"><tbody>
        {([["Known as", learner.nickname], ["Age", t("a1")], ["School or setting, and grade", [R.text(d, "a13"), R.text(d, "a14")].filter(Boolean).join(", ") || "Not entered"],
          ["Preferred language for the assessment", t("a9")], ["Interpreter needed", t("a10")], ["Form completed by, and on", [R.text(d, "a24"), R.text(d, "a25")].filter(Boolean).join(", ") || "Not entered"],
          ["Consent to collect", t("c2")], ["Consent to share across the team", t("c3")], ["Consent to share with the school", t("c4")], ["Agreed by", t("sign1")]] as [string, string][]).map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}
      </tbody></table></div>
      {R.text(d, "a10") === "Yes" ? <p className="note">Book the interpreter before the first appointment, not on the day.</p> : null}
      <h2>Flags to read before the first appointment</h2>
      <p className="tl-muted">Each flag is drawn from one named answer. Confirm it with the family rather than acting on the answer alone.</p>
      <div className="tl-stack">{flags.map(f => <div key={f.label} className={`pf-item ${f.attention ? "pf-watch" : ""}`}><b>{f.label}</b><span>{f.value}</span><span className="tl-muted">{f.note}</span></div>)}</div>
      <h2>Prompts for the team to consider</h2>
      <p className="tl-muted">Generated by rule from the answers given. These are questions, not recommendations, and clinical judgement overrides every one of them.</p>
      {prompts.length ? <ul>{prompts.map(p => <li key={p}>{p}</li>)}</ul> : <p className="tl-muted">None.</p>}
      <h2>What is still missing</h2>
      <p className="tl-muted">Completion is not a measure of the family's effort. Blanks are often the most informative part of an intake.</p>
      <div className="pf-scroll"><table className="pf-table"><thead><tr><th scope="col">Page</th><th scope="col">Answered</th><th scope="col">Questions</th></tr></thead>
        <tbody>{R.completeness(d).map(([p, c]) => <tr key={p}><th scope="row">{p}</th><td>{c.answered}</td><td>{c.total}</td></tr>)}</tbody></table></div>
      <h2>What each person says matters most</h2>
      <div className="pf-scroll"><table className="pf-table"><tbody>
        {([["The family's three main concerns", "o10"], ["The three questions the family wants answered", "o16"], ["The person's own first priority", "w30"], ["What the person wants the team to know", "w33"],
          ["What other people get wrong about this person", "o5"], ["What has already been tried and failed", "r2"], ["Anything that previously made things worse", "r3"]] as [string, string][]).map(([k, key]) => <tr key={k}><th scope="row">{k}</th><td style={{ whiteSpace: "pre-wrap" }}>{t(key)}</td></tr>)}
      </tbody></table></div>
      <h2>Highest reported impact at home</h2>
      <p className="tl-muted">Ordered by the level the family chose, with their stated priorities lifted above items of the same level. This orders what was reported. It does not rank clinical significance.</p>
      {top.length ? <div className="pf-scroll"><table className="pf-table"><thead><tr>{["Rank", "Area", "What was reported", "Level", "How often", "Where", "In the family's words"].map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{top.map((i, n) => <tr key={i.n}><td>{n + 1}</td><td>{i.area}</td><td>{i.text}{i.top ? " (a family priority)" : ""}</td><td>{i.level}</td><td>{i.often}</td><td>{i.where}</td><td>{i.words}</td></tr>)}</tbody></table></div> : <p className="tl-muted">Nothing rated yet.</p>}
      <h2>Highest reported sensory impact</h2>
      {senses.length ? <div className="pf-scroll"><table className="pf-table"><thead><tr>{["Rank", "Sense or signal", "What the family notices", "Level", "Where", "What helps"].map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{senses.map((x, n) => <tr key={x.sense}><td>{n + 1}</td><td>{x.sense}</td><td>{x.pattern}</td><td>{x.level}</td><td>{x.where}</td><td>{x.helps}</td></tr>)}</tbody></table></div> : <p className="tl-muted">Nothing rated yet.</p>}
      <h2>Reported impact by area, at home</h2>
      <div className="pf-scroll"><table className="pf-table"><thead><tr>{["Area", "Items rated", "Rated significant or severe", "Average of rated items", "Highest rating"].map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{areas.map(a => <tr key={a.area}><th scope="row">{a.area}</th><td>{a.rated}</td><td>{a.significant}</td><td>{a.average ?? ""}</td><td>{a.highest ?? ""}</td></tr>)}</tbody></table></div>
      <p className="note">Scale: 0 no concern, 1 slight, 2 moderate, 3 significant, 4 severe. Not known is left out of the average rather than counted as zero.</p>
      <h2>Home and school compared</h2>
      <p className="tl-muted">A large difference is a finding in itself. It may mean the person holds difficulties in at school and releases them at home, that the demand differs, or that one setting has adjusted and the other has not. It does not mean anyone is wrong. School averages come from the school learner profile{extra.school ? "" : ", which you don't keep for this learner, or which has no ratings yet"}.</p>
      <div className="pf-scroll"><table className="pf-table"><thead><tr>{["Area at home", "Average at home", "Matching areas at school", "Average at school", "Difference", "What to do with it"].map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{compare.map(c => <tr key={c.area}><th scope="row">{c.area}</th><td>{c.home ?? ""}</td><td>{c.schoolDomains}</td><td>{c.school ?? ""}</td><td>{c.diff ?? ""}</td><td>{c.read}</td></tr>)}</tbody></table></div>
    </div>
  );
}

function Professionals({ d, save }: { d: Data; save: (p: Data) => void }) {
  const chosen = [1, 2, 3, 4].map(i => R.text(d, `prof${i}`)).filter(Boolean);
  const items = B.DISCIPLINE.filter(x => chosen.includes(x.prof));
  return (
    <div className="tl-stack">
      <p>Choose up to four professionals this assessment is being prepared for. The shared sections below were collected once for the whole team; each professional then adds their own focus areas in the session. The mapping shows likely relevance, not scope of practice: every practitioner works within their own scope, registration and local standards.</p>
      <div className="pf-grid">{[1, 2, 3, 4].map(i => <Ask key={i} id={`in-prof${i}`} q={`Professional ${i}`} list={B.PROFESSIONALS} value={R.text(d, `prof${i}`)} onSave={v => save({ [`prof${i}`]: v })} />)}</div>
      {!chosen.length ? <Notice>Nothing selected yet. Choose up to four professionals and their focus areas appear below.</Notice> : null}
      <details className="pf-group"><summary>Shared sections, collected once for the whole team ({B.SHARED.length})</summary>
        <div className="pf-scroll"><table className="pf-table"><thead><tr><th scope="col">ID</th><th scope="col">Covered on</th><th scope="col">Focus area</th><th scope="col">Question or focus</th></tr></thead>
          <tbody>{B.SHARED.map(([id, page, area, q]) => <tr key={id}><td>{id}</td><td>{page}</td><td>{area}</td><td>{q}</td></tr>)}</tbody></table></div>
      </details>
      {items.length ? <h2>Focus areas for the session</h2> : null}
      {items.map(x => (
        <div key={x.id} className="pf-item"><b>{x.id} · {x.prof} · {x.area}</b><span>{x.q}</span>
          <Ask id={`in-pv-${x.id}`} q="Clinician notes and findings" kind="long" value={R.text(d, `pv:${x.id}`)} onSave={v => save({ [`pv:${x.id}`]: v })} />
        </div>))}
    </div>
  );
}

const REVIEWS: [string, string][] = [["base", "Baseline"], ["r1", "Review 1"], ["r2", "Review 2"], ["r3", "Review 3"]];
function Reviews({ family, d, save, me }: { family: Data; d: Data; save: (p: Data) => void; me: Account }) {
  const rec = (k: string) => (typeof d[`rev:${k}`] === "object" ? d[`rev:${k}`] as Record<string, string> : null);
  const baseline = () => {
    if (rec("base") && !window.confirm("Replace the saved baseline?")) return;
    const avg = Object.fromEntries(R.areaAverages(family).filter(a => a.average !== null).map(a => [a.area, String(a.average)]));
    save({ "rev:base": { ...avg, date: new Date().toISOString().slice(0, 10), by: me.name } });
  };
  const latest = [...REVIEWS].reverse().find(([k]) => k !== "base" && rec(k));
  return (
    <div className="tl-stack">
      <p>The intake gives a baseline. Rate the same areas again at each review, using the same scale (0 no concern to 4 severe), and the direction of travel becomes visible.</p>
      <div className="tl-row"><Button small onClick={baseline}>{rec("base") ? "Update the baseline from the intake" : "Take the baseline from the intake"}</Button></div>
      <p className="tl-muted">{REVIEWS.filter(([k]) => rec(k)?.date).map(([k, l]) => `${l}: ${rec(k)!.date}${rec(k)!.by ? `, ${rec(k)!.by}` : ""}`).join(" · ") || "No baseline yet."}</p>
      <div className="pf-scroll"><table className="pf-table">
        <thead><tr><th scope="col">Area</th>{REVIEWS.map(([k, l]) => <th key={k} scope="col">{l}</th>)}<th scope="col">Change since baseline</th></tr></thead>
        <tbody>{B.DAILY_AREAS.map(area => {
          const b = Number(rec("base")?.[area]), l = latest ? Number(rec(latest[0])?.[area]) : NaN, ch = !isNaN(b) && !isNaN(l) && rec("base")?.[area] && rec(latest![0])?.[area] ? Math.round((l - b) * 100) / 100 : null;
          return <tr key={area}><th scope="row">{area}</th><td>{rec("base")?.[area] ?? ""}</td>
            {REVIEWS.slice(1).map(([k, l]) => <td key={k}><label className="tl-visually-hidden" htmlFor={`in-rev-${k}-${area}`}>{l}: {area}</label>
              <input id={`in-rev-${k}-${area}`} type="number" min={0} max={4} step={0.5} style={{ width: "5em" }} defaultValue={rec(k)?.[area] ?? ""}
                onBlur={e => { if (e.target.value !== (rec(k)?.[area] ?? "")) save({ [`rev:${k}`]: { ...(rec(k) ?? {}), [area]: e.target.value, date: new Date().toISOString().slice(0, 10), by: me.name } }); }} /></td>)}
            <td className={ch === null ? "" : ch < 0 ? "pf-better" : ch >= 0.5 ? "pf-worse" : ""}>{ch === null ? "" : `${ch > 0 ? "+" : ""}${ch}`}</td></tr>;
        })}</tbody></table></div>
      <p className="note">A negative change means the reported level has come down since the baseline. Record what the team thinks caused it, including anything outside the therapy: a new teacher, a move, a medicine, a holiday, a change at home.</p>
      <Ask id="in-rev-why" q="What changed, and what we think did it" kind="long" value={R.text(d, "revWhy")} onSave={v => save({ revWhy: v })} />
      <RowsTable table="goal" title="Goals and outcomes" cols={[["goal", "Goal, in the family's or person's own words"], ["whose", "Whose goal is it?"], ["know", "How we will know it is working"], ["owner", "Owner"], ["review", "Review date"], ["status", "Status"], ["notes", "Notes"]]} data={d} save={save} />
    </div>
  );
}

/** The intake tab: the family fills it in; the team with health access reads it and adds its own part; the rest of the team sees "How to support me" when the family shares it. */
export type IntakeRole = "family" | "clinical" | "support" | "none";
export const SupportOnly = ({ support, learner }: { support: SupportProfile | null; learner: Learner }) => support
  ? <div className="tl-stack"><p className="tl-muted">Shared by {support.by} on {new Date(support.at).toLocaleDateString("en-ZA")}.</p><SupportCard data={support.data} title={`How to support ${learner.nickname}`} /></div>
  : <p className="tl-muted">{learner.nickname}'s family hasn't shared "How to support me" with the team yet. The full intake is shown only to team members the family has given health access to, once they agree to share it.</p>;
