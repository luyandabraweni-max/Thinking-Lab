import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BatteryCheck } from "./Wellbeing";

describe("battery check-in", () => {
  it("carries on when energy is good", async () => {
    const user = userEvent.setup(), onDone = vi.fn();
    render(<BatteryCheck say={() => {}} onDone={onDone} />);
    await user.click(screen.getByRole("button", { name: "Full" }));
    expect(onDone).toHaveBeenCalledWith("go");
  });
  it("offers a break or a short lesson when energy is low", async () => {
    const user = userEvent.setup(), onDone = vi.fn();
    render(<BatteryCheck say={() => {}} onDone={onDone} />);
    await user.click(screen.getByRole("button", { name: "Low" }));
    expect(screen.getByText("Low energy is okay. Would you like a break first?")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Do a short lesson" }));
    expect(onDone).toHaveBeenCalledWith("short");
  });
});
