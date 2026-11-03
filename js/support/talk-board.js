"use strict";

// ---------- 5. Talk board ----------
const TALK = [["👍", "Yes"], ["👎", "No"], ["🙋", "I need help"], ["🌿", "I need a break"], ["🔁", "Again, please"], ["✋", "Stop, please"], ["🤷", "I don't know"], ["✅", "I'm finished"], ["💧", "I need water"], ["🚻", "I need the toilet"], ["😊", "I like this"], ["🔊", "It's too loud"], ["🛟", "I feel unsafe"]];
function openTalk() {
  let said = null;
  const draw = () => {
    overlay(`<div class="card talk"><h2>Talk board</h2><p class="muted">Tap a picture to say it.</p>
        ${said ? `<p class="said" role="status">${esc(said)}</p>` : ""}
        <div class="talk-grid">${TALK.map(([e, t], i) => `<button class="choice" data-tk="${i}">${icon(e)}<span class="lbl">${esc(t)}</span></button>`).join("")}</div>
        <div class="row"><button class="btn primary" id="tkClose" data-focus>Close</button></div></div>`);
    $layer.querySelectorAll("[data-tk]").forEach(b => b.onclick = () => { said = TALK[+b.dataset.tk][1]; logVoice("talk board", said); if (said === UNSAFE) { feelUnsafe("talk board"); return; } speakNow(said); draw(); const again = $layer.querySelector(`[data-tk="${b.dataset.tk}"]`); if (again) again.focus(); });
    document.getElementById("tkClose").onclick = closeLayer;
  };
  draw();
}
