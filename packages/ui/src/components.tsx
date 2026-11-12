import { useId, type ButtonHTMLAttributes, type ReactNode } from "react";

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

export interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  multiline?: boolean;
  required?: boolean;
  autoComplete?: string;
  /** Shown next to the input, for example a microphone button. Gets the input's id. */
  extra?: (inputId: string) => ReactNode;
  /** Shown under the input, for example "Listening" or what was heard. */
  status?: ReactNode;
}
export function Field({ label, value, onChange, hint, error, multiline, required, autoComplete, extra, status }: FieldProps) {
  const id = useId(), hintId = `${id}-hint`, errId = `${id}-err`;
  const described = [hint && hintId, error && errId].filter(Boolean).join(" ") || undefined;
  const common = { id, value, required, "aria-invalid": error ? true : undefined, "aria-describedby": described,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value) };
  return (
    <div className="tl-field">
      <label htmlFor={id}>{label}{required ? <span className="tl-muted"> (needed)</span> : null}</label>
      {hint ? <p className="tl-hint" id={hintId}>{hint}</p> : null}
      <div className="tl-field-input">
        {multiline ? <textarea {...common} /> : <input type="text" autoComplete={autoComplete} {...common} />}
        {extra?.(id)}
      </div>
      {status}
      {error ? <p className="tl-error" id={errId}>{error}</p> : null}
    </div>
  );
}

export interface Tab { id: string; label: string }
export function Tabs({ tabs, current, onChange, label }: { tabs: Tab[]; current: string; onChange: (id: string) => void; label: string }) {
  return (
    <div className="tl-tabs" role="tablist" aria-label={label}>
      {tabs.map(t => (
        <Button key={t.id} small role="tab" id={`tab-${t.id}`} aria-selected={t.id === current} aria-controls={`panel-${t.id}`}
          tabIndex={t.id === current ? 0 : -1} onClick={() => onChange(t.id)}
          onKeyDown={e => {
            const i = tabs.findIndex(x => x.id === current), step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
            if (!step) return;
            const next = tabs[(i + step + tabs.length) % tabs.length]!;
            onChange(next.id);
            requestAnimationFrame(() => document.getElementById(`tab-${next.id}`)?.focus());
          }}>{t.label}</Button>
      ))}
    </div>
  );
}
export function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  return <div role="tabpanel" id={`panel-${id}`} aria-labelledby={`tab-${id}`} className="tl-stack">{children}</div>;
}
