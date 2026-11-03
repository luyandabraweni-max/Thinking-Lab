"use strict";

// ---------- School admin ----------
// Runs the school's account: sees its staff and totals, chooses the designated safeguarding lead, and removes staff
// who leave. Never sees an individual learner's records: those belong to the family and the specialists they chose.
const sameOrg = (a, b) => !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();
function schoolStaff(me) { return PORTAL.accounts.filter(a => a.role === "specialist" && sameOrg(a.org, me.org)); }
function schoolLearners(me) { const ids = schoolStaff(me).map(a => a.id); return PORTAL.learners.filter(L => L.specialists.some(s => ids.includes(s))); }
function daysAgoIso(n) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); }

function adminHome() {
  const me = PORTAL.me; if (!me || me.role !== "admin") return welcome();
  stopSpeaking(); closeLayer(); bar("adult");
  const staff = schoolStaff(me), learners = schoolLearners(me), since = daysAgoIso(30);
  const active = learners.filter(L => L.rows.some(r => r[0] >= since)).length, sessions = learners.reduce((n, L) => n + new Set(L.rows.map(r => r[0])).size, 0);
  const open = learners.reduce((n, L) => n + openConcerns(L).length, 0), dsls = staff.filter(a => a.consents.dsl);
  render(`
      <section class="card">
        ${portalHead()}
        <p class="eyebrow">School admin</p>
        <h1>${esc(me.org)}</h1>
        ${dsls.length ? "" : `<div class="safety-alert" role="alert"><h2>${icon("🛟")} No safeguarding lead</h2><p>Choose at least one designated safeguarding lead below. Until you do, nobody receives a learner's "I feel unsafe" concern.</p></div>`}
        <div class="stats">
          <div class="stat"><b>${staff.length}</b><span>staff</span></div>
          <div class="stat"><b>${learners.length}</b><span>learners</span></div>
          <div class="stat"><b>${active}</b><span>active in the last 30 days</span></div>
          <div class="stat"><b>${sessions}</b><span>sessions recorded</span></div>
          <div class="stat"><b>${open}</b><span>safeguarding concern${open === 1 ? "" : "s"} still open</span></div>
        </div>
        <p class="note">Totals only. As school admin you don't see learners' names, progress or notes: families share those with the specialists they choose.${open ? " Open concerns are handled by your safeguarding lead." : ""}</p>
        <h2>Staff</h2>
        ${staff.length ? `<div class="tablewrap" tabindex="0" role="region" aria-label="Staff"><table class="hist"><thead><tr><th scope="col">Name</th><th scope="col">Role</th><th scope="col">Learners</th><th scope="col">Safeguarding lead</th><th scope="col"><span class="sr">Actions</span></th></tr></thead>
          <tbody>${staff.map(a => `<tr><th scope="row">${esc(a.name)}<div class="note">${esc(a.email)}</div></th><td>${esc(a.profession)}</td><td>${learners.filter(L => L.specialists.includes(a.id)).length}</td>
            <td><label class="row" for="dsl-${esc(a.id)}"><input type="checkbox" id="dsl-${esc(a.id)}" data-dsl="${esc(a.id)}"${a.consents.dsl ? " checked" : ""}><span class="sr">${esc(a.name)} is a </span>Lead</label></td>
            <td><button class="btn small quiet" data-leave="${esc(a.id)}">Remove from school</button></td></tr>`).join("")}</tbody></table></div>`
          : `<p class="muted">No staff yet.</p>`}
        <p class="note">Staff join by registering as a specialist with the school's name, exactly as it appears above. They then show here.</p>
        <p class="note" id="adMsg" role="status"></p>
      </section>`);
  wirePortalHead();
  $main.querySelectorAll("[data-dsl]").forEach(b => b.addEventListener("change", () => {
    const a = PORTAL.accounts.find(x => x.id === b.dataset.dsl); a.consents.dsl = b.checked; savePortal();
    if (!staff.some(s => s.consents.dsl)) return adminHome();
    document.getElementById("adMsg").textContent = `${a.name} ${b.checked ? "is now a safeguarding lead and receives concerns" : "is no longer a safeguarding lead"}.`;
  }));
  on("[data-leave]", e => {
    const a = PORTAL.accounts.find(x => x.id === e.currentTarget.dataset.leave);
    overlay(`<div class="card"><h2>Remove ${esc(a.name)} from ${esc(me.org)}?</h2><p>They lose access to learners the school holds consent for. Families who shared directly with them keep their own choice and can stop sharing at any time.</p>
        <div class="row"><button class="btn" id="lvNo" data-focus>Keep them</button><button class="btn primary" id="lvYes">Remove</button></div></div>`);
    document.getElementById("lvNo").onclick = closeLayer;
    document.getElementById("lvYes").onclick = () => {
      closeLayer();
      PORTAL.learners.forEach(L => { if (L.consent.schoolHeld) L.specialists = L.specialists.filter(s => s !== a.id); });
      Object.assign(a, { org: "", consents: Object.assign(a.consents, { dsl: false }) }); savePortal();
      adminHome(); flash(`${a.name} has been removed from the school.`);
    };
  });
}
