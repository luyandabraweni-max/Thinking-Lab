"use strict";

// Small visual helpers for lessons
function fracBar(parts, shaded, label) {
  const w = 300, h = 40, pw = w / parts;
  return `<svg width="100%" style="max-width:${w}px" viewBox="0 0 ${w} ${h + 4}" role="img" aria-label="${esc(label || shaded + " out of " + parts + " equal parts shaded")}">${Array.from({ length: parts }, (_, i) => `<rect x="${i * pw + 1}" y="2" width="${pw - 2}" height="${h}" rx="4" fill="${i < shaded ? "var(--shape-a)" : "var(--surface)"}" stroke="var(--ink)" stroke-opacity="0.5"/>`).join("")}</svg>`;
}
function hundredGrid(shaded) {
  let r = ""; for (let i = 0; i < 100; i++) r += `<rect x="${(i % 10) * 20 + 1}" y="${Math.floor(i / 10) * 20 + 1}" width="18" height="18" fill="${i < shaded ? "var(--shape-a)" : "var(--surface)"}" stroke="var(--ink)" stroke-opacity="0.3"/>`;
  return `<svg width="100%" style="max-width:200px" viewBox="0 0 202 202" role="img" aria-label="${shaded} out of 100 squares shaded">${r}</svg>`;
}
function flowBox(input, rule, output) {
  const box = (t, label) => `<span class="chip" style="min-width:64px;font-size:1.1rem" aria-label="${label}: ${t}">${t}</span>`;
  return `<div class="row" style="gap:8px" role="img" aria-label="Flow diagram: input ${input}, rule ${rule}, output ${output}">${box(input, "Input")}<span aria-hidden="true">&rarr;</span>${box(rule, "Rule")}<span aria-hidden="true">&rarr;</span>${box(output, "Output")}</div>`;
}
function chainRow(items) { return `<div class="row" style="gap:8px">${items.map((t, i) => `${i ? '<span aria-hidden="true">&rarr;</span>' : ""}<span class="chip" style="font-size:1rem;padding:0 10px">${esc(t)}</span>`).join("")}</div>`; }
