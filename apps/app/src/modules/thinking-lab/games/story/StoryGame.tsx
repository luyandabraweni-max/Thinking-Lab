import { useVoice, VoiceConsent } from "@tl/voice/react";
import { useRef, useState, type ReactNode } from "react";
import { DrawPad, Icon, LabHead, newRec, Think, type GameProps, type LabRun } from "../../kit";
import { fillWho, pageLines, SW_FEEL, SW_LESSONS, SW_PROBLEMS, SW_STAGES, SW_WHERE, SW_WHO, type Page, type Story } from "./logic";

// Records how the learner prefers to express themselves (choosing, typing, drawing or speaking) and how they name
// feelings; older learners also take another character's point of view. It ends as a storybook that reads itself aloud.
type Step = "who" | "where" | "problem" | 0 | 1 | 2 | "draw0" | "draw1" | "draw2" | "perspective" | "title" | "book0" | "book1" | "book2";

export function StoryGame({ run, onFinish }: GameProps) {
  const { W } = run, older = run.band === "older";
  const rec = useRef(newRec("My story", { open: true, modes: {} as Record<string, number>, feelings: [] as string[], mode: "told a story" }));
  const [st, setSt] = useState<Story>({ whoName: run.learnerName, pages: [] }), [step, setStep] = useState<Step>("who"), [acted, setActed] = useState(false);
  const used = (m: string) => { const modes = rec.current.modes as Record<string, number>; modes[m] = (modes[m] ?? 0) + 1; };
  const setPage = (i: number, p: Partial<Page>) => setSt(s => { const pages = [...s.pages]; pages[i] = { ...pages[i], ...p }; return { ...s, pages }; });
  const finish = (story: Story | null) => onFinish({ items: [rec.current], reflect: { q: W("What do you like most about your story?", "What part of your story are you proudest of?"), options: ["The beginning", "The middle", "The ending", "My own words or drawings"] },
    extra: story?.title ? `Story: "${story.title}". ${[0, 1, 2].filter(i => story.pages[i]?.event).map(i => pageLines(story, i).join(" ")).join(" ")} Told by: ${Object.entries(rec.current.modes as Record<string, number>).map(([m, n]) => `${m} ${n}`).join(", ")}. Feelings named: ${(rec.current.feelings as string[]).join(", ") || "none"}.` : "Chose not to make a story this time." });
  const skip = () => { rec.current.movedOn = true; finish(null); };
  const frame = (title: string, children: ReactNode) => <StoryFrame run={run} title={title} acted={acted} onSkip={skip}>{children}</StoryFrame>;

  if (step === "who") return frame("Who is your story about?", <Choices list={SW_WHO.map(([id, l, p]) => [id, id === "me" ? `${l}: ${run.learnerName}` : l, id === "me" ? "🧑🏾" : p])} onPick={id => {
    setSt(s => ({ ...s, who: id, whoName: id === "me" ? run.learnerName : SW_WHO.find(w => w[0] === id)![1].split(",")[0]! })); setActed(true); used("chose"); setStep("where"); }} />);
  if (step === "where") return frame("Where does it happen?", <Choices list={SW_WHERE.map(w => [w.id, w.label, w.props[0]!])} onPick={id => { setSt(s => ({ ...s, where: id })); setStep("problem"); }} />);
  if (step === "problem") return frame("What is the problem?", <Choices list={Object.entries(SW_PROBLEMS).map(([id, p]) => [id, p.label, p.pic])} onPick={id => { setSt(s => ({ ...s, problem: id })); setStep(0); }} />);
  if (typeof step === "number") return <StoryPage run={run} st={st} i={step} acted={acted} onSet={p => setPage(step, p)} used={used}
    onAct={() => setActed(true)} onDraw={() => setStep(`draw${step}` as Step)} onPrev={() => setStep((step - 1) as Step)} onSkip={skip}
    onNext={() => setStep(step < 2 ? (step + 1) as Step : older ? "perspective" : "title")} />;
  if (step === "draw0" || step === "draw1" || step === "draw2") {
    const i = Number(step.slice(4));
    return <DrawPad title="Draw this part of your story" note="Draw anything you like." onDone={(_, pic) => { if (pic) { setPage(i, { pic }); used("drew"); } setStep(i as Step); }} />;
  }
  if (step === "perspective") return <Perspective run={run} st={st} onDone={(other, lesson) => { setSt(s => ({ ...s, other, lesson })); rec.current.perspective = true; setStep("title"); }} />;
  if (step === "title") return <Title run={run} st={st} onDone={(title, typed) => { if (typed) used("typed"); setSt(s => ({ ...s, title })); setStep("book0"); }} onSkip={skip} />;
  const i = Number(step.slice(4)), lines = pageLines(st, i);
  return (
    <section className="card">
      <LabHead run={run} step="My storybook" />
      <div className={`sw-book${run.reduceMotion ? "" : " turn"}`} key={i}>
        {i === 0 ? <h2 className="sw-title">{st.title}</h2> : null}
        <Scene run={run} st={st} p={st.pages[i]!} />
        <div className="sw-text">{lines.map(l => <p key={l}>{l}</p>)}</div>
        <p className="muted">Page {i + 1} of 3</p>
      </div>
      <div className="row">
        <button className="btn" onClick={() => run.say([...(i === 0 ? [`${st.title}.`] : []), ...lines].join(" "))}><Icon e="🔊" /><span>Read this page</span></button>
        {i > 0 ? <button className="btn" onClick={() => setStep(`book${i - 1}` as Step)}>Previous page</button> : null}
        {i < 2 ? <button className="btn primary" autoFocus onClick={() => setStep(`book${i + 1}` as Step)}>Next page</button>
          : <button className="btn primary" autoFocus onClick={() => { rec.current.latestMatched = true; rec.current.feelings = st.pages.map(p => p.feeling).filter((f): f is string => !!f); finish(st); }}>I love my story</button>}
      </div>
    </section>
  );
}

