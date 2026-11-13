import type { Account, IntakeValue, Learner, SupportProfile } from "@tl/data";
import { Button, Notice, TabPanel, Tabs } from "@tl/ui";
import { useState } from "react";
import { useServices } from "../../platform";
import * as B from "./bank";
import * as R from "./rules";
import { Ask, RowsTable, Sections, SupportCard } from "./ui";

// The family's side of the intake: the pages the family and the person being assessed fill in, once, so they don't
// have to repeat their story to every professional. Also used read-only by the team (readOnly).

type Save = (patch: Record<string, IntakeValue>) => void;
export const FAMILY_TABS = [
  { id: "consent", label: "Consent" }, { id: "about", label: "About" }, { id: "story", label: "Our story" }, { id: "voice", label: "In my own words" },
  { id: "health", label: "Early years and health" }, { id: "daily", label: "Daily life" }, { id: "sensory", label: "Senses" }, { id: "safety", label: "Safety" }, { id: "services", label: "Reports and services" }
];
const str = (d: Record<string, IntakeValue>, k: string) => R.text(d, k);

export function Helplines({ urgent }: { urgent?: boolean }) {
  return (
    <div className={urgent ? "safety-alert" : "pf-item pf-critical"} role={urgent ? "alert" : undefined}>
      <b>If someone is in danger right now, do not use this form. Put it down and call one of these. They are free and they answer.</b>
      <ul className="plain">{B.HELPLINES.map(([who, n]) => <li key={who}>{who}: <b>{n}</b></li>)}</ul>
    </div>
  );
}

/** The family's pages. Each answer saves as it is given; nothing has to be finished in one sitting. */
export function FamilyIntake({ me, learner, data, onChange, support }: { me: Account; learner: Learner; data: Record<string, IntakeValue>; onChange: () => void; support: SupportProfile | null }) {
  const { store, syncNow } = useServices(), s = store.as(me);
  const [tab, setTab] = useState("consent");
  const save: Save = patch => { void s.updateIntake(learner.id, patch).then(() => { onChange(); void syncNow().catch(() => {}); }); };
  return (
    <div className="tl-stack">
      <p>This intake collects {learner.nickname}'s background once, so you don't have to repeat the same story to every professional. <b>It is not a test.</b> There are no right answers and nothing is marked. Write <i>Not known</i> or <i>Not sure</i> as often as you need to; a guessed date is worse than a blank one. You can skip any question, and you don't have to finish in one sitting: every answer saves as you go. Start with <b>Our story</b>, which begins with what is going well.</p>
      <p className="note">It gives no score and no diagnosis. Only a qualified professional, using proper assessment, can reach a conclusion, and that will be discussed with you face to face.</p>
      <Helplines urgent={R.immediateDanger(data)} />
      <Tabs label="Intake pages" tabs={[...FAMILY_TABS, { id: "share", label: "How to support me" }]} current={tab} onChange={setTab} />
      <TabPanel id={tab}>{tab === "share" ? <Share me={me} learner={learner} data={data} support={support} onChange={onChange} /> : <FamilyPage tab={tab} learner={learner} data={data} save={save} me={me} />}</TabPanel>
    </div>
  );
}

