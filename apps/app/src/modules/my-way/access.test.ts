import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DWELL_MS, SCAN_MS, startDwell, startScanning } from "./access";

const clicks: string[] = [];
beforeEach(() => {
  vi.useFakeTimers(); clicks.length = 0;
  document.body.innerHTML = `<button id="a">A</button><button id="b">B</button><button id="off" disabled>Off</button>`;
  document.querySelectorAll("button").forEach(b => b.addEventListener("click", () => clicks.push(b.id)));
});
afterEach(() => { vi.useRealTimers(); document.body.innerHTML = ""; });
const key = (k: string) => document.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));
const point = (id: string, x = 10, y = 10, pointerType = "mouse") => {
  const e = new MouseEvent("pointermove", { bubbles: true, clientX: x, clientY: y });
  Object.defineProperty(e, "pointerType", { value: pointerType });
  document.getElementById(id)!.dispatchEvent(e);
};

describe("switch scanning", () => {
  it("moves the highlight by itself, skips what can't be used, and a switch press chooses", () => {
    const stop = startScanning("fast", document, { includeHidden: true });
    vi.advanceTimersByTime(SCAN_MS.fast);
    expect(document.activeElement?.id).toBe("a");
    expect(document.getElementById("a")!.classList.contains("scan-on")).toBe(true);
    vi.advanceTimersByTime(SCAN_MS.fast);
    expect(document.activeElement?.id).toBe("b");
    vi.advanceTimersByTime(SCAN_MS.fast);
    expect(document.activeElement?.id).toBe("a"); // round again; the disabled button is skipped
    key(" ");
    expect(clicks).toEqual(["a"]);
    stop();
    vi.advanceTimersByTime(SCAN_MS.fast * 3);
    expect(document.activeElement?.id).toBe("a");
    expect(document.querySelector(".scan-on")).toBeNull();
  });
  it("stays inside an open dialog", () => {
    document.body.insertAdjacentHTML("beforeend", `<div role="dialog" aria-modal="true"><button id="d">Close</button></div>`);
    const stop = startScanning("fast", document, { includeHidden: true });
    vi.advanceTimersByTime(SCAN_MS.fast * 2);
    expect(document.activeElement?.id).toBe("d");
    stop();
  });
});

describe("choosing by resting the pointer", () => {
  it("chooses after resting, and not again until the pointer moves away", () => {
    const stop = startDwell("fast");
    point("a");
    expect(document.getElementById("a")!.classList.contains("dwelling")).toBe(true);
    vi.advanceTimersByTime(DWELL_MS.fast - 1);
    expect(clicks).toEqual([]);
    vi.advanceTimersByTime(1);
    expect(clicks).toEqual(["a"]);
    point("b", 15, 12); // a new screen under a still pointer: nothing is chosen
    vi.advanceTimersByTime(DWELL_MS.fast * 2);
    expect(clicks).toEqual(["a"]);
    point("b", 200, 200); // moved away and back onto a button
    vi.advanceTimersByTime(DWELL_MS.fast);
    expect(clicks).toEqual(["a", "b"]);
    stop();
  });
  it("leaves touch alone, and stops when moved off before the time is up", () => {
    const stop = startDwell("fast");
    point("a", 10, 10, "touch");
    vi.advanceTimersByTime(DWELL_MS.fast * 2);
    point("a", 50, 50);
    vi.advanceTimersByTime(DWELL_MS.fast / 2);
    point("b", 300, 300);
    vi.advanceTimersByTime(DWELL_MS.fast / 2);
    expect(clicks).toEqual([]);
    stop();
  });
});
