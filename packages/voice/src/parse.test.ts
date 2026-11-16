import { describe, expect, it } from "vitest";
import { command, digits, forField, normaliseDose, soundAlikes, wordsToNumber } from "./parse";

describe("spoken commands", () => {
  it("are recognised only when the whole thing said is the command", () => {
    expect(command("Next.")).toBe("next");
    expect(command("go back")).toBe("back");
    expect(command("Save it")).toBe("save");
    expect(command("read it again")).toBe("repeat");
    expect(command("that's right")).toBe("yes");
    expect(command("next Tuesday")).toBeNull();
    expect(command("Save some for later")).toBeNull();
  });
});

describe("numbers and doses", () => {
  it("turns number words into numbers", () => {
    expect(wordsToNumber("twenty three")).toBe(23);
    expect(wordsToNumber("two hundred and fifty")).toBe(250);
    expect(wordsToNumber("one thousand five hundred")).toBe(1500);
    expect(wordsToNumber("banana")).toBeNull();
  });
  it("writes doses the way they are written on a prescription", () => {
    expect(normaliseDose("fifteen milligrams")).toBe("15 mg");
    expect(normaliseDose("2.5 millilitres")).toBe("2.5 ml");
    expect(normaliseDose("two point five ml")).toBe("2.5 ml");
    expect(normaliseDose("two drops")).toBe("2 drops");
    expect(normaliseDose("one tablet")).toBe("1 tablet");
    expect(normaliseDose("half a tablet")).toBe("½ tablet");
    expect(normaliseDose("two hundred and fifty micrograms")).toBe("250 mcg");
  });
  it("flags numbers that sound alike, so the person can check them digit by digit", () => {
    expect(soundAlikes("15 mg")).toEqual([[15, 50]]);
    expect(soundAlikes("50 mg")).toEqual([[50, 15]]);
    expect(soundAlikes("10 mg")).toEqual([]);
    expect(digits(15)).toBe("one five");
  });
});

describe("fields", () => {
  it("tidies what was said for each kind of field", () => {
    expect(forField("name", "ritalin la")).toBe("Ritalin La");
    expect(forField("text", "mornings with breakfast")).toBe("Mornings with breakfast");
    expect(forField("dose", "ten milligrams")).toBe("10 mg");
    expect(forField("text", "  ")).toBe("");
  });
});
