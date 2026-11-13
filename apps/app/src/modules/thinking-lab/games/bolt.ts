// Bolt the robot, from js/activities/literal.js: shared by The Literal Robot and Describe It.
export const BOLT = (mood: "idle" | "oops" | "happy") => `<svg class="lr-bolt ${mood}" viewBox="0 0 120 120" aria-hidden="true">
    <line x1="60" y1="14" x2="60" y2="28" stroke="var(--ink)" stroke-width="3"/><circle cx="60" cy="12" r="6" fill="var(--gold)" stroke="var(--ink)" stroke-width="2"/>
    <rect x="28" y="28" width="64" height="48" rx="14" fill="var(--shape-c)" stroke="var(--ink)" stroke-width="3"/>
    <rect x="38" y="38" width="44" height="28" rx="8" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>
    ${mood === "oops" ? '<path d="M44 46 l6 6 M50 46 l-6 6 M70 46 l6 6 M76 46 l-6 6" stroke="var(--ink)" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="60" cy="60" rx="5" ry="4" fill="var(--ink)"/>'
      : '<circle cx="48" cy="50" r="4.5" fill="var(--ink)"/><circle cx="72" cy="50" r="4.5" fill="var(--ink)"/><path d="M50 58 Q60 66 70 58" stroke="var(--ink)" stroke-width="3" fill="none" stroke-linecap="round"/>'}
    <rect x="38" y="80" width="44" height="26" rx="8" fill="var(--shape-c)" stroke="var(--ink)" stroke-width="3"/>
    <path d="M28 86 L14 ${mood === "happy" ? 70 : 96}" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><path d="M92 86 L106 ${mood === "happy" ? 70 : 96}" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/>
    <rect x="42" y="106" width="12" height="10" rx="3" fill="var(--ink)"/><rect x="66" y="106" width="12" height="10" rx="3" fill="var(--ink)"/></svg>`;
