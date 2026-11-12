import { DEMO, type Account } from "@tl/data";
import { Button, Card, Field, Notice } from "@tl/ui";
import { useEffect, useState } from "react";
import { checkPictures, DEMO_CODE, deviceLearners, PICTURES, useServices, type DeviceLearner } from "../../platform";

type Door = "guardian" | "specialist";
type Step = { at: "doors" } | { at: "adult"; door: Door } | { at: "code"; door: Door; email: string } | { at: "register"; door: Door } | { at: "learners" } | { at: "pictures"; learner: DeviceLearner };

const DOOR_TEXT: Record<Door, [string, string]> = {
  guardian: ["Parents and guardians", "See how your child is doing, talk with their teachers and therapists, and keep track of medicines."],
  specialist: ["Specialists and teachers", "Follow your learners, set support goals, keep notes and talk with families."]
};

export function SignIn({ onAdult, onLearner }: { onAdult: (a: Account) => void; onLearner: (l: DeviceLearner) => void }) {
  const { mode, store } = useServices();
  const [step, setStep] = useState<Step>({ at: "doors" });
  const [learners, setLearners] = useState<DeviceLearner[]>([]);
  useEffect(() => { void deviceLearners(store.kv).then(setLearners); }, [store, step]);

  if (step.at === "adult" || step.at === "code") return <AdultSignIn step={step} setStep={setStep} onAdult={onAdult} />;
  if (step.at === "register") return <Register door={step.door} onDone={onAdult} onBack={() => setStep({ at: "doors" })} />;
  if (step.at === "learners") return (
    <Card>
      <h1>Who is learning?</h1>
      {learners.length ? <div className="tl-row">{learners.map(l => <Button key={l.learnerId} onClick={() => setStep({ at: "pictures", learner: l })}>{l.nickname}</Button>)}</div>
        : <p>No learners use this device yet. A grown-up on your team can set it up for you from their account.</p>}
      <div className="tl-row"><Button variant="quiet" onClick={() => setStep({ at: "doors" })}>Back</Button></div>
    </Card>);
  if (step.at === "pictures") return <PicturePassword learner={step.learner} onOk={() => onLearner(step.learner)} onBack={() => setStep({ at: "learners" })} />;

  return (
    <Card>
      <p className="tl-eyebrow">2to.iQ Thinking Lab</p>
      <h1>Welcome</h1>
      <p>Calm, accessible thinking activities for learners aged 3 to 25.</p>
      <div className="tl-stack">
        {(Object.keys(DOOR_TEXT) as Door[]).map(d => (
          <Card key={d} as="div">
            <h2>{DOOR_TEXT[d][0]}</h2><p className="tl-muted">{DOOR_TEXT[d][1]}</p>
            <div className="tl-row"><Button variant="primary" onClick={() => setStep({ at: "adult", door: d })}>Sign in or register</Button></div>
          </Card>))}
        <Card as="div">
          <h2>Learners</h2><p className="tl-muted">Go to your own learning space with your picture password.</p>
          <div className="tl-row"><Button onClick={() => setStep({ at: "learners" })}>I'm a learner</Button></div>
        </Card>
      </div>
      {mode === "demo" ? <DemoAccounts onAdult={onAdult} /> : null}
      <p className="tl-muted">School and organisation admins: your account is set up with us when your organisation joins.</p>
    </Card>
  );
}

function DemoAccounts({ onAdult }: { onAdult: (a: Account) => void }) {
  const { auth } = useServices();
  const demo = (id: string) => void auth.signInDemo(id).then(onAdult);
  return (
    <Notice>
      <div className="tl-stack">
        <p><b>Demo mode.</b> The app isn't connected to its server yet, so everything is made up and stays on this device.</p>
        <div className="tl-row">
          <Button small onClick={() => demo(DEMO.parent)}>Demo parent</Button>
          <Button small onClick={() => demo(DEMO.specialist)}>Demo specialist</Button>
          <Button small onClick={() => demo(DEMO.therapist)}>Demo therapist</Button>
          <Button small onClick={() => demo(DEMO.admin)}>Demo school admin</Button>
        </div>
      </div>
    </Notice>);
}

