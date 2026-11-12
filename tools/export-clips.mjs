#!/usr/bin/env node
// Turns the live site's recorded voice clips (clips.js and clips/<unit>.js: MP3s inside JavaScript, keyed by the exact
// line said) into plain MP3 files and small lists the app loads when needed: apps/app/public/clips/. Runs before every
// app build; the output isn't committed, so the recordings live in the repo only once.
// Voice: Piper TTS, LibriTTS high voice (speaker 195), dataset licence CC BY 4.0.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url), out = new URL("apps/app/public/clips/", root);
const read = file => { const window = {}; vm.runInNewContext(readFileSync(file, "utf8"), { window }); return window.__CLIPS ?? {}; };
const sources = [["common", new URL("clips.js", root)], ...readdirSync(new URL("clips/", root)).filter(f => f.endsWith(".js")).map(f => [f.slice(0, -3), new URL(`clips/${f}`, root)])];

rmSync(out, { recursive: true, force: true });
mkdirSync(new URL("audio/", out), { recursive: true });
let files = 0, lines = 0;
for (const [name, file] of sources) {
  if (!existsSync(file)) continue;
  const list = {};
  for (const [text, uri] of Object.entries(read(file))) {
    const m = /^data:audio\/mpeg;base64,(.+)$/.exec(uri);
    if (!m) continue;
    const bytes = Buffer.from(m[1], "base64"), hash = createHash("sha1").update(bytes).digest("hex").slice(0, 16);
    const target = new URL(`audio/${hash}.mp3`, out);
    if (!existsSync(target)) { writeFileSync(target, bytes); files++; }
    list[text] = `${hash}.mp3`; lines++;
  }
  writeFileSync(new URL(`${name}.json`, out), JSON.stringify(list));
}
console.log(`Voice clips: ${lines} lines, ${files} audio files, in apps/app/public/clips.`);
