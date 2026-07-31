import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { WalletConnectButton } from "./wallet-connect-button";

describe("WalletConnectButton", () => {
  it("shows the idle label and fires onClick", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<WalletConnectButton status="idle" onClick={onClick} />);

    const button = screen.getByRole("button", {
      name: /connect wallet to sign in/i,
    });
    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disables itself while connecting or signing", () => {
    const { rerender } = render(
      <WalletConnectButton status="connecting" onClick={vi.fn()} />,
    );
    expect(
      screen.getByRole("button", { name: /connecting wallet/i }),
    ).toBeDisabled();

    rerender(<WalletConnectButton status="signing" onClick={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /waiting for signature/i }),
    ).toBeDisabled();
  });

  it("shows the verified label once verified", () => {
    render(<WalletConnectButton status="verified" onClick={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /wallet verified/i }),
    ).toBeEnabled();
  });
});
