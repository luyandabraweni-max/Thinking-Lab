"use strict";

// ---------- Session state (memory only: nothing is stored) ----------
const S = {
  code: "T01", cohort: "7-12", band: "younger", answer: "choose", assisted: false, autoRead: false, quiet: false, theme: "system", contrast: false, motion: false, font: "atkinson", textSize: 1,
  started: null, need: null, played: [], learned: [], badges: [], grade: 5, lessonLen: "full", avatar: null, obs: [], my: { how: "read", calm: false, grey: false, plain: false, spacing: false, ruler: false, highlight: true, vol: "1", speed: "normal", theme: "none", scan: false, scanSpeed: "medium" }, plan: null, planStep: 0, battery: [], voice: [], passport: null, lastBattery: null, liked: null, tricky: null, adultNotes: "", inExercise: false
};

const $main = document.getElementById("main");
const $bar = document.getElementById("barActions");
const $layer = document.getElementById("layer");
const root = document.documentElement;
