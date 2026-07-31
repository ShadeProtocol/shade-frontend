import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { Checkbox } from "./checkbox";

function ControlledCheckbox() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      aria-label="Select all keys"
      checked={checked}
      onCheckedChange={(next) => setChecked(next === true)}
    />
  );
}

describe("Checkbox", () => {
  it("matches the app border and rounded styling", () => {
    render(<Checkbox aria-label="Select row" />);

    expect(screen.getByRole("checkbox")).toHaveClass(
      "size-4",
      "rounded-sm",
      "border",
      "border-input",
    );
  });

  it("toggles checked state through controlled props", async () => {
    const user = userEvent.setup();

    render(<ControlledCheckbox />);

    const checkbox = screen.getByRole("checkbox", { name: "Select all keys" });

    expect(checkbox).toHaveAttribute("data-state", "unchecked");

    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("data-state", "checked");

    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("data-state", "unchecked");
  });

  it("reports changes to onCheckedChange", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(<Checkbox aria-label="Confirm" onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole("checkbox"));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("does not toggle while disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Checkbox
        aria-label="Locked"
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );

    await user.click(screen.getByRole("checkbox"));

    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
