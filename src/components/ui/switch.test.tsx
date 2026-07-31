import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { Switch } from "./switch";

describe("Switch", () => {
  it("reports each toggle through onCheckedChange when controlled", async () => {
    const user = userEvent.setup();
    const handleCheckedChange = vi.fn();

    render(
      <Switch
        checked={false}
        onCheckedChange={handleCheckedChange}
        aria-label="Accepting new subscribers"
      />,
    );

    const toggle = screen.getByRole("switch", {
      name: /accepting new subscribers/i,
    });
    expect(toggle).toHaveAttribute("aria-checked", "false");

    await user.click(toggle);

    expect(handleCheckedChange).toHaveBeenCalledTimes(1);
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it("reflects the controlled checked prop", () => {
    render(
      <Switch checked onCheckedChange={() => {}} aria-label="Dark mode" />,
    );

    expect(screen.getByRole("switch", { name: /dark mode/i })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("toggles its own state when used uncontrolled", async () => {
    const user = userEvent.setup();

    render(<Switch aria-label="Dark mode" />);

    const toggle = screen.getByRole("switch", { name: /dark mode/i });
    expect(toggle).toHaveAttribute("data-state", "unchecked");

    await user.click(toggle);

    expect(toggle).toHaveAttribute("data-state", "checked");
  });

  it("does not fire onCheckedChange while disabled", async () => {
    const user = userEvent.setup();
    const handleCheckedChange = vi.fn();

    render(
      <Switch
        checked={false}
        onCheckedChange={handleCheckedChange}
        disabled
        aria-label="Accepting new subscribers"
      />,
    );

    await user.click(
      screen.getByRole("switch", { name: /accepting new subscribers/i }),
    );

    expect(handleCheckedChange).not.toHaveBeenCalled();
  });
});
