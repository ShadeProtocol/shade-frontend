import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

describe("Alert", () => {
  it("exposes an alert role and renders title and description", () => {
    render(
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Something happened</AlertDescription>
      </Alert>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("Something happened")).toBeInTheDocument();
  });

  it("applies the destructive variant classes used by the auth error boxes", () => {
    render(<Alert variant="destructive">Boom</Alert>);

    const alert = screen.getByRole("alert");
    expect(alert.className).toContain("border-destructive/30");
    expect(alert.className).toContain("bg-destructive/10");
    expect(alert.className).toContain("text-destructive");
    expect(alert.className).toContain("rounded-lg");
    expect(alert.className).toContain("p-3");
    expect(alert.className).toContain("text-sm");
  });

  it("keeps caller classNames so layout spacing is preserved", () => {
    render(
      <Alert variant="destructive" className="mt-5">
        Boom
      </Alert>,
    );

    expect(screen.getByRole("alert").className).toContain("mt-5");
  });

  it("defaults to the neutral variant", () => {
    render(<Alert>Neutral</Alert>);

    const alert = screen.getByRole("alert");
    expect(alert.className).toContain("bg-card");
    expect(alert.className).not.toContain("bg-destructive/10");
  });
});
