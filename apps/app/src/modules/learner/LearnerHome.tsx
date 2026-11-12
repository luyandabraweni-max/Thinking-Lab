import { Button, Card, motionAllowed, type Prefs } from "@tl/ui";
import { loadClips } from "@tl/voice";
import { VoiceField } from "@tl/voice/react";
import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useServices, type DeviceLearner } from "../../platform";
import type { Row } from "@tl/adaptation";
import type { Unit, WordHelp } from "@tl/content";
import { defaultSettings, type ConcernRow, type LearnerSettings, type LearnerSpace, type Message, type PlanStep } from "@tl/data";
import { CaptionBar, MyWay, usePrefs, useSay } from "../my-way";
import { UNSAFE, UnsafeDialog } from "../safety";
import type { GameId, LabRun } from "../thinking-lab";
import { PLAN_KINDS, PLAN_MAX } from "./plan";
import { AvatarBuilder, AvatarStage } from "../avatar";
import { BATTERY_EVERY, BatteryCheck, BreakScreen, Feelings, HelpCard, TalkBoard } from "../wellbeing";

// Lessons and games load when the learner opens them, so the app starts fast on low-end phones.
const LearnHome = lazy(() => import("../learning").then(m => ({ default: m.LearnHome })));
const Lesson = lazy(() => import("../learning").then(m => ({ default: m.Lesson })));
const LabHome = lazy(() => import("../thinking-lab").then(m => ({ default: m.LabHome })));
const Exercise = lazy(() => import("../thinking-lab").then(m => ({ default: m.Exercise })));
const Loading = () => <section className="card"><p role="status">Getting it ready…</p></section>;

const STICKERS = ["Thank you!", "That made me happy", "I'm proud", "Can you help me?"];

/** The learner's own space: lessons, the Thinking Lab, and messages from their team. */