function Choices({ list, onPick }: { list: [string, string, string][]; onPick: (id: string) => void }) {
  return <div className="choices">{list.map(([id, label, pic]) => <button key={id} className="choice" onClick={() => onPick(id)}>{pic ? <span className="opt-pic" aria-hidden="true">{pic}</span> : null}<span className="lbl">{label}</span></button>)}</div>;
}

function StoryFrame({ run, title, acted, onSkip, children }: { run: LabRun; title: string; acted: boolean; onSkip: () => void; children: ReactNode }) {
  return (
    <section className="card"><LabHead run={run} step="Make your story" /><h2>{title}</h2>{children}<Think run={run} acted={acted} />
      <div className="row"><button className="btn quiet" onClick={onSkip}>Move on without a story</button></div></section>);
}

// One page's picture: the place, the character with their feeling, and what happens.
function Scene({ st, p }: { run: LabRun; st: Story; p: Page }) {
  const w = SW_WHERE.find(x => x.id === st.where)!, feel = p.feeling ? SW_FEEL.find(f => f[0] === p.feeling) : undefined;
  const pic = st.who === "me" ? "🧑🏾" : SW_WHO.find(x => x[0] === st.who)?.[2] ?? "";
  return (
    <div className="sw-scene" style={{ ["--sw-sky" as string]: w.sky, ["--sw-ground" as string]: w.ground }} aria-hidden="true">
      <span className="sw-props">{w.props.map(e => <span key={e}>{e}</span>)}</span>
      <span className="sw-who"><span className="sw-emoji" style={{ fontSize: "59px" }}>{pic}</span>{feel ? <span className="sw-feel">{feel[1]}</span> : null}</span>
      {p.event ? <span className="sw-event">{p.event[0]}</span> : null}
      {p.pic ? <img className="sw-drawing" src={p.pic} alt="" /> : null}
    </div>
  );
}

