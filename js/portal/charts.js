"use strict";

// ---------- Progress chart: activities each week, by what was observed ----------
// Drawn as SVG. Each kind of result has its own pattern as well as its own colour, so the chart still reads
// in greyscale and for colour-blind viewers, and the same numbers are always available as a table.
const CHART_KINDS = [["alone", "Shown without support"], ["support", "Shown with support"], ["notyet", "Not yet shown"], ["open", "Idea shared"]];
const CHART_WEEKS = 8;
function weekStart(iso) {
  const [y, m, d] = iso.split("-").map(Number), t = new Date(Date.UTC(y, m - 1, d));
  t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 6) % 7); // back to Monday
  return t.toISOString().slice(0, 10);
}
// Rows are [date, activity, status, ...]. Returns the most recent weeks that had any activity, oldest first.
function weeklyCounts(rows) {
  const by = {};
  rows.forEach(r => { const w = weekStart(r[0]); by[w] = by[w] || { week: w, alone: 0, support: 0, notyet: 0, open: 0 }; if (by[w][r[2]] != null) by[w][r[2]]++; });
  return Object.values(by).sort((a, b) => a.week < b.week ? -1 : 1).slice(-CHART_WEEKS);
}
const weekTotal = w => CHART_KINDS.reduce((n, [k]) => n + w[k], 0);
function progressChart(L) {
  const weeks = weeklyCounts(L.rows.filter(r => exById(r[1])));
  if (!weeks.length) return `<p class="muted">The chart appears after the first session.</p>`;
  const W = 560, H = 220, left = 34, bottom = 30, top = 10, max = Math.max(...weeks.map(weekTotal), 1);
  const step = (W - left) / weeks.length, bw = Math.min(48, step * 0.6), y = n => H - bottom - n / max * (H - bottom - top);
  const ticks = [...new Set([0, Math.ceil(max / 2), max])];
  const bars = weeks.map((w, i) => {
    let base = 0; const x = left + i * step + (step - bw) / 2;
    return CHART_KINDS.map(([k]) => { if (!w[k]) return ""; const y0 = y(base), y1 = y(base + w[k]); base += w[k];
      return `<rect class="ch-${k}" x="${x.toFixed(1)}" y="${y1.toFixed(1)}" width="${bw.toFixed(1)}" height="${(y0 - y1).toFixed(1)}"></rect>`; }).join("")
      + `<text class="ch-label" x="${(x + bw / 2).toFixed(1)}" y="${H - 10}" text-anchor="middle">${niceDate(w.week)}</text>`;
  }).join("");
  const all = weeks.reduce((a, w) => { CHART_KINDS.forEach(([k]) => { a[k] += w[k]; }); return a; }, { alone: 0, support: 0, notyet: 0, open: 0 });
  const summary = `${L.nickname}'s activities over the last ${weeks.length} week${weeks.length > 1 ? "s" : ""} with sessions: ${CHART_KINDS.filter(([k]) => all[k]).map(([k, t]) => `${all[k]} ${t.toLowerCase()}`).join(", ")}.`;
  return `<figure class="chart">
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(summary)}" focusable="false">
        <defs>
          <pattern id="chp-support" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" class="ch-bg-support"></rect><line x1="0" y1="0" x2="0" y2="8" class="ch-line"></line></pattern>
          <pattern id="chp-notyet" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" class="ch-bg-notyet"></rect><circle cx="4" cy="4" r="1.6" class="ch-dot"></circle></pattern>
          <pattern id="chp-open" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" class="ch-bg-open"></rect><line x1="0" y1="4" x2="8" y2="4" class="ch-line"></line></pattern>
        </defs>
        ${ticks.map(t => `<line class="ch-grid" x1="${left}" x2="${W}" y1="${y(t).toFixed(1)}" y2="${y(t).toFixed(1)}"></line><text class="ch-label" x="${left - 8}" y="${(y(t) + 4).toFixed(1)}" text-anchor="end">${t}</text>`).join("")}
        ${bars}
      </svg>
      <figcaption>
        <ul class="ch-legend">${CHART_KINDS.map(([k, t]) => `<li><svg width="16" height="16" aria-hidden="true" focusable="false"><rect class="ch-${k}" width="16" height="16" rx="3"></rect></svg>${esc(t)}</li>`).join("")}</ul>
        <p class="note">Activities each week, starting on Monday. Counting activities, not marks: "not yet" is part of learning.</p>
      </figcaption>
      <details class="ch-table"><summary>Show as a table</summary>
        <div class="tablewrap" tabindex="0" role="region" aria-label="Activities each week"><table class="hist"><thead><tr><th scope="col">Week of</th>${CHART_KINDS.map(([, t]) => `<th scope="col">${esc(t)}</th>`).join("")}<th scope="col">Total</th></tr></thead>
        <tbody>${weeks.map(w => `<tr><th scope="row">${niceDate(w.week)}</th>${CHART_KINDS.map(([k]) => `<td>${w[k]}</td>`).join("")}<td>${weekTotal(w)}</td></tr>`).join("")}</tbody></table></div>
      </details>
    </figure>`;
}
