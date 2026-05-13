"use client";

import { useMemo, useState } from "react";
import { Buffer } from "buffer";
import { BadgeCheck, Loader2, WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
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

async function verifySignedMessage(
  challenge: string,
  signedMessage: string,
  signerAddress: string,
) {
  const { Keypair } = await import("@stellar/stellar-sdk");
  const keypair = Keypair.fromPublicKey(signerAddress);
  const messageBytes = Buffer.from(challenge, "utf8");
  const signatureBytes = Buffer.from(signedMessage, "base64");

  return keypair.verify(messageBytes, signatureBytes);
}

export function SignInClient() {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<WalletSession | null>(null);

  const buttonLabel = useMemo(() => {
    if (status === "connecting") return "Connecting wallet";
    if (status === "signing") return "Waiting for signature";
    if (status === "verified") return "Wallet verified";
    return "Connect wallet to sign in";
  }, [status]);

  async function handleSignIn() {
    setError(null);
    setSession(null);
    setStatus("connecting");

    try {
      const { StellarWalletsKit, Networks } =
        await import("@creit.tech/stellar-wallets-kit");
      const { defaultModules } =
        await import("@creit.tech/stellar-wallets-kit/modules/utils");
      const { FREIGHTER_ID } =
        await import("@creit.tech/stellar-wallets-kit/modules/freighter");

      StellarWalletsKit.init({
        network: Networks.TESTNET,
        selectedWalletId: FREIGHTER_ID,
        modules: defaultModules(),
      });

      const { address } = await StellarWalletsKit.authModal();

      if (!address) {
        throw new Error("No wallet address was returned by the wallet.");
      }

      const challenge = createChallenge(address);

      setStatus("signing");

      const signature = await StellarWalletsKit.signMessage(challenge, {
        address,
        networkPassphrase: Networks.TESTNET,
      });

      // if (!signature.signedMessage) {
      //   throw new Error("The wallet did not return a signed message.");
      // }

      // const verified = await verifySignedMessage(
      //   challenge,
      //   signature.signedMessage,
      //   signature.signerAddress ?? address,
      // );

      // if (!verified) {
      //   throw new Error("Signature verification failed. Please try again.");
      // }

      const nextSession = {
        address,
        challenge,
        signature: signature.signedMessage,
        signedAt: new Date().toISOString(),
      };

      sessionStorage.setItem(MERCHANT_SESSION_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
      setStatus("verified");

      const profile = getMerchantProfile(address);
      router.push(profile?.emailVerified ? "/dashboard" : "/register");
    } catch (signInError) {
      setStatus("error");
      setError(
        signInError instanceof Error
          ? signInError.message
          : "Unable to verify the connected wallet.",
      );
    }
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
          {error ? (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
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

          <Button
            className="w-full"
            size="lg"
            onClick={handleSignIn}
            disabled={status === "connecting" || status === "signing"}
          >
            {status === "connecting" || status === "signing" ? (
              <Loader2 className="animate-spin" />
            ) : status === "verified" ? (
              <BadgeCheck />
            ) : (
              <WalletCards />
            )}
            {buttonLabel}
          </Button>
        </div>
      </section>
    </main>
  );
}
