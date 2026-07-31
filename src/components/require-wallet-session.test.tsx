import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { MERCHANT_SESSION_KEY } from "@/lib/merchant-storage";
import { RequireWalletSession } from "./require-wallet-session";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("RequireWalletSession", () => {
  beforeEach(() => {
    replace.mockClear();
    sessionStorage.clear();
  });

  it("redirects to sign-in when there is no session", async () => {
    render(
      <RequireWalletSession>
        <p>Dashboard content</p>
      </RequireWalletSession>,
    );

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/sign-in"));
    expect(screen.queryByText("Dashboard content")).not.toBeInTheDocument();
  });

  it("renders children when a session exists", async () => {
    sessionStorage.setItem(
      MERCHANT_SESSION_KEY,
      JSON.stringify({ address: "GABC1234" }),
    );

    render(
      <RequireWalletSession>
        <p>Dashboard content</p>
      </RequireWalletSession>,
    );

    await waitFor(() =>
      expect(screen.getByText("Dashboard content")).toBeInTheDocument(),
    );
    expect(replace).not.toHaveBeenCalled();
  });
});
