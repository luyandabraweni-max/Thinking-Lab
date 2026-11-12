"use strict";

// ---------- Story Weaver (Communication and Expression) ----------
// The learner builds a picture story: who, where, the problem, then a beginning, middle and end, each with a feeling.
// They can add their own words by typing, drawing or speaking. It ends as a storybook that reads itself aloud.
// There is no right answer. Records how the learner prefers to express themselves (choosing, typing, drawing or
// speaking) and how they name feelings; older learners also take another character's point of view.
const SW_WHO = [["me", "Me", ""], ["gogo", "Gogo, a wise grandmother", "👵🏾"], ["tortoise", "Tumi the tortoise", "🐢"], ["robot", "Bolt the robot", "🤖"]];
const SW_WHERE = [
  { id: "river", label: "By the river", at: "by the river", props: ["🌊", "🪨", "🌿"], sky: "var(--sky)", ground: "var(--ok-soft)" },
  { id: "market", label: "At the market", at: "at the busy market", props: ["🍊", "🧺", "⛱️"], sky: "var(--gold-soft)", ground: "var(--brand-soft)" },
  { id: "school", label: "At school", at: "at school", props: ["🏫", "📚", "⚽"], sky: "var(--sky)", ground: "var(--brand-soft)" },
  { id: "moon", label: "On the Moon", at: "on the Moon", props: ["🌍", "⭐", "🚀"], sky: "var(--ink)", ground: "var(--line)" },
  { id: "night", label: "In the village at night", at: "in the village one night", props: ["🌙", "🏠", "✨"], sky: "var(--shape-c)", ground: "var(--brand-soft)" }
];
const SW_PROBLEMS = {
  lost: { label: "Something is lost", pic: "🔍", line: "Something precious was lost.", steps: [
    [["🗝️", "{who} looked everywhere for the lost key."], ["🎩", "{who} asked everyone, \"Have you seen my hat?\""], ["👣", "{who} found strange footprints."]],
    [["🍞", "{who} followed a trail of crumbs."], ["🧗", "{who} climbed up high to look."], ["🗺️", "{who} drew a map of every place it could be."]],
    [["🧺", "It was hiding in a basket all along!"], ["🐐", "A goat had it, and gave it back."], ["🎁", "{who} found it, and something even better."]]] },
  storm: { label: "A storm is coming", pic: "⛈️", line: "A big storm was coming.", steps: [
    [["☁️", "Dark clouds rolled in over the hills."], ["🌬️", "The wind began to whistle."], ["🐓", "The animals ran to hide."]],
    [["📦", "{who} helped everyone carry things inside."], ["🪢", "{who} tied down the roof with rope."], ["🕯️", "{who} lit a lamp so no one was scared."]],
    [["🌈", "The storm passed and a rainbow came out."], ["🏠", "Everyone was safe and dry."], ["💃", "They danced in the puddles together."]]] },
  sad: { label: "A friend is sad", pic: "💛", line: "A friend was feeling very sad.", steps: [
    [["🪑", "{who}'s friend sat alone, looking down."], ["💧", "{who} heard someone crying."], ["⚽", "A friend had lost a game and felt bad."]],
    [["👂", "{who} sat down and listened."], ["🍎", "{who} shared a snack."], ["🤪", "{who} made a funny face."]],
    [["😊", "The friend smiled again."], ["🤝", "They played together all afternoon."], ["💌", "The friend said, \"Thank you for noticing me.\""]]] },
  broken: { label: "Something is broken", pic: "🔧", line: "Something important was broken.", steps: [
    [["🚰", "The water tap stopped working."], ["🚲", "The bicycle chain was broken."], ["📻", "The radio went quiet."]],
    [["🔍", "{who} looked closely to see what was wrong."], ["🧑🏾‍🔧", "{who} asked a clever neighbour for help."], ["💡", "{who} tried three different ideas."]],
    [["✨", "It worked better than ever!"], ["🧠", "It was fixed, and {who} learned how it works."], ["🛠️", "They made something new from the parts."]]] }
};
const SW_FEEL = [["happy", "😊", "happy"], ["worried", "😟", "worried"], ["surprised", "😮", "surprised"], ["brave", "💪", "brave"], ["sad", "😢", "sad"], ["calm", "😌", "calm"]];
const SW_STAGES = ["The beginning", "The middle", "The end"];
const SW_LESSONS = ["Asking for help works", "Keep trying, even when it's hard", "Friends make things better", "Look closely before you decide"];