export function LearnerHome(props: { learner: DeviceLearner; onDone: () => void }) {
  const { store } = useServices();
  const [prefs, changePrefs] = usePrefs(store.kv, props.learner.learnerId), { say, caption } = useSay(prefs);
  useEffect(() => { if (prefs.speak) void loadClips("common"); }, [prefs.speak]); // recorded voice for everyday lines
  return <><LearnerScreens {...props} prefs={prefs} changePrefs={changePrefs} say={say} /><CaptionBar text={caption} /></>;
}
function LearnerScreens({ learner, onDone, prefs, changePrefs, say }: { learner: DeviceLearner; onDone: () => void; prefs: Prefs; changePrefs: (p: Partial<Prefs>) => void; say: (t: string) => void }) {
  const { store } = useServices();
  const [space, setSpace] = useState<LearnerSpace>(), [inbox, setInbox] = useState<Message[]>([]), [text, setText] = useState(""), [note, setNote] = useState<ReactNode>("");
  const [screen, setScreen] = useState<"home" | "lab" | "learn" | "myway" | "avatar" | GameId>("home");
  const [settings, setSettings] = useState<LearnerSettings>(defaultSettings(learner.learnerId));
  const [lesson, setLesson] = useState<{ unit: Unit; words?: WordHelp; history: Row[] } | null>(null), [unsafe, setUnsafe] = useState(false);
  const [plan, setPlan] = useState<{ steps: PlanStep[]; by: string | null; at: number } | null>(null);
  // Check-ins and breaks: how the learner feels shapes this session only, and is never stored.
  const [check, setCheck] = useState<"feelings" | "battery" | "break" | "help" | null>("feelings");
  const [pending, setPending] = useState<(() => void) | null>(null), [short, setShort] = useState(false);
  const [started, setStarted] = useState(0), [asked, setAsked] = useState(0);
  /** Start a lesson or game, asking about energy every couple of activities first. */
  const begin = (run: () => void) => {
    setStarted(n => n + 1);
    if (started - asked >= BATTERY_EVERY) { setPending(() => run); setCheck("battery"); } else run();
  };
  const resume = () => { const run = pending; setPending(null); setCheck(null); run?.(); };
  const raiseConcern = (where: ConcernRow["where"]) => { setUnsafe(true); void space?.reportConcern(where); };
  const openLesson = async (id: string) => {
    if (!space) return;
    const [{ unit, words }, past] = await Promise.all([import("@tl/content").then(c => c.loadUnit(id)), space.history()]);
    setLesson({ unit, words, history: past.map((a): Row => [a.occurredAt.slice(0, 10), a.activityId, a.status, a.mode, a.hints, a.reflection, ...(a.flags ? [a.flags] : [])] as Row) });
  };
  useEffect(() => {
    void (async () => {
      const adult = await store.account(learner.adultId);
      if (!adult) return setNote("The grown-up who set up this device needs to sign in again.");
      const sp = await store.learnerSpace(adult, learner.learnerId);
      const [box, st] = await Promise.all([sp.inbox(), sp.settings()]);
      setSettings(st); setInbox(box); setSpace(sp); // settings first, so the learner never sees the old levels
      const made = await sp.takePlan(); // an adult's plan for this session is used once
      if (made) setPlan({ steps: made.steps, by: made.by, at: 0 });
      await sp.markRead();
    })().catch((e: Error) => setNote(e.message));
  }, [store, learner]);
  const older = space ? space.learner.cohort === "teen" || space.learner.cohort === "adult" : false;
  const [talk, setTalk] = useState(false), talkBtn = useRef<HTMLButtonElement>(null);
  const closeTalk = useCallback(() => { setTalk(false); talkBtn.current?.focus(); }, []);
  const view = ((): ReactNode => {
    if (unsafe) return <UnsafeDialog older={older} country={null} onClose={() => setUnsafe(false)} />;
    if (space && check === "feelings") return <Feelings older={older} say={say} onDone={n => setCheck(n === "start" ? null : n)} />;
    if (check === "battery") return <BatteryCheck say={say} onDone={c => { setAsked(started); if (c === "break") setCheck("break"); else { if (c === "short") setShort(true); resume(); } }} />;
    if (check === "break") return <BreakScreen say={say} onReady={resume} />;
    if (check === "help") return <HelpCard say={say} onDone={() => setCheck(null)} />;
    if (space && screen === "avatar") return <AvatarBuilder initial={settings.avatar} older={older} calm={prefs.calm} say={say} onBack={() => setScreen("home")}
      onSave={look => { setSettings(st => ({ ...st, avatar: look })); void space.setAvatar(look); setScreen("home"); }} />;
    if (screen === "myway") return <MyWay prefs={prefs} change={changePrefs} onDone={() => setScreen("home")} />;
    if (space && lesson) return <Suspense fallback={<Loading />}><Lesson key={lesson.unit.id} {...lesson} say={say} adapt={{ auto: settings.adaptAuto, off: settings.adaptOff }} older={older} country={null} onSave={a => space.record(a)} onUnsafe={() => raiseConcern("lesson")} short={short} voiceAnswers={prefs.voiceIn} onBack={() => { setLesson(null); setShort(false); }} /></Suspense>;
    if (space && screen === "learn") return <Suspense fallback={<Loading />}><LearnHome learner={space.learner} levels={settings.levels} onPick={id => begin(() => void openLesson(id))} onBack={() => setScreen("home")} /></Suspense>;
    if (space && screen !== "home") {
      const run: LabRun = { id: screen === "lab" ? "light" : (screen as GameId), band: older ? "older" : "younger", learnerName: space.learner.nickname, W: (kid, grown) => (older ? grown : kid), reduceMotion: !motionAllowed(prefs), say };
      if (screen === "lab") return <Suspense fallback={<Loading />}><LabHome W={run.W} onPick={g => begin(() => setScreen(g))} onBack={() => setScreen("home")} /></Suspense>;
      return <Suspense fallback={<Loading />}><Exercise key={screen} run={run} onSave={a => space.record(a)} onBack={() => setScreen("lab")} /></Suspense>;
    }
    const startStep = () => {
      const k = plan?.steps[plan.at]?.key;
      if (!plan || !k) return;
      setPlan({ ...plan, at: plan.at + 1 });
      if (k === "finish") onDone();
      else if (k === "lesson") setScreen("learn");
      else if (k === "lab") setScreen("lab");
    else if (k === "avatar") setScreen("avatar");
      else if (k.startsWith("x:")) begin(() => setScreen(k.slice(2) as GameId));
      else if (k.startsWith("u:")) begin(() => void openLesson(k.slice(2)));
    };
    const reply = async (body: string) => { if (!space) return; await space.reply(body); setText(""); setInbox(await space.inbox()); setNote("Sent!"); };
    return (
      <Card>
        <div className="tl-row" style={{ alignItems: "center" }}>
        {settings.avatar ? <AvatarStage look={settings.avatar} size={120} calm={prefs.calm} say={say} /> : null}
        <h1>Hello, {learner.nickname}</h1>
      </div>
        <div className="row"><Button variant="primary" onClick={() => setScreen("learn")}>Learn</Button><Button variant="primary" onClick={() => setScreen("lab")}>Thinking Lab</Button><Button onClick={() => setScreen("myway")}><span aria-hidden="true">🎛️</span>My way</Button><Button onClick={() => setScreen("avatar")}><span aria-hidden="true">🎨</span>{settings.avatar ? "Change my character" : "Make my character"}</Button><Button onClick={() => setCheck("break")}><span aria-hidden="true">🌿</span>Take a break</Button><Button onClick={() => setCheck("help")}><span aria-hidden="true">🙋</span>I need help</Button></div>
        <MyPlan plan={plan} onStart={startStep} onSave={steps => { setPlan({ steps, by: null, at: 0 }); say(`Your plan: ${steps.map(x => x.label).join(", ")}.`); }} />
        <h2>Messages for you</h2>
        {inbox.length ? <ol className="tl-stack" style={{ listStyle: "none", padding: 0, margin: 0 }}>{inbox.map(m => <li key={m.id}><Card as="article"><p className="tl-muted"><b>{m.fromRole === "learner" ? "You" : m.fromName}</b></p><p>{m.body}</p></Card></li>)}</ol>
          : <p className="tl-muted">No messages yet.</p>}
        <div className="tl-row">{STICKERS.map(s => <Button key={s} onClick={() => void reply(s)}>{s}</Button>)}</div>
        <form className="tl-stack" onSubmit={e => { e.preventDefault(); void reply(text); }}>
          <VoiceField label="Or say something yourself" value={text} onChange={setText} kind="long" />
          <div className="tl-row"><Button type="submit" variant="primary" disabled={!text.trim()}>Send</Button></div>
        </form>
        <p role="status">{note}</p>
        <div className="tl-row"><Button onClick={onDone}>I'm done</Button><Button onClick={() => raiseConcern("home")}><span aria-hidden="true">🛟</span>{UNSAFE}</Button></div>
      </Card>
    );
  })();
  return <>
    {unsafe ? null : <div className="talk-fab"><button ref={talkBtn} className="btn" onClick={() => setTalk(true)}><span className="em" aria-hidden="true">💬</span><span>Talk board</span></button></div>}
    {view}
    {talk ? <TalkBoard say={say} onClose={closeTalk} onUnsafe={() => { setTalk(false); raiseConcern("talk board"); }} /> : null}
  </>;
}

