import { describe, expect, it } from "vitest";
import { matchSpoken, spokenNumber } from "./answers";

describe("answering by speaking", () => {
  it("understands spoken numbers", () => {
    expect(spokenNumber("twelve")).toBe("12");
    expect(spokenNumber("twenty three")).toBe("23");
    expect(spokenNumber("three point five")).toBe("3,5");
    expect(spokenNumber("it's 45")).toBe("45");
    expect(spokenNumber("one hundred and five")).toBe("105");
    expect(spokenNumber("banana")).toBeNull();
  });
  it("finds the choice said, by its words, number or place on screen", () => {
    const opts = ["Cat", "Dog", "Big red bus", "12"], shown = [2, 0, 3, 1]; // shuffled on screen
    expect(matchSpoken(["dog"], opts, shown)).toBe(1);
    expect(matchSpoken(["I think the big red bus"], opts, shown)).toBe(2);
    expect(matchSpoken(["twelve"], opts, shown)).toBe(3);
    expect(matchSpoken(["the first one"], opts, shown)).toBe(2); // first on screen, not first in the list
    expect(matchSpoken(["B"], opts, shown)).toBe(0);
    expect(matchSpoken(["purple", "dog"], opts, shown)).toBe(1); // tries each thing the engine thought it heard
    expect(matchSpoken(["I have no idea at all"], opts, shown)).toBeNull();
  });
});
