"use strict";

// ---------- Shared helpers for the activities ----------
const reduceMotion = () => S.motion || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
const newRec = (title, extra) => Object.assign({ title, checks: 0, hints: 0, firstMatched: null, latestMatched: false, movedOn: false, mode: S.answer === "build" ? "build" : "choose", exampleOpened: false }, extra || {});
