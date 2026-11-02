"use strict";

// ---------- Reusable drawing pad ----------
function drawPad(title, note, done) {
  const say = title + ". " + note;
  currentReturnSay = currentSay = say; setSay(say);
  render(`
      <section class="card">
        <h2>${esc(title)}</h2>
        <p class="muted">${esc(note)}</p>
        <canvas class="pad" id="pad" width="800" height="600" aria-label="Drawing space"></canvas>
        <div class="row"><button class="btn" id="dClear">Start again</button><button class="btn primary" id="dDone">Done</button></div>
      </section>`);
  const c = document.getElementById("pad"), g = c.getContext("2d");
  g.lineWidth = 10; g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || "#426C65";
  let down = false, strokes = 0;
  const pos = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * c.width / r.width, (e.clientY - r.top) * c.height / r.height]; };
  c.addEventListener("pointerdown", e => { down = true; strokes++; c.setPointerCapture(e.pointerId); const [x, y] = pos(e); g.beginPath(); g.moveTo(x, y); });
  c.addEventListener("pointermove", e => { if (!down) return; const [x, y] = pos(e); g.lineTo(x, y); g.stroke(); });
  c.addEventListener("pointerup", () => { down = false; });
  on("#dClear", () => g.clearRect(0, 0, c.width, c.height));
  on("#dDone", () => done(strokes));
}
