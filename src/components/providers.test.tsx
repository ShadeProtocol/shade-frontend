import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { notify } from "@/lib/toast";
import { Providers } from "./providers";
import { useTheme } from "./ThemeProvider";

function ThemeConsumer() {
  const { isDark } = useTheme();
  return <span data-testid="theme">{isDark ? "dark" : "light"}</span>;
}

describe("Providers", () => {
  it("renders its children", () => {
    render(
      <Providers>
        <p>dashboard</p>
      </Providers>,
    );

    expect(screen.getByText("dashboard")).toBeInTheDocument();
  });

  it("exposes the theme context to descendants", () => {
    render(
      <Providers>
        <ThemeConsumer />
      </Providers>,
    );

    expect(screen.getByTestId("theme")).toBeInTheDocument();
  });

  it("mounts the toast provider exactly once", async () => {
    render(
      <Providers>
        <p>dashboard</p>
      </Providers>,
    );

    notify.success("Link copied");

    await waitFor(() => {
      expect(screen.getByText("Link copied")).toBeInTheDocument();
    });

    expect(document.querySelectorAll("[data-sonner-toaster]")).toHaveLength(1);
  });
});