function AdultSignIn({ step, setStep, onAdult }: { step: Extract<Step, { at: "adult" | "code" }>; setStep: (s: Step) => void; onAdult: (a: Account) => void }) {
  const { auth, mode } = useServices();
  const [email, setEmail] = useState(step.at === "code" ? step.email : ""), [code, setCode] = useState(""), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  const attempt = async (fn: () => Promise<void>) => { setBusy(true); setError(""); try { await fn(); } catch (e) { setError((e as Error).message); } finally { setBusy(false); } };
  return (
    <Card>
      <h1>{DOOR_TEXT[step.door][0]}</h1>
      {auth.methods.google && step.at === "adult" ? <>
        <Button variant="primary" disabled={busy} onClick={() => void attempt(() => auth.signInWithGoogle())}>Continue with Google</Button>
        <p className="tl-muted">Google shares only your name and email address with Thinking Lab.</p>
        <p><b>Or use your email</b></p></> : null}
      {step.at === "adult" ? <form className="tl-stack" onSubmit={e => { e.preventDefault(); void attempt(async () => { await auth.sendEmailCode(email.trim()); setStep({ at: "code", door: step.door, email: email.trim() }); }); }}>
        <Field label="Email address" value={email} onChange={setEmail} autoComplete="email" required hint="We'll send you a one-time code. No password to remember." />
        <div className="tl-row"><Button type="submit" variant={auth.methods.google ? undefined : "primary"} disabled={busy || !email.trim()}>Send me a code</Button></div>
      </form> : <form className="tl-stack" onSubmit={e => { e.preventDefault(); void attempt(async () => { const r = await auth.verifyEmailCode(step.email, code); if (r === "new") setStep({ at: "register", door: step.door }); else onAdult(r); }); }}>
        <p>We sent a code to <b>{step.email}</b>.</p>
        {mode === "demo" ? <Notice>Demo mode: no email is sent. The code is <b>{DEMO_CODE}</b>.</Notice> : null}
        <Field label="Code from the email" value={code} onChange={setCode} autoComplete="one-time-code" required />
        <div className="tl-row"><Button type="submit" variant="primary" disabled={busy || !code.trim()}>Sign in</Button></div>
      </form>}
      {error ? <p className="tl-error" role="alert">{error}</p> : null}
      <div className="tl-row"><Button variant="quiet" onClick={() => setStep({ at: "doors" })}>Back</Button></div>
    </Card>
  );
}

const PROFESSIONS = ["Teacher", "Special-needs educator", "Occupational therapist", "Speech-language therapist", "Educational psychologist", "Physiotherapist", "Care worker", "Other"];
function Register({ door, onDone, onBack }: { door: Door; onDone: (a: Account) => void; onBack: () => void }) {
  const { auth } = useServices();
  const [name, setName] = useState(""), [profession, setProfession] = useState(PROFESSIONS[0]!), [error, setError] = useState("");
  return (
    <Card>
      <h1>Welcome! Tell us who you are</h1>
      <form className="tl-stack" onSubmit={e => { e.preventDefault(); auth.register(name, door === "guardian" ? "guardian" : profession === "Teacher" ? "teacher" : "specialist", door === "guardian" ? undefined : profession).then(onDone, (err: Error) => setError(err.message)); }}>
        <Field label="Your name" value={name} onChange={setName} autoComplete="name" required />
        {door === "specialist" ? <div className="tl-field"><label htmlFor="prof">Your work</label>
          <select id="prof" value={profession} onChange={e => setProfession(e.target.value)}>{PROFESSIONS.map(p => <option key={p}>{p}</option>)}</select></div> : null}
        <div className="tl-row"><Button type="submit" variant="primary" disabled={!name.trim()}>Continue</Button><Button variant="quiet" onClick={onBack}>Back</Button></div>
      </form>
      {error ? <p className="tl-error" role="alert">{error}</p> : null}
    </Card>
  );
}

function PicturePassword({ learner, onOk, onBack }: { learner: DeviceLearner; onOk: () => void; onBack: () => void }) {
  const { store } = useServices();
  const [picked, setPicked] = useState<number[]>([]), [msg, setMsg] = useState("");
  const choose = async (i: number) => {
    const next = [...picked, i];
    if (next.length < 3) { setPicked(next); return; }
    const r = await checkPictures(store.kv, learner.learnerId, next);
    setPicked([]);
    if (r === "ok") onOk();
    else setMsg(r === "wait" ? "Let's take a little break. Try again in half a minute." : "Not quite. Try your three pictures again.");
  };
  return (
    <Card>
      <h1>Hello, {learner.nickname}</h1>
      <p>Choose your three pictures, in order.</p>
      <p role="status" aria-live="polite">{picked.length ? `${picked.length} of 3 chosen.` : msg}</p>
      <div className="tl-row" role="group" aria-label="Pictures">
        {PICTURES.map(([em, name], i) => <Button key={name} aria-label={name} onClick={() => void choose(i)}><span aria-hidden="true" style={{ fontSize: "2rem" }}>{em}</span></Button>)}
      </div>
      <div className="tl-row"><Button variant="quiet" onClick={onBack}>Back</Button></div>
    </Card>
  );
}