function MyPlan({ plan, onStart, onSave }: { plan: { steps: PlanStep[]; by: string | null; at: number } | null; onStart: () => void; onSave: (steps: PlanStep[]) => void }) {
  const [making, setMaking] = useState(false), [pick, setPick] = useState<PlanStep[]>([]);
  if (making) return (
    <section className="tl-stack" aria-labelledby="mpH"><h2 id="mpH">Make my plan</h2>
      <p className="tl-muted">Tap the things you want to do, in order. Up to {PLAN_MAX}.</p>
      <div className="choices">{PLAN_KINDS.map(k => <button key={k.key} className="choice" disabled={pick.length >= PLAN_MAX} onClick={() => setPick([...pick, k])}><span className="em" aria-hidden="true">{k.pic}</span><span className="lbl">{k.label}</span></button>)}</div>
      <ol className="plan-strip" aria-label="Your plan so far">{pick.length ? pick.map((k, i) => <li key={i}><span className="em" aria-hidden="true">{k.pic}</span><span>{k.label}</span></li>) : <li className="muted">Nothing yet</li>}</ol>
      <div className="tl-row"><Button variant="primary" disabled={!pick.length} onClick={() => { onSave(pick); setMaking(false); setPick([]); }}>Save my plan</Button>
        {pick.length ? <Button onClick={() => setPick(pick.slice(0, -1))}>Take the last one off</Button> : null}<Button variant="quiet" onClick={() => setMaking(false)}>Close</Button></div>
    </section>);
  if (!plan) return <div className="tl-row"><Button onClick={() => setMaking(true)}><span aria-hidden="true">🗺️</span>Make my plan</Button></div>;
  const next = plan.steps[plan.at];
  return (
    <section className="tl-stack" aria-labelledby="mpH"><h2 id="mpH">My plan today</h2>
      {plan.by ? <p className="note"><span aria-hidden="true">🧑‍🏫</span> {plan.by} made this plan for you.</p> : null}
      <ol className="plan-strip" aria-label="My plan today">{plan.steps.map((k, i) => <li key={i} className={i < plan.at ? "done" : i === plan.at ? "now" : ""} aria-current={i === plan.at ? "step" : undefined}>
        <span className="em" aria-hidden="true">{k.pic}</span><span><span className="tl-visually-hidden">{i < plan.at ? "Done: " : i === plan.at ? "Now: " : "Later: "}</span>{k.label}</span></li>)}</ol>
      <div className="tl-row">{next ? <Button variant="primary" onClick={onStart}>Start: {next.label}</Button> : <p>You finished your plan.</p>}<Button variant="quiet" onClick={() => setMaking(true)}>Change my plan</Button></div>
    </section>);
}
