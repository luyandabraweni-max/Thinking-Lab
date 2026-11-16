// Recorded voice clips (a natural human-like voice), keyed by the exact line said; the device's voice reads anything
// without a recording. Lists come from tools/export-clips.mjs and load when needed: "common" at the start, then each
// lesson's own list when it opens.

const clips = new Map<string, string>(), loaded = new Set<string>();
let base = "clips/";
/** Where the clip lists and audio are served from (the app's own folder by default). */
export function setClipBase(url: string) { base = url.endsWith("/") ? url : `${url}/`; }
/** Adds clips directly (tests, or lists bundled another way). */
export function addClips(list: Record<string, string>) { for (const [t, u] of Object.entries(list)) clips.set(t, u); }
/** Loads one list of clips. Missing lists (offline, or a lesson without recordings) are fine: the device voice reads. */
export async function loadClips(name: string) {
  if (loaded.has(name)) return;
  loaded.add(name);
  try {
    const res = await fetch(`${base}${name}.json`);
    if (!res.ok) return;
    for (const [t, f] of Object.entries((await res.json()) as Record<string, string>)) clips.set(t, `${base}audio/${f}`);
  } catch { loaded.delete(name); }
}

export interface SpeechPart { text: string; clip?: string }
/** The recording for a line, also when the app adds a full stop the recording didn't have ("Not sure." / "Not sure"). */
const clipFor = (k: string) => clips.get(k) ?? (/[.]$/.test(k) ? clips.get(k.slice(0, -1)) : clips.get(`${k}.`));
const sentences = (text: string) => text.match(/[^.!?]+[.!?]*["')\]]*\s*/g)?.map(s => s.trim()).filter(Boolean) ?? [text];
/**
 * How to say a text: a recording for every run of sentences that has one (the longest first), and the device voice for
 * the rest, joined so it reads naturally.
 */
export function planSpeech(text: string): SpeechPart[] {
  const t = text.trim();
  if (!t) return [];
  if (clipFor(t)) return [{ text: t, clip: clipFor(t)! }];
  const s = sentences(t), out: SpeechPart[] = [];
  for (let i = 0; i < s.length;) {
    let j = s.length;
    for (; j > i; j--) { const k = s.slice(i, j).join(" "), c = clipFor(k); if (c) { out.push({ text: k, clip: c }); break; } }
    if (j > i) { i = j; continue; }
    const last = out[out.length - 1];
    if (last && !last.clip) last.text += ` ${s[i]}`; else out.push({ text: s[i]! });
    i++;
  }
  return out;
}
