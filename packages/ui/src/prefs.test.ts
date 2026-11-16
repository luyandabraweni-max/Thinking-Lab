// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { applyPrefs, DEFAULT_PREFS } from "./prefs";

describe("text size", () => {
  it("scales the whole page, so headings, buttons and choices grow with the text", () => {
    const root = document.createElement("html");
    applyPrefs({ ...DEFAULT_PREFS, size: "large" }, root);
    expect(root.style.fontSize).toBe("112.5%");
    applyPrefs({ ...DEFAULT_PREFS, size: "larger" }, root);
    expect(root.style.fontSize).toBe("130%");
    applyPrefs(DEFAULT_PREFS, root);
    expect(root.style.fontSize).toBe("100%");
  });
});
