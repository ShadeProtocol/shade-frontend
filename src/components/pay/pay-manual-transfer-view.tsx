"use client";

import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CopyReadonlyInput } from "./copy-readonly-input";
import { AddressQRCode } from "./address-qr-code";
import { AlertTriangle } from "lucide-react";

interface PayManualTransferViewProps {
  /** Stellar address the payment should be sent to. */
  address?: string;
  /** Amount the user should send, formatted for display. */
  amount?: string;
  /** Fired when the user clicks "I have sent the payment". The button
   *  stays in its loading state until the returned promise resolves. */
  onConfirmSent?: () => Promise<void> | void;
}

const FALLBACK_ADDRESS =
  "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const FALLBACK_AMOUNT = "0.00 USDC";

/**
 * Manual transfer view rendered inside the Pay tabs (#55 + #56).
 *
 * - Two read-only inputs ("Address" + "Amount") each with a one-click
 *   copy-to-clipboard button (#55, via `CopyReadonlyInput`).
 * - A primary "I have sent the payment" button at the bottom of the
 *   panel that enters a loading state while we verify the chain (#56).
 */
export function PayManualTransferView({
  address = FALLBACK_ADDRESS,
  amount = FALLBACK_AMOUNT,
  onConfirmSent,
}: PayManualTransferViewProps = {}) {
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = useCallback(async () => {
    if (confirming) return;
    setConfirming(true);
    try {
      await onConfirmSent?.();
    } finally {
      // Leave the loading state on while the parent transitions to the
      // next polling stage; if no handler was supplied (preview / Storybook)
      // release the spinner after a short delay so the demo doesn't look
      // hung.
      if (!onConfirmSent) {
        window.setTimeout(() => setConfirming(false), 1200);
        return;
      }
      setConfirming(false);
    }
  }, [confirming, onConfirmSent]);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Important: Exact Amount Required</p>
          <p>
            You MUST send the <strong>exact</strong> token amount shown below on the Stellar network. 
            Sending a different amount or using a different network may result in permanent loss of funds or a failed transaction.
          </p>
        </div>
      </div>

      <div className="rounded-md border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
        <ol className="list-decimal list-inside space-y-1">
          <li>Scan the QR code or copy the destination address.</li>
          <li>Open your Stellar wallet and paste the address.</li>
          <li>Enter the exact amount and select the correct asset.</li>
          <li>Send the payment.</li>
          <li>Tap <em>"I have sent the payment"</em> below so Shade can verify it on-chain.</li>
        </ol>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-4">
          <CopyReadonlyInput
            label="Address"
            value={address}
            hint="Stellar address (56 characters)"
          />
          <CopyReadonlyInput
            label="Amount"
            value={amount}
            hint="Include the asset code — most wallets need it to route the payment."
          />
        </div>
        <div className="flex items-center justify-center md:w-48 shrink-0">
          <AddressQRCode walletAddress={address} />
        </div>
      </div>

      <Button
        type="button"
        size="lg"
        onClick={handleConfirm}
        disabled={confirming}
        aria-busy={confirming}
        data-testid="confirm-payment-sent"
        className="w-full"
      >
        {confirming ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Verifying on the blockchain…</span>
          </>
        ) : (
          "I have sent the payment"
        )}
      </Button>
    </div>
  );
}
