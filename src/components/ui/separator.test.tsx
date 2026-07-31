import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Separator } from "./separator";

describe("Separator", () => {
  it("renders with horizontal orientation by default", () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId("separator");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
    expect(separator.className).toContain("h-px");
    expect(separator.className).toContain("w-full");
  });

  it("renders with vertical orientation when specified", () => {
    render(<Separator orientation="vertical" data-testid="separator" />);

    const separator = screen.getByTestId("separator");
    expect(separator).toHaveAttribute("data-orientation", "vertical");
    expect(separator.className).toContain("h-full");
    expect(separator.className).toContain("w-px");
  });

  it("is decorative by default and hidden from the accessibility tree", () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId("separator");
    expect(separator).toHaveAttribute("role", "none");
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
  });

  it("exposes a separator role when decorative is false", () => {
    render(<Separator decorative={false} />);

    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("applies the shared border theme token", () => {
    render(<Separator data-testid="separator" />);

    expect(screen.getByTestId("separator").className).toContain("bg-border");
  });

  it("merges custom className with default styles", () => {
    render(<Separator data-testid="separator" className="my-4" />);

    const separator = screen.getByTestId("separator");
    expect(separator.className).toContain("my-4");
    expect(separator.className).toContain("bg-border");
  });

  it("forwards a ref to the underlying element", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Separator ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
