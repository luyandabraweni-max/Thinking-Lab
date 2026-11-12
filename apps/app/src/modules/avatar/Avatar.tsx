import type { AvatarLook } from "@tl/data";
import { useEffect, useId, useRef, useState } from "react";
import { AV, AV_DRAW, AV_NAME_MAX, AV_SETS, cleanAvatarName, defaultAvatar, describeAvatar, fullAvatar } from "./legacy-avatar.js";

// The learner's character (ported from js/screens/avatar.js). The drawing is the live site's own (legacy-avatar.js,
// generated); this file is the React side: the picture, the waving stage, and the builder.

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
interface PictureOpts { size?: number; label?: string; decorative?: boolean; full?: boolean; calm?: boolean }

/** The character as an SVG string. Only option names and numbers go into the drawing; the name only into the label. */
export function avatarSvg(look: Partial<AvatarLook> | null | undefined, id: string, o: PictureOpts = {}) {
  const a = fullAvatar(look), size = o.size ?? 160, clip = `av${id.replace(/[^a-zA-Z0-9]/g, "")}c`;
  const label = o.label ?? `${a.name}, your character. ${describeAvatar(a)}`;
  return `<svg class="av3d${o.full ? " av-full" : ""}" width="${size}" height="${size}" viewBox="0 0 200 200" ${o.decorative ? 'aria-hidden="true" focusable="false"' : `role="img" aria-label="${esc(label)}"`}>`
    + `<defs><clipPath id="${clip}"><rect x="2.5" y="2.5" width="195" height="195" rx="22"/></clipPath></defs>`
    + `<g clip-path="url(#${clip})">${AV_DRAW.scene(a, !!o.full, !!o.calm)}</g>`
    + `<rect x="2.5" y="2.5" width="195" height="195" rx="22" fill="none" stroke="#FFF3DC" stroke-width="5"/></svg>`;
}

export function AvatarPicture({ look, ...o }: PictureOpts & { look: Partial<AvatarLook> | null | undefined }) {
  const id = useId();
  return <span className="av-pic" style={{ display: "inline-flex" }} dangerouslySetInnerHTML={{ __html: avatarSvg(look, id, o) }} />;
}

/** The character on the learner's home: tap it and it waves and says its name. */
export function AvatarStage({ look, size = 140, calm, say }: { look: AvatarLook; size?: number; calm?: boolean; say: (t: string) => void }) {
  const [waving, setWaving] = useState(0), [bubble, setBubble] = useState("");
  const name = look.name.trim() || defaultAvatar().name, box = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!waving) return;
    const svg = box.current?.querySelector("svg");
    svg?.classList.add("av-waving", "av-talking");
    const t1 = setTimeout(() => svg?.classList.remove("av-talking"), 1800), t2 = setTimeout(() => svg?.classList.remove("av-waving"), 2700), t3 = setTimeout(() => setBubble(""), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); svg?.classList.remove("av-waving", "av-talking"); };
  }, [waving]);
  const hello = () => { const t = `Hi, I'm ${name}!`; setBubble(t); say(t); setWaving(w => w + 1); };
  return (
    <div className="av-stage">
      <button className="av-tap" type="button" onClick={hello}><span className="sr">Wave and say hello, {name}</span>
        <span ref={box}><AvatarPicture look={look} size={size} full decorative calm={calm} /></span></button>
      <p className={`av-bubble${bubble ? " show" : ""}`} role="status" aria-live="polite">{bubble}</p>
    </div>);
}

type Key = "base" | "skin" | "hair" | "hairCol" | "eyes" | "extra" | "mouth" | "cloth" | "top" | "prop" | "bg";
const SWATCH = new Set<Key>(["skin", "hairCol", "top", "bg"]);