export function FamilyPage({ tab, learner, data, save, readOnly, me }: { tab: string; learner: Learner; data: Record<string, IntakeValue>; save: Save; readOnly?: boolean; me: Account }) {
  return tab === "consent" ? <Consent data={data} save={save} readOnly={readOnly} me={me} />
    : tab === "about" ? <Sections secs={B.ABOUT} data={data} save={save} readOnly={readOnly} />
    : tab === "story" ? <><p className="tl-muted">The most important page. Written in your own words. It begins with strengths, on purpose.</p><Sections secs={B.STORY} data={data} save={save} readOnly={readOnly} /></>
    : tab === "voice" ? <><Notice>This page is for {learner.nickname}. An adult may read the questions aloud, write down the answers, or help with a device, pictures or signs. The words should stay {learner.nickname}'s own. If they can't answer yet, you may answer as you believe they would, and say so in "How I filled this in".</Notice><Sections secs={B.VOICE} data={data} save={save} readOnly={readOnly} /></>
    : tab === "health" ? <Health data={data} save={save} readOnly={readOnly} />
    : tab === "daily" ? <Daily data={data} save={save} readOnly={readOnly} />
    : tab === "sensory" ? <Sensory data={data} save={save} readOnly={readOnly} />
    : tab === "safety" ? <Safety learner={learner} data={data} save={save} readOnly={readOnly} me={me} />
    : <><p className="tl-muted">Everyone {learner.nickname} has already seen, and everything that has already been tried. This prevents repeated testing and wasted money.</p>
        <RowsTable table="seen" {...B.TABLES.seen} data={data} save={save} readOnly={readOnly} />
        <RowsTable table="therapy" {...B.TABLES.therapy} data={data} save={save} readOnly={readOnly} />
        <Sections secs={[{ title: "What the team should learn from all of this", questions: B.SERVICES_Q }]} data={data} save={save} readOnly={readOnly} /></>;
}

function Consent({ data, save, readOnly, me }: { data: Record<string, IntakeValue>; save: Save; readOnly?: boolean; me: Account }) {
  const signed = str(data, "sign1");
  return (
    <div className="tl-stack">
      <h2>Consent and privacy notice</h2>
      <p><b>Why this information is collected.</b> To understand this person's strengths and support needs, plan an assessment, decide which professionals should be involved, and write a report that leads to practical support at home, at school and in the community.</p>
      <p><b>What kind of information this is.</b> Some of it is special personal information under the Protection of Personal Information Act 4 of 2013, including health information. Where the person is under 18, the Act requires the prior consent of a competent person, usually a parent or legal guardian.</p>
      <p><b>Who will see it.</b> Only the people on this learner's team that you have given health access to in Sharing, and only once you agree to item 3 below. The school sees only "How to support me", and only if you agree to item 4 and choose to share it.</p>
      <p><b>What you may do.</b> Ask to see what is held, ask for a correction, ask who it has been shared with, withdraw consent for future sharing, or complain to the Information Regulator. Withdrawing consent does not undo sharing that has already happened lawfully.</p>
      <p><b>The limits of this form.</b> It gathers information. It is not a test, not a screening tool and not a diagnosis.</p>
      <h2>Consent</h2>
      <p className="tl-muted">Choose an answer for each line. A No does not stop the assessment. It tells the team where the limits are.</p>
      {B.CONSENT_ITEMS.map((t, i) => (
        <div key={i} className="pf-item"><div className="pf-grid">
          <Ask id={`in-c${i + 1}`} q={`${i + 1}. ${t}`} list={B.CONSENT_OPT} value={str(data, `c${i + 1}`)} readOnly={readOnly} onSave={v => save({ [`c${i + 1}`]: v })} />
          <Ask id={`in-c${i + 1}n`} q="Any limit or condition" value={str(data, `c${i + 1}n`)} readOnly={readOnly} onSave={v => save({ [`c${i + 1}n`]: v })} />
        </div></div>))}
      <RowsTable table="share" title="Who may receive information, and what they may receive" note="List every person or service the team may speak to." cols={[["name", "Person or service"], ["role", "Role or organisation"], ["full", "May receive the full report?", B.YN], ["profile", "May receive the support profile only?", B.YN]]} data={data} save={save} readOnly={readOnly} />
      <Ask id="in-cnot" q="Anyone who must NOT be given information" why="Write the name and the reason, as briefly as you wish. The team will respect this. Where a court order or parenting plan applies, please give it to the team." kind="long" value={str(data, "cnot")} readOnly={readOnly} onSave={v => save({ cnot: v })} />
      <h2>Agreement</h2>
      {signed ? <p>Agreed by <b>{signed}</b>.</p> : readOnly ? <p className="tl-muted">Not yet agreed.</p> : <div className="tl-row"><Button variant="primary" onClick={() => save({ sign1: `${me.name}, ${new Date().toLocaleDateString("en-ZA")}` })}>I have read this and agree, as {me.name}</Button></div>}
      <div className="pf-grid">
        <Ask id="in-sign2" q="Second parent, guardian or caregiver, if they also agree" value={str(data, "sign2")} readOnly={readOnly} onSave={v => save({ sign2: v })} />
        <Ask id="in-sign3" q="The person being assessed, where they are able to agree" why="Where the person is 12 or older, the team will also explain the assessment directly to them." value={str(data, "sign3")} readOnly={readOnly} onSave={v => save({ sign3: v })} />
        <Ask id="in-sign4" q="Person who explained this form, and their role" value={str(data, "sign4")} readOnly={readOnly} onSave={v => save({ sign4: v })} />
        <Ask id="in-sign5" q="Interpreter, if one was used, and the language" value={str(data, "sign5")} readOnly={readOnly} onSave={v => save({ sign5: v })} />
      </div>
    </div>
  );
}

