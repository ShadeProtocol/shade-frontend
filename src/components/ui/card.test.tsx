import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

describe("Card", () => {
  it("applies the shared container classes", () => {
    render(<Card data-testid="card">content</Card>);

    const card = screen.getByTestId("card");

    expect(card).toHaveClass(
      "rounded-lg",
      "border",
      "bg-card",
      "p-6",
      "shadow-sm",
    );
    expect(card).toHaveAttribute("data-slot", "card");
  });

  it("merges consumer classNames over the defaults", () => {
    render(
      <Card data-testid="card" className="p-8">
        content
      </Card>,
    );

    const card = screen.getByTestId("card");

    expect(card).toHaveClass("p-8");
    expect(card).not.toHaveClass("p-6");
  });

  it("renders as the child element when asChild is set", () => {
    render(
      <Card asChild>
        <form aria-label="wrapped form" />
      </Card>,
    );

    const form = screen.getByRole("form", { name: "wrapped form" });

    expect(form.tagName).toBe("FORM");
    expect(form).toHaveClass("rounded-lg", "bg-card");
  });

  it("renders every subcomponent", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>$12,430</CardContent>
      </Card>,
    );

    expect(
      screen.getByRole("heading", { name: "Revenue" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
    expect(screen.getByText("$12,430")).toBeInTheDocument();
  });
});
