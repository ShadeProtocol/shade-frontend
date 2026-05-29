"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";

type ConnectionStatus = "idle" | "connecting" | "connected";

export function PayWithConnectedWalletView() {
  const [status, setStatus] = useState<ConnectionStatus>("idle");

  async function handleConnect() {
    if (status !== "idle") return;
    setStatus("connecting");
    // Mocked wallet handshake — real Stellar wallet wiring lands in a follow-up.
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("connected");
  }

  return (
    <section className="flex flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <WalletCards className="size-5" aria-hidden />
          <h2 className="text-lg font-semibold text-foreground">
            Pay with your connected wallet
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          This is the fastest, automated way to settle this invoice. Connect a
          Stellar wallet (Freighter, Albedo, xBull…), approve the prepared
          payment in the wallet popup, and Shade will detect the on-chain
          settlement automatically — no copying addresses, memos, or amounts.
        </p>
      </header>

      <ol className="space-y-2 text-sm text-muted-foreground">
        <li>
          <span className="font-medium text-foreground">1.</span> Click{" "}
          <span className="font-medium text-foreground">Connect Wallet</span>{" "}
          and pick your Stellar wallet.
        </li>
        <li>
          <span className="font-medium text-foreground">2.</span> Review the
          pre-filled payment in the wallet popup.
        </li>
        <li>
          <span className="font-medium text-foreground">3.</span> Approve — the
          invoice marks paid as soon as the transaction confirms.
        </li>
      </ol>

      <Button
        type="button"
        onClick={handleConnect}
        disabled={status !== "idle"}
        aria-busy={status === "connecting"}
        className="self-start"
      >
        {status === "connecting" ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            <span>Connecting wallet…</span>
          </>
        ) : status === "connected" ? (
          <>
            <CheckCircle2 aria-hidden />
            <span>Wallet connected</span>
          </>
        ) : (
          <>
            <WalletCards aria-hidden />
            <span>Connect Wallet</span>
          </>
        )}
      </Button>

      {status === "connected" ? (
        <p
          role="status"
          className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
        >
          Mock wallet connected. The real payment confirmation flow ships with
          the wallet-integration task.
        </p>
      ) : null}
    </section>
  );
}
