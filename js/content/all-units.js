"use strict";

UNITS.push(...UNITS2, ...UNITS3, ...UNITS_EARLY, ...UNITS_G1, ...UNITS_G2, ...UNITS_G3, ...UNITS_G7, ...UNITS_G8, ...UNITS_G9, ...UNITS_G10, ...UNITS_G11, ...UNITS_G12, ...UNITS_ADULT);
if (window.__TEST__) window.__TL = { UNITS, allLines() {
  const FB = [["You explored new possibilities.", "New idea explored."], ["You worked through something difficult.", "Challenge explored."], ["You stayed with the challenge.", "Strong persistence."], ["You tried a different approach when your first idea did not work.", "New strategy discovered."], ["You kept trying.", "Learning continued."], ["You looked carefully before deciding.", "Careful observation."]];
  const common = Object.values(L).concat(...FB);
  const out = {};
  UNITS.forEach(u => {
    const a = new Set(common);
    const add = x => { if (x) a.add(x); };
    introLines(u).forEach(add); u.lesson.forEach(pg => lessonLines(pg).forEach(add));
    add(u.example.q); u.example.steps.forEach(add);
    u.questions.forEach(q => { add(q.q); (q.options || []).forEach(add); q.hints.forEach(add); add(q.explain); });
    add(u.reflect.q); u.reflect.options.forEach(add); add(u.done);
    if (u.passage) passageParts(u.passage).forEach(pp => add(pp.text));
    const W2 = WORDS[u.id] || {}; (W2.words || []).forEach(w => add(wordLine(w))); (W2.phrases || []).forEach(ph => add(phraseLine(ph)));
    out[u.id] = [...a];
  });
  SKILLS.forEach(sk => {
    const a = new Set([sk.name + ".", sk.about, "Choose a project.", "Stay safe.", "What you need.", "Ask a grown-up to be with you for this project.", "How did it go?", "What was the best part?", "You can see it in your Support Passport."].concat(SKILL_HOW));
    Object.values(sk.levels).forEach(ps => ps.forEach(p => { a.add(p.title + "."); p.need.forEach(x => a.add(x)); p.safety.forEach(x => a.add(x)); p.steps.forEach((x, i) => { a.add(x); a.add(`Step ${i + 1} of ${p.steps.length}.`); }); p.reflect.forEach(x => a.add(x)); a.add(`Well done. You earned the ${p.badge} badge.`); }));
    out[sk.id] = [...a];
  });
  return out;
} };
