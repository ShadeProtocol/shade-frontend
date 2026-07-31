"use client";

import { BadgeCheck, Loader2, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { WalletConnectStatus } from "@/hooks/use-wallet-connect";
import { cn } from "@/lib/utils";

interface WalletConnectButtonProps {
  /** Current state of the connect/sign flow. */
  status: WalletConnectStatus;
  /** Starts the connect/sign flow. */
  onClick: () => void;
  /** Class hook for callers. */
  className?: string;
}

const LABELS: Record<WalletConnectStatus, string> = {
  idle: "Connect wallet to sign in",
  connecting: "Connecting wallet",
  signing: "Waiting for signature",
  verified: "Wallet verified",
  error: "Connect wallet to sign in",
};

function StatusIcon({ status }: { status: WalletConnectStatus }) {
  if (status === "connecting" || status === "signing") {
    return <Loader2 className="animate-spin" />;
  }

  if (status === "verified") {
    return <BadgeCheck />;
  }

  return <WalletCards />;
}

export function WalletConnectButton({
  status,
  onClick,
  className,
}: WalletConnectButtonProps) {
  const isBusy = status === "connecting" || status === "signing";

  return (
    <Button
      type="button"
      className={cn("w-full", className)}
      size="lg"
      onClick={onClick}
      disabled={isBusy}
    >
      <StatusIcon status={status} />
      {LABELS[status]}
    </Button>
  );
}