/** Make or change the character. Nothing is saved until "I like it". */
export function AvatarBuilder({ initial, older, calm, say, onSave, onBack }: { initial?: AvatarLook | null; older: boolean; calm?: boolean; say: (t: string) => void; onSave: (a: AvatarLook) => void; onBack: () => void }) {
  const [a, setA] = useState<AvatarLook>(() => fullAvatar(initial));
  useEffect(() => { say(older ? "Design your character. Choose how they look and give them a name. You can change it any time." : "Make your own character. Choose how they look and give them a name. You can change it any time."); }, [older, say]);
  const set = (patch: Partial<AvatarLook>) => setA(x => fullAvatar({ ...x, ...patch }));
  const person = a.base === "person";
  const group = (key: Key, title: string, list: [string, string][]) => (
    <fieldset className="av-group" style={{ border: 0, padding: 0, margin: 0 }}><legend className="eyebrow">{title}</legend>
      <div className="choices av-choices">{list.map((it, i) => {
        const v = SWATCH.has(key) ? i : it[0], on = a[key] === v;
        return <button key={it[0] + i} className="choice" aria-pressed={on} onClick={() => set({ [key]: v } as Partial<AvatarLook>)}>
          {SWATCH.has(key) ? <span className="swatch" style={{ background: it[0] }} aria-hidden="true" /> : null}<span className="lbl">{it[1]}</span></button>;
      })}</div></fieldset>);
  const surprise = () => {
    const n = (l: unknown[]) => Math.floor(Math.random() * l.length), pick = (l: [string, string][]) => l[n(l)]![0];
    set({ skin: n(AV.skin), hair: pick(AV.hair), hairCol: n(AV.hairCol), eyes: pick(AV.eyes), mouth: pick(AV.mouth), cloth: pick(AV.cloth), prop: pick(AV.prop), top: n(AV.top), bg: n(AV.bg) });
  };
  return (
    <section className="card av-card">
      <p className="eyebrow">My character</p>
      <h1>{older ? "Design your character" : "Make your character"}</h1>
      <div className="av-layout">
        <div className="av-preview">
          <AvatarStage look={a} size={220} calm={calm} say={say} />
          <p className="lead av-name">{a.name.trim() || defaultAvatar().name}</p>
          <p className="note av-tip">Tap your character to make it wave.</p>
        </div>
        <div className="av-options">
          <div className="av-namebox">
            <label className="eyebrow" htmlFor="avNameInput">Name for your character</label>
            <input id="avNameInput" className="av-name-input" type="text" maxLength={AV_NAME_MAX} autoComplete="off" spellCheck={false} autoCapitalize="words" value={a.name}
              aria-describedby="avNameNote" onChange={e => setA(x => ({ ...x, name: cleanAvatarName(e.target.value) }))} />
            <p className="note" id="avNameNote">{older ? "Use a nickname, not your full real name." : "Make up a name. Don't use your real full name."}</p>
            <div className="choices av-choices av-namechips">{AV.names.map(n => <button key={n} className="choice" aria-pressed={a.name === n} onClick={() => setA(x => ({ ...x, name: n }))}><span className="lbl">{n}</span></button>)}</div>
          </div>
          <div><p className="eyebrow">Start from a character</p>
            <div className="av-sets">{AV_SETS.map(([t, c]) => <button key={t} className="av-set" type="button" onClick={() => set({ base: "person", ...c })}>
              <AvatarPicture look={c} size={64} decorative /><span>{t}</span><span className="sr">: {describeAvatar(c)}</span></button>)}</div></div>
          {group("base", "Character", [["person", "Person"], ["robot", "Robot"]])}
          {person ? <>{group("skin", "Skin tone", AV.skin)}{group("hair", "Hair or head covering", AV.hair)}
            {["doek", "hijab", "none"].includes(a.hair) ? null : group("hairCol", "Hair colour", AV.hairCol)}
            {group("eyes", "Eyes", AV.eyes)}{group("extra", "Extras", AV.extra)}{group("mouth", "Expression", AV.mouth)}</> : null}
          {group("cloth", "Clothes", AV.cloth)}
          {group("top", person ? "Clothes colour" : "Robot colour", AV.top)}
          {group("prop", "Holding", AV.prop)}
          {group("bg", "Background", AV.bg)}
        </div>
      </div>
      <div className="row">
        <button className="btn primary" autoFocus onClick={() => onSave({ ...a, name: a.name.trim() || defaultAvatar().name })}>{older ? "Save my character" : "I like it"}</button>
        <button className="btn" onClick={surprise}>Surprise me</button>
        <button className="btn quiet" onClick={onBack}>Back</button>
      </div>
    </section>);
}
