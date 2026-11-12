import type { Kv } from "@tl/data";
import { applyPrefs, DEFAULT_PREFS, type Prefs } from "@tl/ui";
import { speak, stopSpeaking } from "@tl/voice";
import { useCallback, useEffect, useState } from "react";
import { startDwell, startScanning } from "./access";

// My way (ported from js/support/my-way.js): how the learner wants things to look and sound. Saved on the device for
// each learner. Age never sets these: the learner, or an adult with them, chooses.

const key = (learnerId: string) => `prefs:${learnerId}`;
export async function loadPrefs(kv: Kv, learnerId: string): Promise<Prefs> {
  try { return { ...DEFAULT_PREFS, ...(JSON.parse((await kv.getMeta(key(learnerId))) ?? "{}") as Partial<Prefs>) }; } catch { return DEFAULT_PREFS; }
}

/** The learner's preferences: loaded, applied to the page, saved on change, and put back when they leave. */
export function usePrefs(kv: Kv, learnerId: string) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  useEffect(() => { void loadPrefs(kv, learnerId).then(setPrefs); }, [kv, learnerId]);
  useEffect(() => { applyPrefs(prefs); }, [prefs]);
  useEffect(() => () => applyPrefs(DEFAULT_PREFS), []); // the next person on a shared device starts fresh
  useEffect(() => (prefs.scan ? startScanning(prefs.scanSpeed) : undefined), [prefs.scan, prefs.scanSpeed]);
  useEffect(() => (prefs.dwell ? startDwell(prefs.dwellSpeed) : undefined), [prefs.dwell, prefs.dwellSpeed]);
  const change = (patch: Partial<Prefs>) => setPrefs(p => { const n = { ...p, ...patch }; void kv.setMeta(key(learnerId), JSON.stringify(n)); return n; });
  return [prefs, change] as const;
}

/** Reads text aloud when the learner wants it, and shows it as a caption when they want captions. */
export function useSay(prefs: Prefs) {
  const [caption, setCaption] = useState("");
  useEffect(() => () => stopSpeaking(), []);
  const say = useCallback((text: string) => {
    if (prefs.captions) setCaption(text);
    if (prefs.speak) void speak(text, "en-ZA", prefs.rate === "slow" ? 0.8 : 0.95).then(() => setCaption(c => (c === text ? "" : c)));
  }, [prefs.captions, prefs.speak, prefs.rate]);
  return { say, caption: prefs.captions ? caption : "" };
}
/** Captions for what is read aloud, along the bottom of the screen. */
export const CaptionBar = ({ text }: { text: string }) => (text ? <div className="captions" role="status" aria-live="polite">{text}</div> : null);

type Choice<K extends keyof Prefs> = [Prefs[K], string];
function Group<K extends keyof Prefs>({ label, k, prefs, change, options }: { label: string; k: K; prefs: Prefs; change: (p: Partial<Prefs>) => void; options: Choice<K>[] }) {
  return (
    <fieldset className="tl-stack" style={{ border: 0, padding: 0, margin: 0 }}>
      <legend className="eyebrow">{label}</legend>
      <div className="choices">{options.map(([v, l]) => <button key={String(v)} className="choice" aria-pressed={prefs[k] === v} onClick={() => change({ [k]: v } as Partial<Prefs>)}><span className="lbl">{l}</span></button>)}</div>
    </fieldset>
  );
}
function Toggle({ k, label, prefs, change }: { k: keyof Prefs; label: string; prefs: Prefs; change: (p: Partial<Prefs>) => void }) {
  return <label className="consent"><input type="checkbox" checked={!!prefs[k]} onChange={e => change({ [k]: e.target.checked } as Partial<Prefs>)} /><span>{label}</span></label>;
}

/** The My way screen. Every change shows straight away. */
export function MyWay({ prefs, change, onDone }: { prefs: Prefs; change: (p: Partial<Prefs>) => void; onDone: () => void }) {
  const t = { prefs, change };
  return (
    <section className="card">
      <p className="eyebrow">My way</p>
      <h1>How I like it</h1>
      <h2>Hearing</h2>
      <Toggle k="speak" label="Read things aloud to me" {...t} />
      <Toggle k="captions" label="Show the words when it talks" {...t} />
      <Group label="Voice speed" k="rate" options={[["normal", "Usual speed"], ["slow", "Slower"]]} {...t} />
      <div className="tl-row"><button className="btn" onClick={() => void speak("This is how I sound.", "en-ZA", prefs.rate === "slow" ? 0.8 : 0.95)}>Try the voice</button></div>
      <h2>Seeing</h2>
      <Group label="Colours" k="theme" options={[["system", "Like my device"], ["light", "Light"], ["dark", "Dark"]]} {...t} />
      <Group label="Colour help" k="palette" options={[["standard", "Usual colours"], ["redgreen", "Red-green safe colours"], ["blueyellow", "Blue-yellow safe colours"]]} {...t} />
      <Toggle k="contrast" label="Strong contrast" {...t} />
      <Toggle k="grey" label="Grey only (no colours)" {...t} />
      <Group label="Text size" k="size" options={[["normal", "Usual"], ["large", "Bigger"], ["larger", "Biggest"]]} {...t} />
      <Group label="Letters" k="font" options={[["atkinson", "Easy-to-read letters"], ["lexend", "Rounder letters"]]} {...t} />
      <Toggle k="spacing" label="More space between letters and lines" {...t} />
      <h2>Feeling calm</h2>
      <Toggle k="calm" label="Calm mode: fewer things on the screen" {...t} />
      <Toggle k="motion" label="No movement" {...t} />
      <h2>Understanding</h2>
      <Toggle k="plain" label="Plain words for tricky phrases" {...t} />
      <Toggle k="pictures" label="Pictures with key words" {...t} />
      <h2>Choosing</h2>
      <Toggle k="scan" label="Switch scanning: the highlight moves by itself, and I press my switch to choose" {...t} />
      {prefs.scan ? <Group label="Scanning speed" k="scanSpeed" options={[["slow", "Slow"], ["medium", "Medium"], ["fast", "Fast"]]} {...t} /> : null}
      <Toggle k="dwell" label="Choose by resting the pointer (for eye-gaze and head pointers)" {...t} />
      {prefs.dwell ? <Group label="How long to rest" k="dwellSpeed" options={[["slow", "Longer"], ["medium", "Medium"], ["fast", "Shorter"]]} {...t} /> : null}
      <p className="note">A switch that sends Space or Enter works with scanning. Touch screens aren't affected by resting: a tap still chooses.</p>
      <div className="row"><button className="btn primary" autoFocus onClick={onDone}>Done</button></div>
    </section>
  );
}
