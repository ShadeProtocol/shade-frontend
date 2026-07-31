import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, it, expect, vi } from "vitest";

import { MERCHANT_SESSION_KEY } from "@/lib/merchant-storage";
import { DisconnectWalletMenu } from "./disconnect-wallet-menu";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

const address = "GABCDEF1234567890XYZ";

describe("DisconnectWalletMenu", () => {
  beforeEach(() => {
    replace.mockClear();
    sessionStorage.setItem(MERCHANT_SESSION_KEY, JSON.stringify({ address }));
  });

  it("renders the truncated wallet address", () => {
    render(<DisconnectWalletMenu walletAddress={address} />);
    expect(screen.getByText("GABC...0XYZ")).toBeInTheDocument();
  });

  it("clears the session and redirects to /sign-in on disconnect", async () => {
    const user = userEvent.setup();
    render(<DisconnectWalletMenu walletAddress={address} />);

    await user.click(screen.getByRole("button", { name: /wallet menu/i }));
    await user.click(await screen.findByText("Disconnect wallet"));

    expect(sessionStorage.getItem(MERCHANT_SESSION_KEY)).toBeNull();
    expect(replace).toHaveBeenCalledWith("/sign-in");
  });
});