function StoryPage({ run, st, i, acted, onSet, used, onAct, onDraw, onPrev, onNext, onSkip }: { run: LabRun; st: Story; i: number; acted: boolean; onSet: (p: Partial<Page>) => void; used: (m: string) => void; onAct: () => void; onDraw: () => void; onPrev: () => void; onNext: () => void; onSkip: () => void }) {
  const voice = useVoice(), p = st.pages[i] ?? {}, opts = SW_PROBLEMS[st.problem!]!.steps[i]!;
  const [typing, setTyping] = useState(false), [draft, setDraft] = useState(p.words ?? ""), [asking, setAsking] = useState(false), [listening, setListening] = useState(false);
  const listen = async () => {
    const engine = voice.engine; if (!engine || !(await engine.permit())) return;
    setListening(true); run.say("Listening. Say your words now.");
    try { const heard = await engine.listen({ lang: voice.lang }); if (heard.text) { onSet({ words: heard.text }); used("spoke"); } } catch { /* typing and drawing still work */ } finally { setListening(false); }
  };
  return (
    <section className="card">
      <LabHead run={run} step={`${SW_STAGES[i]} · page ${i + 1} of 3`} />
      <h2>{SW_STAGES[i]}: what happens?</h2>
      <Scene run={run} st={st} p={p} />
      <div className="choices">{opts.map(([pic, t]) => <button key={t} className="choice" aria-pressed={p.event?.[1] === t} onClick={() => { onSet({ event: [pic, t] }); onAct(); used("chose"); }}><span className="opt-pic" aria-hidden="true">{pic}</span><span className="lbl">{fillWho(t, st.whoName)}</span></button>)}</div>
      <h3>How does {st.whoName} feel?</h3>
      <div className="choices sw-feels">{SW_FEEL.map(([id, e, l]) => <button key={id} className="choice" aria-pressed={p.feeling === id} onClick={() => onSet({ feeling: id })}><Icon e={e} /><span className="lbl">{l}</span></button>)}</div>
      <h3>Add your own words or picture <span className="muted">(if you like)</span></h3>
      {p.words ? <p className="sw-words">"{p.words}"</p> : null}{p.pic ? <p className="muted">Your drawing is on this page.</p> : null}
      {typing ? <><label htmlFor="swType" className="sw-type">Your words<textarea id="swType" rows={3} maxLength={300} value={draft} onChange={e => setDraft(e.target.value)} autoFocus /></label>
        <div className="row"><button className="btn" onClick={() => { if (draft.trim()) { onSet({ words: draft.trim() }); used("typed"); } setTyping(false); }}>Keep my words</button></div></> : null}
      <div className="row">
        <button className="btn" onClick={() => setTyping(true)}><Icon e="⌨️" /><span>Type</span></button>
        <button className="btn" onClick={onDraw}><Icon e="🎨" /><span>Draw</span></button>
        {voice.engine ? <button className="btn" aria-pressed={listening} onClick={() => (voice.consent ? void listen() : setAsking(true))}><Icon e="🎤" /><span>{listening ? "Listening…" : "Say it"}</span></button> : null}
      </div>
      {asking ? <VoiceConsent onAgree={() => { voice.agree(); setAsking(false); void listen(); }} onCancel={() => setAsking(false)} /> : null}
      <Think run={run} acted={acted} />
      <div className="row">
        <button className="btn primary" disabled={!p.event} onClick={onNext}>{i < 2 ? "Next page" : "Finish my story"}</button>
        {i > 0 ? <button className="btn" onClick={onPrev}>Back a page</button> : null}
        <button className="btn quiet" onClick={onSkip}>Move on without a story</button>
      </div>
    </section>
  );
}

// Older learners: another character's point of view, and what the story teaches.
function Perspective({ run, st, onDone }: { run: LabRun; st: Story; onDone: (other: { name: string; feel: string }, lesson: number | undefined) => void }) {
  const others: [string, string, string][] = [...SW_WHO.filter(w => w[0] !== st.who && w[0] !== "me"), ["friend", "A friend", "🧒🏾"]];
  const [other, setOther] = useState<string | null>(null), [feel, setFeel] = useState<string | null>(null), [lesson, setLesson] = useState<number | undefined>(undefined);
  return (
    <section className="card">
      <LabHead run={run} step="Another point of view" /><h2>Someone else was there too</h2>
      <h3>Who?</h3><div className="choices">{others.map(([id, l, p]) => <button key={id} className="choice" aria-pressed={other === id} onClick={() => setOther(id)}><span className="opt-pic" aria-hidden="true">{p}</span><span className="lbl">{l}</span></button>)}</div>
      <h3>How did they feel?</h3><div className="choices sw-feels">{SW_FEEL.map(([id, e, l]) => <button key={id} className="choice" aria-pressed={feel === id} onClick={() => setFeel(id)}><Icon e={e} /><span className="lbl">{l}</span></button>)}</div>
      <h3>What does your story teach?</h3><div className="choices">{SW_LESSONS.map((l, k) => <button key={l} className="choice" aria-pressed={lesson === k} onClick={() => setLesson(k)}><span className="lbl">{l}</span></button>)}</div>
      <div className="row"><button className="btn primary" disabled={!other || !feel} onClick={() => onDone({ name: others.find(o => o[0] === other)![1].split(",")[0]!, feel: feel! }, lesson)}>Next</button></div>
    </section>
  );
}

function Title({ run, st, onDone, onSkip }: { run: LabRun; st: Story; onDone: (title: string, typed: boolean) => void; onSkip: () => void }) {
  const ideas = [`${st.whoName} Saves the Day`, "The Big Adventure", `A Day ${SW_WHERE.find(w => w.id === st.where)!.label}`];
  const [own, setOwn] = useState("");
  return (
    <section className="card">
      <LabHead run={run} step="Make your story" /><h2>Give your story a title</h2>
      <div className="choices">{ideas.map(t => <button key={t} className="choice" onClick={() => onDone(t, false)}><span className="opt-pic" aria-hidden="true">📖</span><span className="lbl">{t}</span></button>)}</div>
      <label htmlFor="swTitle" className="sw-type">Or type your own title<input id="swTitle" maxLength={60} value={own} onChange={e => setOwn(e.target.value)} /></label>
      <div className="row"><button className="btn" disabled={!own.trim()} onClick={() => onDone(own.trim(), true)}>Use my title</button></div>
      <div className="row"><button className="btn quiet" onClick={onSkip}>Move on without a story</button></div>
    </section>
  );
}
