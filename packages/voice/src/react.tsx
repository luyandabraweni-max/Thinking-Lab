import { Button, Field, Notice } from "@tl/ui";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { pickEngine, speak, type SpeechEngine } from "./engines";
import { command, digits, forField, soundAlikes, type FieldKind } from "./parse";

// Speaking instead of typing, for any form. Typing always works too: voice is an extra way in, never the only one.

const CONSENT_KEY = "tl-voice-consent";
const readConsent = () => { try { return localStorage.getItem(CONSENT_KEY) === "yes"; } catch { return false; } };
const writeConsent = (ok: boolean) => { try { if (ok) localStorage.setItem(CONSENT_KEY, "yes"); else localStorage.removeItem(CONSENT_KEY); } catch { /* private window: ask again next time */ } };

interface Voice { engine: SpeechEngine | null; consent: boolean; agree(): void; withdraw(): void; lang: string; say(text: string): Promise<void> }
const VoiceContext = createContext<Voice>({ engine: null, consent: false, agree() {}, withdraw() {}, lang: "en-ZA", say: async () => {} });
export const useVoice = () => useContext(VoiceContext);

/** Finds the device's speech engine once. Tests pass their own engine and voice. */
export function VoiceProvider({ children, engine, lang = "en-ZA", say = speak }: { children: ReactNode; engine?: SpeechEngine | null; lang?: string; say?: (text: string, lang?: string) => Promise<void> }) {
  const [found, setFound] = useState<SpeechEngine | null>(engine ?? null);
  const [consent, setConsent] = useState(readConsent);
  useEffect(() => { if (engine === undefined) void pickEngine().then(setFound); }, [engine]);
  const value = useMemo<Voice>(() => ({
    engine: found, consent, lang, say: t => say(t, lang),
    agree() { writeConsent(true); setConsent(true); }, withdraw() { writeConsent(false); setConsent(false); }
  }), [found, consent, lang, say]);
  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
}

/** Before the first use on a device: what happens to the sound, and a clear choice. */
export function VoiceConsent({ onAgree, onCancel }: { onAgree: () => void; onCancel: () => void }) {
  const { engine } = useVoice();
  return (
    <Notice tone="warn">
      <div className="tl-stack">
        <p><b>Before you speak:</b> {engine?.sendsAudioAway
          ? "this browser sends what you say to Google or Apple to turn it into words. They don't keep it for Thinking Lab, but it does leave this device."
          : "your phone turns what you say into words. Some older phones use their maker's online service to do this."}</p>
        <p>You can always type instead. You can change your mind later in settings.</p>
        <div className="tl-row"><Button variant="primary" onClick={onAgree}>Agree and speak</Button><Button onClick={onCancel}>Type instead</Button></div>
      </div>
    </Notice>
  );
}

/** A checked number: "15 mg" could be "50 mg" misheard, so the person confirms which one they meant. */
function SoundAlikeCheck({ value, onPick }: { value: string; onPick: (v: string) => void }) {
  const pair = soundAlikes(value)[0];
  if (!pair) return null;
  const [heard, other] = pair;
  return (
    <Notice tone="warn">
      <p><b>Please check the number.</b> {heard} and {other} sound alike. Which did you mean?</p>
      <div className="tl-row">
        <Button small aria-pressed="true" onClick={() => onPick(value)}>{heard} ({digits(heard)})</Button>
        <Button small onClick={() => onPick(value.replace(new RegExp(`\\b${heard}\\b`), String(other)))}>{other} ({digits(other)})</Button>
      </div>
    </Notice>
  );
}

export interface VoiceFieldProps { label: string; value: string; onChange: (v: string) => void; kind?: FieldKind; hint?: string; error?: string; required?: boolean }
/** A text field with a microphone button next to it. */
export function VoiceField({ label, value, onChange, kind = "text", hint, error, required }: VoiceFieldProps) {
  const voice = useVoice();
  const [state, setState] = useState<"idle" | "asking" | "listening">("idle");
  const [note, setNote] = useState("");
  const [checked, setChecked] = useState(true);
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);

  const listen = useCallback(async () => {
    if (!voice.engine) return;
    if (!(await voice.engine.permit())) { setNote("The microphone isn't allowed on this device. You can type instead."); return; }
    abort.current = new AbortController();
    setState("listening"); setNote("");
    try {
      const heard = await voice.engine.listen({ lang: voice.lang, signal: abort.current.signal });
      const cmd = command(heard.text);
      if (!heard.text) setNote("I didn't hear anything. Press the microphone and try again.");
      else if (cmd === "clear") { onChange(""); setNote("Cleared."); }
      else {
        const v = forField(kind, heard.text);
        onChange(kind === "long" && value ? `${value} ${v}` : v);
        setChecked(soundAlikes(v).length === 0);
        setNote(`Heard: "${heard.text}"`);
      }
    } catch (e) { setNote((e as Error).message); }
    finally { setState("idle"); }
  }, [voice, kind, onChange, value]);

  const mic = voice.engine ? (id: string) => (
    <Button className="tl-mic" aria-pressed={state === "listening"} aria-describedby={id}
      aria-label={state === "listening" ? `Stop listening` : `Speak instead of typing: ${label}`}
      onClick={() => state === "listening" ? abort.current?.abort() : voice.consent ? void listen() : setState("asking")}>
      <span aria-hidden="true">🎤</span>{state === "listening" ? "Stop" : "Speak"}
    </Button>) : undefined;

  return (
    <div className="tl-stack">
      <Field label={label} value={value} onChange={v => { onChange(v); setChecked(true); }} hint={hint} error={error} required={required}
        multiline={kind === "long"} extra={mic}
        status={<p role="status" className="tl-muted">{state === "listening" ? <span className="tl-listening">Listening. Say the {label.toLowerCase()}.</span> : note}</p>} />
      {state === "asking" ? <VoiceConsent onAgree={() => { voice.agree(); void listen(); }} onCancel={() => setState("idle")} /> : null}
      {kind === "dose" && !checked ? <SoundAlikeCheck value={value} onPick={v => { onChange(v); setChecked(true); }} /> : null}
    </div>
  );
}

