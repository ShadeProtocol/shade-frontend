import { render, screen } from "@testing-library/react";
import { Building2, MailCheck, UserRound } from "lucide-react";
import { describe, it, expect } from "vitest";

import { Stepper } from "./stepper";

const steps = [
  { step: 1, label: "Personal", icon: UserRound },
  { step: 2, label: "Business", icon: Building2 },
  { step: 3, label: "Verify", icon: MailCheck },
];

describe("Stepper", () => {
  it("renders every step label", () => {
    render(<Stepper steps={steps} currentStep={1} />);

    expect(screen.getByText("Personal")).toBeInTheDocument();
    expect(screen.getByText("Business")).toBeInTheDocument();
    expect(screen.getByText("Verify")).toBeInTheDocument();
  });

  it("highlights only the current step", () => {
    render(<Stepper steps={steps} currentStep={2} />);

    const current = screen.getByText("Business").parentElement;
    const other = screen.getByText("Personal").parentElement;

    expect(current?.className).toContain("border-primary");
    expect(current?.className).toContain("bg-secondary");
    expect(other?.className).toContain("bg-card");
    expect(other?.className).not.toContain("border-primary");
  });
});