function Health({ data, save, readOnly }: { data: Record<string, IntakeValue>; save: Save; readOnly?: boolean }) {
  return (
    <div className="tl-stack">
      <p className="tl-muted">Fetch the clinic card or Road to Health booklet if you have it. Where you cannot remember, write Not known. A guess is worse than a blank.</p>
      <Sections secs={B.HEALTH.slice(0, 1)} data={data} save={save} readOnly={readOnly} />
      <section className="tl-stack"><h2>Early milestones</h2>
        <p className="note">Most children can do each of these by the age shown: the point by which at least three quarters of children show the skill. Reaching one late is a prompt for a conversation, not a diagnosis. Many children reach some late and are fine. Not known is a perfectly good answer.</p>
        {B.MILESTONES.map(([m, by], i) => (
          <div key={m} className="pf-item"><b>{i + 1}. {m}</b> <span className="tl-muted">Most children {by}</span>
            <div className="pf-grid">
              <Ask id={`in-m${i}`} q="When did this happen?" list={B.MILESTONE} value={str(data, `m${i}`)} readOnly={readOnly} onSave={v => save({ [`m${i}`]: v })} />
              <Ask id={`in-m${i}a`} q="Age if you know it" value={str(data, `m${i}a`)} readOnly={readOnly} onSave={v => save({ [`m${i}a`]: v })} />
              <Ask id={`in-m${i}n`} q="Notes" value={str(data, `m${i}n`)} readOnly={readOnly} onSave={v => save({ [`m${i}n`]: v })} />
            </div></div>))}
      </section>
      <Sections secs={B.HEALTH.slice(1)} data={data} save={save} readOnly={readOnly} />
      <Notice>Medicines, vitamins and supplements taken now are recorded in <b>Health</b>, where the doses given are logged too. Include anything bought over the counter and any traditional or herbal remedy.</Notice>
      <RowsTable table="stopped" {...B.TABLES.stopped} data={data} save={save} readOnly={readOnly} />
      <Ask id="in-allergyNone" q="Is there any known allergy or bad reaction?" why="If there is none, choose No. Otherwise add each one below." list={["Yes", "No", "Not known"]} value={str(data, "allergyAny")} readOnly={readOnly}
        onSave={v => save({ allergyAny: v, allergyNone: v === "No" ? "Yes" : "" })} />
      <RowsTable table="allergy" {...B.TABLES.allergy} data={data} save={save} readOnly={readOnly} />
    </div>
  );
}

