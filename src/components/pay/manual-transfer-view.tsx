"use client";

import { ClipboardCopy } from "lucide-react";

import { CopyAddressAmount } from "./copy-address-amount";
import { ConfirmPaymentButton } from "./confirm-payment-button";

interface ManualTransferViewProps {
  /** Destination Stellar address the user must send to. */
  address?: string;
  /** Amount the user must send, formatted as a string. */
  amount?: string;
  /** Asset code the amount is denominated in (defaults to XLM). */
  amountAssetCode?: string;
}

/**
 * Manual-transfer payment flow:
 *   1. The user copies the address and amount into their wallet (#55).
 *   2. The user sends the payment from their wallet.
 *   3. The user taps "I have sent the payment" (#56), which kicks off
 *      blockchain polling for the matching transaction.
 *
 * Real address/amount + the polling routine ship in follow-up work; for
 * now we render with placeholder demo values so the flow is testable in
 * isolation.
 */
export function ManualTransferView({
  address = "GABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567",
  amount = "12.5000000",
  amountAssetCode = "XLM",
}: ManualTransferViewProps) {
  async function handleConfirm() {
    // Placeholder: the real implementation polls Horizon / Soroban RPC
    // for the matching incoming transaction. We wait a short tick so the
    // button visibly enters its verifying state in the demo.
    await new Promise((resolve) => setTimeout(resolve, 900));
  }

  return (
    <section className="flex flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <ClipboardCopy className="size-5" aria-hidden />
          <h2 className="text-lg font-semibold text-foreground">
            Pay by manual transfer
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Copy the address and exact amount into your Stellar wallet, send the
          payment, then tap{" "}
          <span className="font-medium text-foreground">
            I have sent the payment
          </span>{" "}
          so Shade can verify it on-chain.
        </p>
      </header>

      <CopyAddressAmount
        address={address}
        amount={amount}
        amountAssetCode={amountAssetCode}
      />

      <ConfirmPaymentButton onConfirm={handleConfirm} />
    </section>
  );
}
