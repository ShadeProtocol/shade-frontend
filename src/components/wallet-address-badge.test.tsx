import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { WalletAddressBadge, truncateAddress } from "./wallet-address-badge";

const ADDRESS = "GABC1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234";

describe("truncateAddress", () => {
  it("keeps leading and trailing characters", () => {
    expect(truncateAddress(ADDRESS)).toBe("GABC...1234");
  });

  it("respects custom character counts", () => {
    expect(truncateAddress(ADDRESS, 6, 6)).toBe(
      `${ADDRESS.slice(0, 6)}...${ADDRESS.slice(-6)}`,
    );
  });

  it("returns short addresses unchanged", () => {
    expect(truncateAddress("GABC1234")).toBe("GABC1234");
  });
});

describe("WalletAddressBadge", () => {
  it("renders the truncated address", () => {
    render(<WalletAddressBadge address={ADDRESS} />);
    expect(screen.getByText("GABC...1234")).toBeInTheDocument();
  });

  it("copies the full address and shows feedback", async () => {
    const user = userEvent.setup();

    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<WalletAddressBadge address={ADDRESS} />);

    await user.click(
      screen.getByRole("button", { name: /copy wallet address/i }),
    );

    expect(writeText).toHaveBeenCalledWith(ADDRESS);
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /address copied/i }),
      ).toBeInTheDocument(),
    );
  });
});