function Daily({ data, save, readOnly }: { data: Record<string, IntakeValue>; save: Save; readOnly?: boolean }) {
  const areas = R.areaAverages(data);
  return (
    <div className="tl-stack">
      <p>The same areas every professional will ask about, in one place. This replaces being asked the same question by six different people.</p>
      <Notice>Go down the list. For anything that is not a problem, choose <b>No concern</b> and move on. You only need the other boxes where there is something to say. Your own words matter most, and the team reads them first.</Notice>
      {B.DAILY_AREAS.map((area, ai) => {
        const row = areas[ai]!;
        return (
          <details key={area} className="pf-group"><summary>{area} · {row.rated} of {B.DAILY.filter(i => i.area === area).length} answered</summary>
            <div className="tl-stack">
              {B.DAILY.filter(i => i.area === area).map(i => {
                const sc = R.scoreOf(str(data, `d${i.n}c`)), tone = sc === null || sc < 0 ? "" : sc >= 3 ? "pf-critical" : sc === 2 ? "pf-watch" : "pf-ok";
                return (
                  <div key={i.n} className={`pf-item ${tone}`} role="group" aria-labelledby={`in-d${i.n}-q`}>
                    <b id={`in-d${i.n}-q`}>{i.n}. {i.text}</b>
                    <div className="pf-grid">
                      <Ask id={`in-d${i.n}c`} q="How much of a concern is this?" list={B.CONCERN.map(([l]) => l)} value={str(data, `d${i.n}c`)} readOnly={readOnly} onSave={v => save({ [`d${i.n}c`]: v })} />
                      {sc !== null && sc > 0 ? <>
                        <Ask id={`in-d${i.n}f`} q="How often?" list={B.FREQUENCY} value={str(data, `d${i.n}f`)} readOnly={readOnly} onSave={v => save({ [`d${i.n}f`]: v })} />
                        <Ask id={`in-d${i.n}w`} q="Where?" list={B.SETTING} value={str(data, `d${i.n}w`)} readOnly={readOnly} onSave={v => save({ [`d${i.n}w`]: v })} />
                        <Ask id={`in-d${i.n}p`} q="One of your priorities?" list={B.PRIORITY} value={str(data, `d${i.n}p`)} readOnly={readOnly} onSave={v => save({ [`d${i.n}p`]: v })} />
                      </> : null}
                    </div>
                    {sc !== null && sc > 0 ? <Ask id={`in-d${i.n}t`} q="What it looks like, in your words" kind="long" value={str(data, `d${i.n}t`)} readOnly={readOnly} onSave={v => save({ [`d${i.n}t`]: v })} /> : null}
                  </div>);
              })}
              <Ask id={`in-dt${ai}`} q="What have you tried in this area, and what helped?" kind="long" value={str(data, `dt${ai}`)} readOnly={readOnly} onSave={v => save({ [`dt${ai}`]: v })} />
            </div>
          </details>);
      })}
    </div>
  );
}

function Sensory({ data, save, readOnly }: { data: Record<string, IntakeValue>; save: Save; readOnly?: boolean }) {
  return (
    <div className="tl-stack">
      <p>How this person takes in sound, light, touch, taste, smell and movement, and how they read signals from inside their own body. This page changes how the team runs the appointment itself.</p>
      <p className="note">There is no right pattern here. Many people avoid some things and seek others out, and the same person can swing between the two on different days. Say what you see.</p>
      {B.SENSES.map((sense, i) => (
        <details key={sense} className="pf-group"><summary>{i + 1}. {sense}{str(data, `e${i}c`) ? ` · ${str(data, `e${i}c`)}` : ""}</summary>
          <div className="pf-grid">
            <Ask id={`in-e${i}p`} q="What you notice" list={B.SENSORY_PATTERN} value={str(data, `e${i}p`)} readOnly={readOnly} onSave={v => save({ [`e${i}p`]: v })} />
            <Ask id={`in-e${i}c`} q="How much does it affect daily life?" list={B.CONCERN.map(([l]) => l)} value={str(data, `e${i}c`)} readOnly={readOnly} onSave={v => save({ [`e${i}c`]: v })} />
            <Ask id={`in-e${i}w`} q="Where?" list={B.SETTING} value={str(data, `e${i}w`)} readOnly={readOnly} onSave={v => save({ [`e${i}w`]: v })} />
            <Ask id={`in-e${i}h`} q="What helps" value={str(data, `e${i}h`)} readOnly={readOnly} onSave={v => save({ [`e${i}h`]: v })} />
            <Ask id={`in-e${i}x`} q="What makes it worse" value={str(data, `e${i}x`)} readOnly={readOnly} onSave={v => save({ [`e${i}x`]: v })} />
            <Ask id={`in-e${i}t`} q="Examples in your words" value={str(data, `e${i}t`)} readOnly={readOnly} onSave={v => save({ [`e${i}t`]: v })} />
          </div>
        </details>))}
      <Sections secs={B.SENSORY_MORE} data={data} save={save} readOnly={readOnly} />
    </div>
  );
}

