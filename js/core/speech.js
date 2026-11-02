"use strict";

// ---------- Speech ----------
let voice = null;
function pickVoice() {
  try {
    const vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    const en = vs.filter(v => /^en/i.test(v.lang));
    const score = v => (/natural|neural|online/i.test(v.name) ? 40 : 0) + (/google/i.test(v.name) ? 20 : 0) + (/en-ZA/i.test(v.lang) ? 15 : /en-GB/i.test(v.lang) ? 10 : 0) + (/female|samantha|serena|libby|sonia|leah|aria|jenny/i.test(v.name) ? 5 : 0);
    voice = en.sort((a, b) => score(b) - score(a))[0] || null;
  } catch (e) { voice = null; }
}
if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
// Pre-recorded natural voice clips, keyed by the exact line. Browser voice is only a fallback.
const CLIPS = window.__CLIPS || {};
let audioEl = null, seqToken = 0, progressHook = null, boundaryHook = null, idleTimer = null;
const clipRate = () => ({ slow: 0.78, normal: 0.9, fast: 1.02 }[(S.my || {}).speed] || 0.9), ttsRate = () => ({ slow: 0.72, normal: 0.85, fast: 1 }[(S.my || {}).speed] || 0.85), vol = () => +((S.my || {}).vol || 1);
function stopAudio() { seqToken++; if (audioEl) { try { audioEl.pause(); } catch (e) {} audioEl = null; } }
function playClip(text) {
  return new Promise(res => {
    const src = CLIPS[text]; if (!src) { res(false); return; }
    try { audioEl = new Audio(src); audioEl.preservesPitch = true; audioEl.playbackRate = clipRate(); audioEl.volume = Math.min(1, vol()); audioEl.ontimeupdate = () => { if (progressHook && audioEl && audioEl.duration) progressHook(audioEl.currentTime / audioEl.duration); }; audioEl.onended = () => res(true); audioEl.onerror = () => res(false); const pr = audioEl.play(); if (pr && pr.catch) pr.catch(() => res(false)); } catch (e) { res(false); }
  });
}
function isSpeaking() { return (audioEl && !audioEl.paused && !audioEl.ended) || (window.speechSynthesis && speechSynthesis.speaking); }
async function speakSeq(lines, explicit) {
  if (S.quiet) return; if (!explicit && !S.autoRead) return;
  if (window.__collect) lines.forEach(l => window.__collect(l));
  stopSpeaking(); const tok = ++seqToken;
  for (let i = 0; i < lines.length; i++) { if (tok !== seqToken) return; const ok = await playClip(lines[i]); if (!ok) { fallbackSpeak(lines.slice(i).join(" ")); return; } }
}
function speakNow(text) {
  if (window.__collect && text) window.__collect(text); // test hook only: lists lines for voice recording
  if (S.quiet || !text) return;
  if (CLIPS[text]) { speakSeq([text], true); return; }
  fallbackSpeak(text);
}
function fallbackSpeak(text) {
  if (S.quiet) return;
  if (!window.speechSynthesis || !text) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.rate = ttsRate(); u.pitch = 1.05; u.volume = Math.min(1, vol()); u.onboundary = e => { if (boundaryHook) boundaryHook(e.charIndex || 0); };
    speechSynthesis.speak(u);
  } catch (e) {}
}
function speak(text) { if (S.autoRead && !S.quiet) speakNow(text); }
function stopSpeaking() { stopAudio(); try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {} }
let currentSay = "";
function setSay(text, auto) { currentSay = text; currentSayLines = null; if (auto !== false) speak(text); }
