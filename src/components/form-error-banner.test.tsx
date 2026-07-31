import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { FormErrorBanner } from "./form-error-banner";

describe("FormErrorBanner", () => {
  it("renders nothing when the message is null", () => {
    const { container } = render(<FormErrorBanner message={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the message with the destructive banner styles", () => {
    render(<FormErrorBanner message="Something went wrong." />);

    const banner = screen.getByRole("alert");

    expect(banner).toHaveTextContent("Something went wrong.");
    expect(banner.className).toContain("rounded-lg");
    expect(banner.className).toContain("border-destructive/30");
    expect(banner.className).toContain("bg-destructive/10");
    expect(banner.className).toContain("p-3");
    expect(banner.className).toContain("text-sm");
    expect(banner.className).toContain("text-destructive");
  });

  it("merges an extra className", () => {
    render(<FormErrorBanner message="Nope." className="mt-5" />);
    expect(screen.getByRole("alert").className).toContain("mt-5");
  });
});