function Safety({ learner, data, save, readOnly, me }: { learner: Learner; data: Record<string, IntakeValue>; save: Save; readOnly?: boolean; me: Account }) {
  const { store, syncNow } = useServices(), [asked, setAsked] = useState(false), fu = R.safetyFollowUps(data);
  const askPrivate = () => void store.as(me).send(learner.id, "The family would like a private conversation with the team about something in the intake. Please contact them.", "team")
    .then(() => { setAsked(true); void syncNow().catch(() => {}); });
  return (
    <div className="tl-stack">
      <p>This page is short, and it matters. The team asks these questions of every family. Answering honestly lets the team keep {learner.nickname} safe and get the right help quickly. If you would rather talk about something than write it, choose <b>Prefer to discuss in person</b>.</p>
      <Helplines urgent={R.immediateDanger(data)} />
      <p className="note"><b>What the team must do by law.</b> Under section 110 of the Children's Act 38 of 2005, a teacher, nurse, doctor, psychologist, social worker, occupational therapist, physiotherapist or speech therapist who concludes on reasonable grounds that a child has been abused in a way causing physical injury, sexually abused or deliberately neglected must report it on Form 22 to a designated child protection organisation, the provincial Department of Social Development or the police. The team will tell you if it has to make a report, unless telling you would put the child at greater risk.</p>
      <Sections secs={B.SAFETY} data={data} save={save} readOnly={readOnly} />
      {!readOnly && fu.length ? <Notice tone="warn">Some of your answers need a private conversation with the team.{" "}
        {asked ? <b>Your request was sent to {learner.nickname}'s team.</b> : <Button small onClick={askPrivate}>Ask the team for a private conversation</Button>}</Notice> : null}
    </div>
  );
}

function Share({ me, learner, data, support, onChange }: { me: Account; learner: Learner; data: Record<string, IntakeValue>; support: SupportProfile | null; onChange: () => void }) {
  const { store, syncNow } = useServices(), snap = R.supportSnapshot(data, learner.nickname), may = R.text(data, "c4").startsWith("Yes");
  const share = (d: Record<string, string>) => void store.as(me).shareSupportProfile(learner.id, d).then(() => { onChange(); void syncNow().catch(() => {}); });
  return (
    <div className="tl-stack">
      <p>One page for a teacher, a relief teacher, a new therapist or a sports coach. It fills in on its own from your answers. Read it with {learner.nickname}, correct anything that is wrong in the pages it comes from, then share it.</p>
      <div className="tl-row pf-noprint">
        {may ? <Button variant="primary" onClick={() => share(snap)}>{support ? "Update the copy the team sees" : `Share with ${learner.nickname}'s team`}</Button> : null}
        {support ? <Button variant="quiet" onClick={() => share({})}>Stop sharing</Button> : null}
        <Button onClick={() => window.print()}><span aria-hidden="true">🖨️</span>Print</Button>
      </div>
      {!may ? <Notice>To share this with {learner.nickname}'s teachers, first agree to item 4 in Consent: relevant information may be shared with the school.</Notice> : null}
      <p className="tl-muted" role="status">{support ? `The team sees the copy you shared on ${new Date(support.at).toLocaleDateString("en-ZA")}. Press Update after changing your answers.` : "Not shared with the team."}</p>
      <SupportCard data={snap} title="How to support me" />
    </div>
  );
}
