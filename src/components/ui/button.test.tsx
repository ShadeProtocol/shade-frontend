import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button, buttonVariants } from "./button";

describe("Button", () => {
  it("renders a button element with the default variant and size classes", () => {
    render(<Button>Continue</Button>);

    const button = screen.getByRole("button", { name: "Continue" });

    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button).toHaveClass("bg-primary");
    expect(button).toHaveClass("text-primary-foreground");
    expect(button).toHaveClass("h-10");
  });

  it.each([
    ["default", "bg-primary"],
    ["destructive", "bg-destructive"],
    ["outline", "border-input"],
    ["secondary", "bg-secondary"],
    ["ghost", "hover:bg-accent"],
    ["link", "underline-offset-4"],
  ] as const)("applies the %s variant class", (variant, expectedClass) => {
    render(<Button variant={variant}>Variant</Button>);

    expect(screen.getByRole("button", { name: "Variant" })).toHaveClass(
      expectedClass,
    );
  });

  it.each([
    ["default", "h-10"],
    ["sm", "h-9"],
    ["lg", "h-11"],
    ["icon", "size-10"],
  ] as const)("applies the %s size class", (size, expectedClass) => {
    render(<Button size={size}>Size</Button>);

    expect(screen.getByRole("button", { name: "Size" })).toHaveClass(
      expectedClass,
    );
  });

  it("merges a custom className with the variant classes", () => {
    render(<Button className="w-full">Merged</Button>);

    const button = screen.getByRole("button", { name: "Merged" });

    expect(button).toHaveClass("w-full");
    expect(button).toHaveClass("bg-primary");
  });

  it("lets a conflicting custom className win over the variant class", () => {
    render(<Button className="h-20">Tall</Button>);

    const button = screen.getByRole("button", { name: "Tall" });

    expect(button).toHaveClass("h-20");
    expect(button).not.toHaveClass("h-10");
  });

  it("renders the child element instead of a button when asChild is set", () => {
    render(
      <Button asChild variant="link">
        <a href="https://example.com/invoices">Invoices</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Invoices" });

    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://example.com/invoices");
    expect(link).toHaveClass("text-primary");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("forwards props through the Slot to the asChild element", async () => {
    const handleClick = vi.fn();

    render(
      <Button asChild onClick={handleClick}>
        <a href="https://example.com/dashboard">Dashboard</a>
      </Button>,
    );

    await userEvent.click(screen.getByRole("link", { name: "Dashboard" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Disabled" });

    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("exposes the ref of the underlying button element", () => {
    const ref = { current: null as HTMLButtonElement | null };

    render(<Button ref={ref}>Ref</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe("Ref");
  });

  it("exports buttonVariants for reuse outside the component", () => {
    expect(buttonVariants({ variant: "destructive", size: "sm" })).toContain(
      "bg-destructive",
    );
    expect(buttonVariants({ variant: "destructive", size: "sm" })).toContain(
      "h-9",
    );
  });
});
