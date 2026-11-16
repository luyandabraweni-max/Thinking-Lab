import { describe, expect, it } from "vitest";
import { addClips, planSpeech } from "./clips";

describe("recorded voice clips", () => {
  addClips({ "Press Begin when you are ready.": "a.mp3", "12 vetkoek, 4 friends. How can everyone get the same?": "b.mp3", "Sharing equally.": "c.mp3" });
  it("uses a recording for the exact line", () => {
    expect(planSpeech("Press Begin when you are ready.")).toEqual([{ text: "Press Begin when you are ready.", clip: "a.mp3" }]);
  });
  it("uses recordings for the sentences that have them, the longest run first, and the device voice for the rest", () => {
    expect(planSpeech("Sharing equally. 12 vetkoek, 4 friends. How can everyone get the same? Today we share. Press Begin when you are ready.")).toEqual([
      { text: "Sharing equally.", clip: "c.mp3" },
      { text: "12 vetkoek, 4 friends. How can everyone get the same?", clip: "b.mp3" },
      { text: "Today we share." },
      { text: "Press Begin when you are ready.", clip: "a.mp3" }]);
  });
  it("joins neighbouring sentences without recordings into one, so the device voice reads them naturally", () => {
    expect(planSpeech("One thing. Another thing!")).toEqual([{ text: "One thing. Another thing!" }]);
    expect(planSpeech("   ")).toEqual([]);
  });
});