export interface VoiceFormField { key: string; label: string; question: string; kind?: FieldKind; required?: boolean }
/**
 * Fill a whole form by speaking: each question is read aloud, the answer is read back for a yes or no,
 * and nothing is saved until the person says "save" (or presses Save). Commands: next, back, repeat, clear, stop, save.
 */
export function VoiceFormGuide({ fields, values, onChange, onSave }: { fields: VoiceFormField[]; values: Record<string, string>; onChange: (key: string, v: string) => void; onSave: (values: Record<string, string>) => void }) {
  const voice = useVoice();
  const [running, setRunning] = useState(false), [asking, setAsking] = useState(false), [line, setLine] = useState("");
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);
  if (!voice.engine) return null;

  const run = async () => {
    const engine = voice.engine!;
    if (!(await engine.permit())) { setLine("The microphone isn't allowed on this device. You can type instead."); return; }
    const ctl = (abort.current = new AbortController());
    const vals = { ...values };
    const tell = async (t: string) => { setLine(t); await voice.say(t); };
    const hear = async () => (await engine.listen({ lang: voice.lang, signal: ctl.signal })).text;
    setRunning(true);
    try {
      let i = 0;
      while (i < fields.length && !ctl.signal.aborted) {
        const f = fields[i]!;
        await tell(f.question + (vals[f.key] ? ` It says ${vals[f.key]} now. Say a new answer, or say next.` : ""));
        const said = await hear(), cmd = command(said);
        if (ctl.signal.aborted || cmd === "stop") break;
        if (!said) { await tell("I didn't hear anything."); continue; }
        if (cmd === "next" || cmd === "yes") { i++; continue; }
        if (cmd === "back") { i = Math.max(0, i - 1); continue; }
        if (cmd === "repeat") continue;
        if (cmd === "clear") { vals[f.key] = ""; onChange(f.key, ""); continue; }
        if (cmd === "save") break;
        const v = forField(f.kind ?? "text", said);
        vals[f.key] = v; onChange(f.key, v);
        const alike = f.kind === "dose" ? soundAlikes(v)[0] : undefined;
        await tell(`I heard: ${v}.${alike ? ` That's ${digits(alike[0])}, not ${digits(alike[1])}.` : ""} Is that right?`);
        const check = command(await hear());
        if (check === "yes" || check === "next") i++;
        else if (check === "stop") break;
        // anything else: ask the same question again
      }
      if (!ctl.signal.aborted) {
        const missing = fields.filter(f => f.required && !vals[f.key]?.trim());
        if (missing.length) await tell(`Still needed: ${missing.map(f => f.label).join(", ")}. You can type it or start speaking again.`);
        else {
          await tell("That's everything. Check the form on the screen. Say save to save it, or stop to keep checking.");
          if (command(await hear()) === "save") { onSave(vals); await tell("Saved."); } // the answers just given, not the form as it was when speaking began else setLine("Not saved yet. Press Save when you're ready.");
        }
      }
    } catch (e) { setLine((e as Error).message); }
    finally { setRunning(false); }
  };

  return (
    <div className="tl-stack">
      <div className="tl-row">
        {running
          ? <Button onClick={() => abort.current?.abort()}><span aria-hidden="true">⏹</span>Stop speaking the form</Button>
          : <Button onClick={() => voice.consent ? void run() : setAsking(true)}><span aria-hidden="true">🎤</span>Fill this form by speaking</Button>}
      </div>
      {asking ? <VoiceConsent onAgree={() => { voice.agree(); setAsking(false); void run(); }} onCancel={() => setAsking(false)} /> : null}
      <p role="status" className="tl-muted">{running ? <span className="tl-listening">{line}</span> : line}</p>
      {running ? <p className="tl-muted">You can say: next, back, repeat, clear, stop or save.</p> : null}
    </div>
  );
}
