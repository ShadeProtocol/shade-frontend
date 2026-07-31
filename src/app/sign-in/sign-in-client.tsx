"use client";

import { BadgeCheck, WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";

import { FormErrorBanner } from "@/components/form-error-banner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getMerchantProfile,
  MERCHANT_SESSION_KEY,
} from "@/lib/merchant-storage";

type AuthStatus = "idle" | "connecting" | "signing" | "verified" | "error";

type WalletSession = {
  address: string;
  challenge: string;
  signature: string;
  signedAt: string;
};

function createChallenge(address: string) {
  const issuedAt = new Date().toISOString();
  const nonce =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return [
    "Shade Merchant Sign In",
    "",
    "Sign this message to prove you control this Stellar wallet.",
    "This request will not move funds or create a transaction.",
    "",
    `Wallet: ${address}`,
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
  ].join("\n");
}

// async function verifySignedMessage(
//   challenge: string,
//   signedMessage: string,
//   signerAddress: string,
// ) {
//   const { Keypair } = await import("@stellar/stellar-sdk");
//   const keypair = Keypair.fromPublicKey(signerAddress);
//   const messageBytes = Buffer.from(challenge, "utf8");
//   const signatureBytes = Buffer.from(signedMessage, "base64");
//
//   return keypair.verify(messageBytes, signatureBytes);
// }
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { useWalletConnect } from "@/hooks/use-wallet-connect";
import { getMerchantProfile } from "@/lib/merchant-storage";

export function SignInClient() {
  const router = useRouter();
  const { status, error, session, connect } = useWalletConnect();

  async function handleSignIn() {
    const nextSession = await connect();

    if (!nextSession) {
      return;
    }

    const profile = getMerchantProfile(nextSession.address);
    router.push(profile?.emailVerified ? "/dashboard" : "/register");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <section className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <WalletCards className="size-6" />
          </div>
          <h1 className="mt-5 text-3xl font-bold">Sign in to Shade</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Connect your Stellar wallet and sign a verification message.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <FormErrorBanner message={error} className="mb-4" />
        <Card>
          {error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {session ? (
            <div className="mb-4 rounded-lg border border-primary/25 bg-secondary/60 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <BadgeCheck className="size-4" />
                Wallet verified
              </div>
              <p className="mt-2 break-all text-xs text-muted-foreground">
                {session.address}
              </p>
            </div>
          ) : null}

          <WalletConnectButton status={status} onClick={handleSignIn} />
        </div>
      </section>
    </main>
  );
}
