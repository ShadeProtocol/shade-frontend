"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ConfirmPaymentButtonProps {
  /**
   * Called after the user confirms they've sent the payment. The parent
   * usually starts polling the blockchain for the matching incoming
   * transaction here. Returning a promise keeps the button in its
   * "verifying" state until verification settles.
   */
  onConfirm?: () => Promise<void> | void;
  disabled?: boolean;
}

type Status = "idle" | "verifying" | "verified";

/**
 * Primary "I have sent the payment" button shown at the bottom of the
 * manual transfer view. On click it enters a loading state, invokes the
 * parent's onConfirm callback (which is typically a chain-polling
 * routine), and stays in the verifying state until that callback
 * resolves. After a successful verification it switches to a verified
 * state so the user gets unambiguous feedback.
 *
 * See ShadeProtocol/shade-frontend#56.
 */
export function ConfirmPaymentButton({
  onConfirm,
  disabled,
}: ConfirmPaymentButtonProps) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleClick() {
    if (status !== "idle") return;
    setStatus("verifying");
    try {
      await onConfirm?.();
      setStatus("verified");
    } catch {
      // Bubble the error back to idle so the user can retry. The parent
      // is responsible for surfacing a toast/inline error with detail.
      setStatus("idle");
    }
  }

  const isBusy = status === "verifying";
  const isDone = status === "verified";

  return (
    <Button
      type="button"
      size="lg"
      onClick={handleClick}
      disabled={disabled || isBusy || isDone}
      aria-busy={isBusy}
      aria-live="polite"
      className="w-full"
    >
      {isBusy ? (
        <>
          <Loader2 className="animate-spin" aria-hidden />
          <span>Verifying on-chain…</span>
        </>
      ) : isDone ? (
        <>
          <CheckCircle2 aria-hidden />
          <span>Payment confirmed</span>
        </>
      ) : (
        <>
          <Send aria-hidden />
          <span>I have sent the payment</span>
        </>
      )}
    </Button>
  );
}
