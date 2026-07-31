import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { Select, type SelectOption } from "./select";

const options: SelectOption[] = [
  { value: "E-commerce", label: "E-commerce" },
  { value: "SaaS", label: "SaaS" },
  { value: "Nonprofit", label: "Nonprofit", disabled: true },
];

function ControlledSelect({
  onChange,
}: {
  onChange?: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <Select
      aria-label="Business category"
      options={options}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
      placeholder="Select category"
    />
  );
}

describe("Select", () => {
  it("shows the placeholder until a value is chosen", () => {
    render(<ControlledSelect />);

    expect(screen.getByRole("combobox")).toHaveTextContent("Select category");
  });

  it("styles the trigger to match the app input theme", () => {
    render(<ControlledSelect />);

    expect(screen.getByRole("combobox")).toHaveClass(
      "h-11",
      "rounded-md",
      "border",
      "bg-background",
    );
  });

  it("opens a listbox with every option", async () => {
    const user = userEvent.setup();

    render(<ControlledSelect />);

    await user.click(screen.getByRole("combobox"));

    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    for (const option of options) {
      expect(
        screen.getByRole("option", { name: option.label }),
      ).toBeInTheDocument();
    }
  });

  it("reports the selected value through onValueChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ControlledSelect onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "SaaS" }));

    expect(onChange).toHaveBeenCalledWith("SaaS");
    expect(screen.getByRole("combobox")).toHaveTextContent("SaaS");
  });

  it("marks disabled options as disabled", async () => {
    const user = userEvent.setup();

    render(<ControlledSelect />);

    await user.click(screen.getByRole("combobox"));

    expect(
      await screen.findByRole("option", { name: "Nonprofit" }),
    ).toHaveAttribute("data-disabled");
  });
});
