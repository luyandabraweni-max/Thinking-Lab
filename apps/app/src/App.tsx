import type { Account, Learner } from "@tl/data";
import { applyTextSize, Button, Logo, type TextSize } from "@tl/ui";
import type { SpeechEngine } from "@tl/voice";
import { VoiceProvider } from "@tl/voice/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SetPassword, SignIn } from "./modules/auth";
import { LearnerHome } from "./modules/learner";
import { HandOver, LearnerPage, TeamHome } from "./modules/team";
import { ServicesProvider, WhoContext, type DeviceLearner, type Services } from "./platform";

// The shell: which module is on screen. Modules talk to each other only through the props passed here.
type View = { at: "front" } | { at: "home" } | { at: "learner"; id: string } | { at: "handover"; learner: Learner } | { at: "space"; learner: DeviceLearner };

/** `voice` lets tests use a scripted microphone; the app finds the device's own. */
export function App({ services, voice }: { services: Services; voice?: { engine: SpeechEngine | null; say: (t: string) => Promise<void> } }) {
  const [me, setMe] = useState<Account | null>(null), [view, setView] = useState<View>({ at: "front" });
  const [registering, setRegistering] = useState(false), [problem, setProblem] = useState(() => services.auth.linkProblem() ?? ""), [pw, setPw] = useState<"ask" | "change" | null>(null);
  const signedInRef = useRef(false);
  const signedIn = (a: Account) => { signedInRef.current = true; setMe(a); setRegistering(false); setView({ at: "home" }); void services.auth.needsPassword().then(n => setPw(n ? "ask" : null), () => {}); };
  // Opening the app from the sign-in link in an email: the person is already signed in. Until that's checked, the app
  // says so, rather than showing the sign-in form. A link opened in another tab signs this tab in too.
  const [starting, setStarting] = useState(true);
  useEffect(() => {
    let live = true;
    const check = () => services.auth.session()
      .then(s => { if (!live) return; if (s === "new") setRegistering(true); else if (s) signedIn(s); }, (e: Error) => { if (live) setProblem(e.message); })
      .finally(() => { if (live) setStarting(false); });
    void check();
    const stop = services.auth.watch?.(() => { if (!signedInRef.current) void check(); }); // only when nobody is signed in here yet
    return () => { live = false; stop?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, when the app opens
  }, [services]);
  // Adults choose their own text size on this device; a learner's My way choice applies while the learner is here.
  const [size, setSize] = useState<TextSize>(() => { try { return (localStorage.getItem("text-size") as TextSize | null) ?? "normal"; } catch { return "normal"; } });
  useEffect(() => { if (view.at !== "space") applyTextSize(size); }, [size, view.at]);
  const chooseSize = (s: TextSize) => { setSize(s); try { localStorage.setItem("text-size", s); } catch { /* private mode: this visit only */ } };
  const signOut = async (next: View = { at: "front" }) => { await services.auth.signOut(); signedInRef.current = false; setMe(null); setRegistering(false); setPw(null); setView(next); };
  return (
    <ServicesProvider services={services}>
      <VoiceProvider {...(voice ?? {})}>
        <WhoContext.Provider value={{ me, setMe }}>
          <a className="tl-visually-hidden" href="#main">Skip to content</a>
          {view.at !== "space" ? <header className="tl-topbar">
            <div className="tl-topbar-inner">
              <span className="tl-brand"><Logo /><span>Thinking Lab</span></span>
              <div className="tl-row" style={{ gap: 8 }}>
                <span className={me ? "tl-wide-only" : undefined}><TextSizePicker size={size} onChange={chooseSize} /></span>
                {me ? <AccountMenu me={me} onPassword={() => setPw("change")} onSignOut={() => void signOut()} sizePicker={<span className="tl-narrow-only"><TextSizePicker size={size} onChange={chooseSize} /></span>} /> : null}
              </div>
            </div>
          </header> : null}
          <main id="main" className="tl-page">
            {problem ? <div className="tl-error" role="alert"><p>{problem}</p><Button small onClick={() => setProblem("")}>OK</Button></div> : null}
            {me && pw && view.at !== "space" ? <SetPassword change={pw === "change"} onDone={() => setPw(null)} /> : null}
            {starting && !me ? <section className="card"><p role="status">Signing you in…</p></section>
              : view.at === "space" ? <LearnerHome learner={view.learner} onDone={() => setView({ at: "front" })} />
              : !me ? <SignIn key={String(registering)} registering={registering} onAdult={signedIn} onLearner={l => setView({ at: "space", learner: l })} />
              : view.at === "learner" ? <LearnerPage me={me} learnerId={view.id} onBack={() => setView({ at: "home" })} />
              : view.at === "handover" ? <HandOver me={me} learner={view.learner} onStart={l => void signOut({ at: "space", learner: l })} onBack={() => setView({ at: "home" })} />
              : <TeamHome me={me} onOpen={id => setView({ at: "learner", id })} onHandOver={learner => setView({ at: "handover", learner })} />}
          </main>
        </WhoContext.Provider>
      </VoiceProvider>
    </ServicesProvider>
  );
}
const ROLE_NAME: Record<Account["role"], string> = { guardian: "Parent or guardian", teacher: "Teacher", specialist: "Specialist", site_admin: "Site admin", org_admin: "School admin" };

/** The signed-in adult: their name and role, changing the password, and signing out. */
function AccountMenu({ me, onPassword, onSignOut, sizePicker }: { me: Account; onPassword: () => void; onSignOut: () => void; sizePicker: ReactNode }) {
  return (
    <details className="tl-menu">
      <summary aria-label={`${me.name}, ${ROLE_NAME[me.role]}: account menu`}><span className="tl-initial" aria-hidden="true">{me.name.trim().charAt(0).toUpperCase() || "?"}</span><span className="tl-hide-small">{me.name}</span></summary>
      <div className="tl-menu-panel">
        <p style={{ padding: "4px 8px" }}><b>{me.name}</b><br /><span className="tl-muted">{ROLE_NAME[me.role]}</span></p>
        {sizePicker}
        <Button small variant="quiet" onClick={e => { e.currentTarget.closest("details")?.removeAttribute("open"); onPassword(); }}><span aria-hidden="true">🔑</span>Password</Button>
        <Button small variant="quiet" onClick={onSignOut}><span aria-hidden="true">👋</span>Sign out</Button>
      </div>
    </details>
  );
}

/** Three letter buttons, small to big. Each says what it does to a screen reader. */
function TextSizePicker({ size, onChange }: { size: TextSize; onChange: (s: TextSize) => void }) {
  const opts: [TextSize, string, string][] = [["normal", "Usual", "0.9rem"], ["large", "Bigger", "1.1rem"], ["larger", "Biggest", "1.35rem"]];
  return (
    <div className="tl-row" role="group" aria-label="Text size" style={{ gap: 2 }}>
      {opts.map(([k, name, fs]) => <Button key={k} small variant="quiet" aria-pressed={size === k} aria-label={`${name} text`} onClick={() => onChange(k)} style={{ fontSize: fs, minWidth: 40, textDecoration: "none" }}>A</Button>)}
    </div>
  );
}
