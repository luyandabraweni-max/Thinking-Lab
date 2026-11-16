import { Capacitor } from "@capacitor/core";
import { planSpeech } from "./clips";
import { SpeechRecognition as NativeSpeech } from "@capacitor-community/speech-recognition";

// One way to listen, whatever the device. In a browser: the Web Speech API (Chrome, Edge and Safari send the sound to
// Google or Apple to turn it into words). In the iOS and Android apps: the phone's own speech recognition, through the
// Capacitor plugin, which on newer phones works on the device itself.

export interface Heard { text: string; alternatives: string[] }
export interface ListenOptions { lang?: string; signal?: AbortSignal; maxMs?: number }
export interface SpeechEngine {
  readonly kind: "web" | "native";
  /** Whether this device can listen at all. */
  available(): Promise<boolean>;
  /** Asks for the microphone (and, on phones, speech recognition) if not yet allowed. */
  permit(): Promise<boolean>;
  /** Listens for one thing said. Resolves with "" if nothing was heard. */
  listen(opts?: ListenOptions): Promise<Heard>;
  /** Whether the sound leaves the device (shown to the person before they agree). */
  readonly sendsAudioAway: boolean;
}

export const LANGUAGES = [["en-ZA", "English (South Africa)"], ["af-ZA", "Afrikaans"], ["zu-ZA", "isiZulu"], ["xh-ZA", "isiXhosa"]] as const;
const DEFAULT_LANG = "en-ZA";

// ---------- Browser ----------
interface WebRecognition extends EventTarget {
  lang: string; interimResults: boolean; maxAlternatives: number; continuous: boolean;
  start(): void; abort(): void; stop(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}
type RecognitionCtor = new () => WebRecognition;
const webCtor = (): RecognitionCtor | undefined => {
  const w = globalThis as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

export class WebSpeechEngine implements SpeechEngine {
  readonly kind = "web";
  readonly sendsAudioAway = true;
  async available() { return !!webCtor(); }
  async permit() { return !!webCtor(); } // the browser asks for the microphone the first time it listens
  listen({ lang = DEFAULT_LANG, signal, maxMs = 15000 }: ListenOptions = {}): Promise<Heard> {
    const Ctor = webCtor();
    if (!Ctor) return Promise.reject(new Error("Speaking isn't available in this browser."));
    return new Promise((resolve, reject) => {
      const r = new Ctor();
      let heard: Heard = { text: "", alternatives: [] }, failed: string | null = null;
      r.lang = lang; r.interimResults = false; r.maxAlternatives = 3; r.continuous = false;
      r.onresult = e => {
        const alts = Array.from(e.results[0] ?? [], a => a.transcript.trim()).filter(Boolean);
        heard = { text: alts[0] ?? "", alternatives: alts.slice(1) };
      };
      r.onerror = e => { if (e.error !== "no-speech" && e.error !== "aborted") failed = e.error; };
      const timer = setTimeout(() => r.stop(), maxMs);
      r.onend = () => { clearTimeout(timer); if (failed) reject(new Error(errorText(failed))); else resolve(heard); };
      signal?.addEventListener("abort", () => r.abort(), { once: true });
      r.start();
    });
  }
}
const errorText = (code: string) => code === "not-allowed" || code === "service-not-allowed"
  ? "The microphone isn't allowed. You can allow it in the browser's site settings."
  : code === "network" ? "Speaking needs an internet connection in this browser." : "Something went wrong while listening. Please try again.";

// ---------- iOS and Android apps ----------
export class NativeSpeechEngine implements SpeechEngine {
  readonly kind = "native";
  readonly sendsAudioAway = false; // the phone may still use its maker's service on older models; the app store labels say so
  async available() { try { return (await NativeSpeech.available()).available; } catch { return false; } }
  async permit() {
    const now = await NativeSpeech.checkPermissions();
    if (now.speechRecognition === "granted") return true;
    return (await NativeSpeech.requestPermissions()).speechRecognition === "granted";
  }
  async listen({ lang = DEFAULT_LANG, signal, maxMs = 15000 }: ListenOptions = {}): Promise<Heard> {
    let latest: string[] = [], quiet: ReturnType<typeof setTimeout> | undefined;
    const done = new Promise<void>(resolve => {
      const finish = () => { clearTimeout(quiet); clearTimeout(cap); void NativeSpeech.stop().catch(() => {}); resolve(); };
      const cap = setTimeout(finish, maxMs);
      void NativeSpeech.addListener("partialResults", d => { latest = d.matches ?? []; clearTimeout(quiet); quiet = setTimeout(finish, 1500); }); // stop after 1.5 s of quiet
      void NativeSpeech.addListener("listeningState", d => { if (d.status === "stopped") finish(); });
      signal?.addEventListener("abort", finish, { once: true });
    });
    await NativeSpeech.start({ language: lang, maxResults: 3, partialResults: true, popup: false });
    await done;
    await NativeSpeech.removeAllListeners();
    const alts = latest.map(s => s.trim()).filter(Boolean);
    return { text: alts[0] ?? "", alternatives: alts.slice(1) };
  }
}

/** The right engine for this device, or null when it can't listen (then typing is the only way, as always). */
export async function pickEngine(): Promise<SpeechEngine | null> {
  const engine: SpeechEngine = Capacitor.isNativePlatform() ? new NativeSpeechEngine() : new WebSpeechEngine();
  return (await engine.available()) ? engine : null;
}

/** Reads text aloud: recorded clips where there are some (clips.ts), the device's own voice for the rest. */
let speaking = 0, audio: HTMLAudioElement | null = null;
export async function speak(text: string, lang = DEFAULT_LANG, rate = 0.95): Promise<void> {
  stopSpeaking();
  const me = ++speaking;
  for (const part of planSpeech(text)) {
    if (me !== speaking) return;
    if (part.clip && (await playClip(part.clip, rate))) continue;
    if (me !== speaking) return;
    await deviceVoice(part.text, lang, rate);
  }
}
function playClip(src: string, rate: number): Promise<boolean> {
  return new Promise(resolve => {
    try {
      const a = new Audio(src);
      a.preservesPitch = true; a.playbackRate = Math.max(0.6, Math.min(1.1, rate * 0.95));
      a.onended = () => resolve(true); a.onerror = () => resolve(false);
      audio = a;
      const p = a.play() as Promise<void> | undefined;
      p?.catch(() => resolve(false));
    } catch { resolve(false); }
  });
}
function deviceVoice(text: string, lang: string, rate: number): Promise<void> {
  const synth = (globalThis as { speechSynthesis?: SpeechSynthesis }).speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === "undefined") return Promise.resolve();
  return new Promise(resolve => {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = rate;
    u.onend = () => resolve(); u.onerror = () => resolve();
    synth.speak(u);
  });
}
/** Stops anything being read aloud. */
export function stopSpeaking() {
  speaking++;
  if (audio) { try { audio.pause(); } catch { /* already stopped */ } audio = null; }
  (globalThis as { speechSynthesis?: SpeechSynthesis }).speechSynthesis?.cancel();
}