function gameStory(run) {
  labStart(run);
  const older = S.band === "older", st = { pages: [] }, rec = newRec("My story", { open: true, modes: {}, feelings: [], mode: "told a story" });
  const meName = () => (S.avatar && S.avatar.name) || "Zola";
  const whoName = () => st.who === "me" ? meName() : SW_WHO.find(w => w[0] === st.who)[1].split(",")[0];
  const fill = t => t.replace(/\{who\}/g, whoName());
  const used = m => { rec.modes[m] = (rec.modes[m] || 0) + 1; };
  const whoPic = (px) => st.who === "me" ? avatarSvg(S.avatar || Object.assign(defaultAvatar(), { name: meName() }), px, "", { decorative: true }) : `<span class="sw-emoji" style="font-size:${px * 0.7}px" aria-hidden="true">${SW_WHO.find(w => w[0] === st.who)[2]}</span>`;
  // One page's picture: the place, the character with their feeling, and what happens.
  const scene = p => {
    const w = SW_WHERE.find(x => x.id === st.where), feel = p.feeling && SW_FEEL.find(f => f[0] === p.feeling);
    return `<div class="sw-scene" style="--sw-sky:${w.sky};--sw-ground:${w.ground}" aria-hidden="true">
        <span class="sw-props">${w.props.map(e => `<span>${e}</span>`).join("")}</span>
        <span class="sw-who">${whoPic(84)}${feel ? `<span class="sw-feel">${feel[1]}</span>` : ""}</span>
        ${p.event ? `<span class="sw-event">${p.event[0]}</span>` : ""}
        ${p.pic ? `<img class="sw-drawing" src="${p.pic}" alt="">` : ""}</div>`;
  };
  const choiceGrid = (list, key) => `<div class="choices">${list.map(([id, label, pic]) => `<button class="choice" data-${key}="${esc(id)}">${pic ? `<span class="opt-pic" aria-hidden="true">${pic}</span>` : ""}<span class="lbl">${esc(label)}</span></button>`).join("")}</div>`;
  const step = (title, say, body, wire) => {
    labSay(say);
    render(`<section class="card">${labHead(run, "Make your story")}<h2>${esc(title)}</h2>${body}${thinkPrompt()}
        <div class="row"><button class="btn quiet" id="lkSkip">Move on without a story</button></div></section>`);
    wire(); on("#lkSkip", () => { rec.movedOn = true; finish(); });
  };
  const askWho = () => step("Who is your story about?", "Who is your story about?",
    choiceGrid(SW_WHO.map(([id, l, p]) => [id, id === "me" ? `${l}${S.avatar ? `: ${S.avatar.name}` : ""}` : l, id === "me" ? "🧑🏾" : p]), "who"),
    () => on("[data-who]", e => { st.who = e.currentTarget.dataset.who; run.acted = true; used("chose"); askWhere(); }));
  const askWhere = () => step("Where does it happen?", "Where does it happen?", choiceGrid(SW_WHERE.map(w => [w.id, w.label, w.props[0]]), "where"),
    () => on("[data-where]", e => { st.where = e.currentTarget.dataset.where; askProblem(); }));
  const askProblem = () => step("What is the problem?", "Every story has a problem. What is the problem in yours?", choiceGrid(Object.entries(SW_PROBLEMS).map(([id, p]) => [id, p.label, p.pic]), "prob"),
    () => on("[data-prob]", e => { st.problem = e.currentTarget.dataset.prob; page(0); }));
  // A page: what happens, how the character feels, and (if they like) their own words, drawing or voice.
  const page = i => {
    const prob = SW_PROBLEMS[st.problem], p = st.pages[i] = st.pages[i] || {}, opts = prob.steps[i];
    let typing = false;
    const draw = () => {
      const say = `${SW_STAGES[i]}. What happens?`;
      currentReturnSay = currentSay = say;
      render(`<section class="card">${labHead(run, `${SW_STAGES[i]} · page ${i + 1} of 3`)}
          <h2>${SW_STAGES[i]}: what happens?</h2>
          ${scene(p)}
          <div class="choices">${opts.map(([pic, t], k) => `<button class="choice" data-ev="${k}" aria-pressed="${p.event && p.event[1] === t}"><span class="opt-pic" aria-hidden="true">${pic}</span><span class="lbl">${esc(fill(t))}</span></button>`).join("")}</div>
          <h3>How does ${esc(whoName())} feel?</h3>
          <div class="choices sw-feels">${SW_FEEL.map(([id, e, l]) => `<button class="choice" data-feel="${id}" aria-pressed="${p.feeling === id}">${icon(e)}<span class="lbl">${l}</span></button>`).join("")}</div>
          <h3>Add your own words or picture <span class="muted">(if you like)</span></h3>
          ${p.words ? `<p class="sw-words">"${esc(p.words)}"</p>` : ""}${p.pic ? `<p class="muted">Your drawing is on this page.</p>` : ""}
          ${typing ? `<label for="swType" class="sw-type">Your words<textarea id="swType" rows="3" maxlength="300">${esc(p.words || "")}</textarea></label><div class="row"><button class="btn" id="swKeep">Keep my words</button></div>` : ""}
          <div class="row"><button class="btn" id="swTypeBtn">${icon("⌨️")}<span>Type</span></button><button class="btn" id="swDraw">${icon("🎨")}<span>Draw</span></button>${canListen() ? `<button class="btn" id="swSay">${icon("🎤")}<span>Say it</span></button>` : ""}</div>
          ${thinkPrompt()}
          <div class="row"><button class="btn primary" id="swNext"${p.event ? "" : " disabled"}>${i < 2 ? "Next page" : "Finish my story"}</button>${i > 0 ? '<button class="btn" id="swPrev">Back a page</button>' : ""}<button class="btn quiet" id="lkSkip">Move on without a story</button></div>
        </section>`);
      on("[data-ev]", e => { p.event = opts[+e.currentTarget.dataset.ev]; run.acted = true; used("chose"); draw(); const b = $main.querySelector(`[data-ev="${e.currentTarget.dataset.ev}"]`); if (b) b.focus({ preventScroll: true }); });
      on("[data-feel]", e => { p.feeling = e.currentTarget.dataset.feel; draw(); const b = $main.querySelector(`[data-feel="${p.feeling}"]`); if (b) b.focus({ preventScroll: true }); });
      on("#swTypeBtn", () => { typing = true; draw(); const t = document.getElementById("swType"); if (t) t.focus(); });
      on("#swKeep", () => { const v = document.getElementById("swType").value.trim(); if (v) { p.words = v; used("typed"); } typing = false; draw(); });
      on("#swDraw", () => drawPad("Draw this part of your story", "Draw anything you like.", (strokes, pic) => { if (pic) { p.pic = pic; used("drew"); } page(i); }));
      on("#swSay", () => { speakNow("Listening. Say your words now."); listenOnce(heard => { if (heard && heard[0]) { p.words = heard[0]; used("spoke"); } draw(); }); });
      on("#swPrev", () => page(i - 1));
      on("#swNext", () => i < 2 ? page(i + 1) : older ? perspective() : title());
      on("#lkSkip", () => { rec.movedOn = true; finish(); });
    };
    labSay(`${SW_STAGES[i]}. What happens? ${opts.map(o => fill(o[1])).join(" ")}`); draw();
  };
  // Older learners: another character's point of view, and what the story teaches.
  const perspective = () => {
    const others = SW_WHO.filter(w => w[0] !== st.who && w[0] !== "me").concat([["friend", "A friend", "🧒🏾"]]);
    let other = null, feel = null, lesson = null;
    const draw = () => {
      currentReturnSay = currentSay = "Someone else was in the story too. How did they feel?";
      render(`<section class="card">${labHead(run, "Another point of view")}<h2>Someone else was there too</h2>
          <h3>Who?</h3><div class="choices">${others.map(([id, l, p]) => `<button class="choice" data-ot="${id}" aria-pressed="${other === id}"><span class="opt-pic" aria-hidden="true">${p}</span><span class="lbl">${esc(l)}</span></button>`).join("")}</div>
          <h3>How did they feel?</h3><div class="choices sw-feels">${SW_FEEL.map(([id, e, l]) => `<button class="choice" data-of="${id}" aria-pressed="${feel === id}">${icon(e)}<span class="lbl">${l}</span></button>`).join("")}</div>
          <h3>What does your story teach?</h3><div class="choices">${SW_LESSONS.map((l, k) => `<button class="choice" data-ls="${k}" aria-pressed="${lesson === k}"><span class="lbl">${esc(l)}</span></button>`).join("")}</div>
          <div class="row"><button class="btn primary" id="swOn"${other && feel ? "" : " disabled"}>Next</button></div></section>`);
      on("[data-ot]", e => { other = e.currentTarget.dataset.ot; draw(); });
      on("[data-of]", e => { feel = e.currentTarget.dataset.of; draw(); });
      on("[data-ls]", e => { lesson = +e.currentTarget.dataset.ls; draw(); });
      on("#swOn", () => { st.other = { name: others.find(o => o[0] === other)[1].split(",")[0], feel }; st.lesson = lesson; rec.perspective = true; title(); });
    };
    labSay("Someone else was in the story too. Who was it, and how did they feel?"); draw();
  };
  const title = () => {
    const ideas = [`${whoName()} Saves the Day`, "The Big Adventure", `A Day ${SW_WHERE.find(w => w.id === st.where).label}`];
    step("Give your story a title", "Give your story a title. Choose one, or type your own.",
      `${choiceGrid(ideas.map(t => [t, t, "📖"]), "title")}<label for="swTitle" class="sw-type">Or type your own title<input id="swTitle" maxlength="60"></label><div class="row"><button class="btn" id="swOwn">Use my title</button></div>`,
      () => { on("[data-title]", e => { st.title = e.currentTarget.dataset.title; book(0); }); on("#swOwn", () => { const v = document.getElementById("swTitle").value.trim(); if (v) { st.title = v; used("typed"); book(0); } }); });
  };
  const pageLines = i => {
    const p = st.pages[i], w = SW_WHERE.find(x => x.id === st.where), feel = p.feeling && SW_FEEL.find(f => f[0] === p.feeling);
    const out = [];
    if (i === 0) out.push(`Once upon a time, ${whoName()} was ${w.at}.`, SW_PROBLEMS[st.problem].line);
    out.push(fill(p.event[1]));
    if (feel) out.push(`${whoName()} felt ${feel[2]}.`);
    if (p.words) out.push(p.words);
    if (i === 2 && st.other) out.push(`${st.other.name} felt ${SW_FEEL.find(f => f[0] === st.other.feel)[2]} too.`);
    if (i === 2 && st.lesson != null) out.push(`The lesson: ${SW_LESSONS[st.lesson].toLowerCase()}.`);
    if (i === 2) out.push("The end.");
    return out;
  };
  // The finished storybook: one page at a time, read aloud with captions.
  const book = i => {
    const lines = pageLines(i);
    labSay(i === 0 ? `${st.title}. ${lines.join(" ")}` : lines.join(" "));
    render(`<section class="card">${labHead(run, "My storybook")}
        <div class="sw-book${reduceMotion() ? "" : " turn"}">
          ${i === 0 ? `<h2 class="sw-title">${esc(st.title)}</h2>` : ""}
          ${scene(st.pages[i])}
          <div class="sw-text">${lines.map(l => `<p>${esc(l)}</p>`).join("")}</div>
          <p class="muted">Page ${i + 1} of 3</p>
        </div>
        <div class="row"><button class="btn" id="swRead"${S.quiet ? " disabled" : ""}>${speakerIcon}<span>Read this page</span></button>
          ${i > 0 ? '<button class="btn" id="swBack">Previous page</button>' : ""}
          ${i < 2 ? '<button class="btn primary" id="swFwd" data-focus>Next page</button>' : '<button class="btn primary" id="swEnd" data-focus>I love my story</button>'}</div></section>`);
    on("#swRead", () => speakSeq((i === 0 ? [st.title + "."] : []).concat(lines), true));
    on("#swBack", () => book(i - 1)); on("#swFwd", () => book(i + 1));
    on("#swEnd", () => { rec.latestMatched = true; rec.feelings = st.pages.map(p => p.feeling).filter(Boolean); finish(); });
  };
  const finish = () => labReflect(run, W("What do you like most about your story?", "What part of your story are you proudest of?"), ["The beginning", "The middle", "The ending", "My own words or drawings"],
    r => finishExercise(run, [rec], r, null, st.title ? `Story: "${st.title}". ${[0, 1, 2].filter(i => st.pages[i] && st.pages[i].event).map(i => pageLines(i).join(" ")).join(" ")} Told by: ${Object.entries(rec.modes).map(([m, n]) => `${m} ${n}`).join(", ")}. Feelings named: ${rec.feelings.join(", ") || "none"}.` : "Chose not to make a story this time."));
  askWho();
}
