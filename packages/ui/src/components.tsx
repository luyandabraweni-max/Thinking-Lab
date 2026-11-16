import { useId, useState, type ButtonHTMLAttributes, type ReactNode } from "react";

// Accessible building blocks. Every display mode comes from tokens.css; components only use the tokens.

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "quiet"; small?: boolean };
export function Button({ variant, small, className = "", type = "button", ...rest }: ButtonProps) {
  const cls = ["tl-btn", variant && `tl-btn--${variant}`, small && "tl-btn--small", className].filter(Boolean).join(" ");
  return <button type={type} className={cls} {...rest} />;
}

export function Card({ children, label, as: Tag = "section" }: { children: ReactNode; label?: string; as?: "section" | "div" | "article" }) {
  return <Tag className="tl-card" aria-label={label}>{children}</Tag>;
}

export function Notice({ children, tone }: { children: ReactNode; tone?: "warn" | "ok" }) {
  return <div className={`tl-notice${tone ? ` tl-notice--${tone}` : ""}`}>{children}</div>;
}

/**
 * Extra explanation, hidden until asked for, so screens stay short. Shows a small "i" (with a label if given); pressing it
 * shows the text below, and pressing again hides it. Use it for hints and background, never for anything safety-critical.
 */
export function More({ children, label, about }: { children: ReactNode; label?: string; about?: string }) {
  const [open, setOpen] = useState(false), id = useId();
  return (
    <div className="tl-more">
      <button type="button" className="tl-more-btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen(o => !o)}
        aria-label={label ? undefined : `More about ${about ?? "this"}`}><span className="tl-more-i" aria-hidden="true">i</span>{label ? <span>{label}</span> : null}</button>
      {open ? <div id={id} className="tl-more-text">{children}</div> : null}
    </div>
  );
}

export interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  multiline?: boolean;
  required?: boolean;
  autoComplete?: string;
  type?: "text" | "password" | "email";
  /** Shown next to the input, for example a microphone button. Gets the input's id. */
  extra?: (inputId: string) => ReactNode;
  /** Shown under the input, for example "Listening" or what was heard. */
  status?: ReactNode;
}
export function Field({ label, value, onChange, hint, error, multiline, required, autoComplete, type = "text", extra, status }: FieldProps) {
  const id = useId(), hintId = `${id}-hint`, errId = `${id}-err`;
  const described = [hint && hintId, error && errId].filter(Boolean).join(" ") || undefined;
  const common = { id, value, required, "aria-invalid": error ? true : undefined, "aria-describedby": described,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value) };
  return (
    <div className="tl-field">
      <label htmlFor={id}>{label}{required ? <span className="tl-req" aria-hidden="true"> *</span> : null}</label>
      {hint ? <p className="tl-hint" id={hintId}>{hint}</p> : null}
      <div className="tl-field-input">
        {multiline ? <textarea {...common} /> : <input type={type} autoComplete={autoComplete} {...common} />}
        {extra?.(id)}
      </div>
      {status}
      {error ? <p className="tl-error" id={errId}>{error}</p> : null}
    </div>
  );
}

export interface Tab { id: string; label: string; icon?: string }
/** "pills" (default), "nav" for a page's main sections (a side menu on wide screens), "underline" for tabs inside a section. */
export function Tabs({ tabs, current, onChange, label, variant = "pills" }: { tabs: Tab[]; current: string; onChange: (id: string) => void; label: string; variant?: "pills" | "nav" | "underline" }) {
  return (
    <div className={`tl-tabs tl-tabs--${variant}`} role="tablist" aria-label={label}>
      {tabs.map(t => (
        <Button key={t.id} small role="tab" id={`tab-${t.id}`} aria-selected={t.id === current} aria-controls={`panel-${t.id}`}
          tabIndex={t.id === current ? 0 : -1} onClick={() => onChange(t.id)}
          onKeyDown={e => {
            const i = tabs.findIndex(x => x.id === current), step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
            if (!step) return;
            e.preventDefault();
            const next = tabs[(i + step + tabs.length) % tabs.length]!;
            onChange(next.id);
            requestAnimationFrame(() => document.getElementById(`tab-${next.id}`)?.focus());
          }}>{t.icon ? <span className="tl-tab-icon" aria-hidden="true">{t.icon}</span> : null}{t.label}</Button>
      ))}
    </div>
  );
}
export function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  return <div role="tabpanel" id={`panel-${id}`} aria-labelledby={`tab-${id}`} className="tl-stack">{children}</div>;
}

/** The Thinking Lab mark: a calm circle with a growing leaf and a spark of thought. */
export function Logo() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="var(--brand-soft)" />
      <path d="M20 31c0-7 1-12 8-17-1 8-4 12-8 13" fill="var(--brand)" />
      <path d="M20 31c0-6-2-10-8-13 1 6 3 9 8 10" fill="var(--leaf, #5E8C68)" />
      <circle cx="27.5" cy="10.5" r="3" fill="var(--sun)" />
      <circle cx="12" cy="12" r="2" fill="var(--accent)" />
    </svg>
  );
}
