import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function Harness() {
  return (
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

describe("ThemeToggle", () => {
  it("toggles the dark class on the html element", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(document.documentElement.classList.contains("dark")).toBe(false);

    await user.click(screen.getByRole("button"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    await user.click(screen.getByRole("button"));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists the choice to localStorage", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("button"));

    expect(localStorage.getItem("shade:theme")).toBe("dark");
  });

  it("restores the persisted choice on reload", () => {
    localStorage.setItem("shade:theme", "dark");

    render(<Harness />);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("labels the action for screen readers", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(
      screen.getByRole("button", { name: "Switch to dark theme" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(
      screen.getByRole("button", { name: "Switch to light theme" }),
    ).toBeInTheDocument();
  });
});
