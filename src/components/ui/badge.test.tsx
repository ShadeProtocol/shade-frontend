import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Badge } from "./badge";

describe("Badge", () => {
  it("renders arbitrary children with the pill base classes", () => {
    render(<Badge>GDXX…7Q4A</Badge>);

    const badge = screen.getByText("GDXX…7Q4A");

    expect(badge).toHaveClass("inline-flex", "rounded-full", "border");
    expect(badge).toHaveAttribute("data-slot", "badge");
  });

  it("defaults to the primary variant", () => {
    render(<Badge>Paid</Badge>);

    expect(screen.getByText("Paid")).toHaveClass(
      "bg-primary",
      "text-primary-foreground",
    );
  });

  it.each([
    ["secondary", "bg-secondary"],
    ["destructive", "bg-destructive"],
    ["outline", "border-border"],
  ] as const)("applies the %s variant styling", (variant, expected) => {
    render(<Badge variant={variant}>{variant}</Badge>);

    expect(screen.getByText(variant)).toHaveClass(expected);
  });

  it("renders icon children alongside text", () => {
    render(
      <Badge>
        <svg data-testid="badge-icon" />
        Verified
      </Badge>,
    );

    expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
    expect(screen.getByText(/Verified/)).toBeInTheDocument();
  });
});
