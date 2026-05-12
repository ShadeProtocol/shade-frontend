"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CircleDollarSign,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuthStatus = "idle" | "connecting" | "signing" | "verified" | "error";

type WalletSession = {
  address: string;
  challenge: string;
  signature: string;
  signedAt: string;
};

type SupportedWallet = {
  id: string;
};

const trustPoints = [
  "No password or seed phrase",
  "One wallet signature proves control",
  "Ready for merchant dashboard access",
];

const flowSteps = [
  {
    icon: WalletCards,
    label: "Connect",
    description: "Pick a Stellar wallet and approve access.",
  },
  {
    icon: LockKeyhole,
    label: "Sign",
    description: "Sign a one-time login challenge.",
  },
  {
    icon: ShieldCheck,
    label: "Verify",
    description: "Shade verifies the signature before entry.",
  },
];

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

export function SignInClient() {
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
      const {
        StellarWalletsKit,
        WalletNetwork,
        FREIGHTER_ID,
        allowAllModules,
        verifyStellarSignature,
      } = await import("@creit.tech/stellar-wallets-kit");

      const kit = new StellarWalletsKit({
        network: WalletNetwork.TESTNET,
        selectedWalletId: FREIGHTER_ID,
        modules: allowAllModules(),
      });

      const address = await new Promise<string>((resolve, reject) => {
        kit.openModal({
          modalTitle: "Connect a Stellar wallet",
          notAvailableText: "This wallet is not available in your browser.",
          onWalletSelected: async (wallet: SupportedWallet) => {
            try {
              await kit.setWallet(wallet.id);
              const response = await kit.getAddress();

              if (!response.address) {
                reject(
                  new Error("No wallet address was returned by the wallet."),
                );
                return;
              }

              resolve(response.address);
            } catch (walletError) {
              reject(walletError);
            }
          },
          onClosed: (closedError?: Error) => {
            reject(
              closedError ??
                new Error("Wallet connection was cancelled before signing."),
            );
          },
        });
      });

      const challenge = createChallenge(address);

      setStatus("signing");

      const signature = await kit.signMessage(challenge, {
        address,
        networkPassphrase: WalletNetwork.TESTNET,
      });

      if (!signature.signedMessage) {
        throw new Error("The wallet did not return a signed message.");
      }

      const verified = await verifyStellarSignature(
        challenge,
        signature.signedMessage,
        signature.signerAddress ?? address,
      );

      if (!verified) {
        throw new Error("Signature verification failed. Please try again.");
      }

      const nextSession = {
        address,
        challenge,
        signature: signature.signedMessage,
        signedAt: new Date().toISOString(),
      };

      sessionStorage.setItem(
        "shade:merchant-session",
        JSON.stringify(nextSession),
      );
      setSession(nextSession);
      setStatus("verified");
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
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.04fr_0.96fr] lg:px-10">
        <div className="relative hidden min-h-[680px] overflow-hidden rounded-lg border bg-primary text-primary-foreground shadow-2xl shadow-primary/20 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(255,255,255,0.34),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0))]" />
          <div className="absolute -right-24 top-16 h-72 w-72 rounded-full border border-white/20" />
          <div className="absolute -bottom-24 left-12 h-96 w-96 rounded-full border border-white/15" />

          <div className="relative flex h-full min-h-[680px] flex-col justify-between p-10">
            <div>
              <div className="flex size-12 items-center justify-center rounded-lg bg-white/15">
                <CircleDollarSign className="size-6" />
              </div>
              <h1 className="mt-8 max-w-xl text-5xl font-bold leading-tight text-primary-foreground">
                Secure merchant entry starts with your Stellar wallet.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-primary-foreground/75">
                Shade uses signed wallet challenges to confirm merchant identity
                before exposing invoice tools, balances, and withdrawals.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur">
                <div className="flex items-center justify-between text-sm text-primary-foreground/70">
                  <span>Merchant balance</span>
                  <span>Verified route</span>
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-bold text-primary-foreground">
                      $8,420.00
                    </p>
                    <p className="mt-2 text-sm text-primary-foreground/70">
                      Available after wallet verification
                    </p>
                  </div>
                  <div className="rounded-md bg-white px-3 py-2 text-sm font-bold text-primary">
                    TESTNET
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {["Invoices", "Payments", "Withdrawals"].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-white/15 bg-white/10 p-4 text-sm font-semibold text-primary-foreground/85"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <WalletCards className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-primary">
                Shade merchant
              </p>
              <p className="text-sm text-muted-foreground">
                Stellar wallet authentication
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-xl shadow-primary/10 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                  Sign in with your wallet.
                </h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Connect a Stellar wallet, sign a one-time challenge, and Shade
                  will verify the signature before dashboard access.
                </p>
              </div>
              <div className="hidden rounded-lg bg-secondary p-3 text-primary sm:block">
                <ShieldCheck className="size-6" />
              </div>
            </div>

            <div className="mt-7 grid gap-3">
              {flowSteps.map((step, index) => (
                <div
                  key={step.label}
                  className={cn(
                    "grid grid-cols-[40px_1fr] gap-3 rounded-lg border bg-background p-4",
                    status === "verified" && "border-primary/30 bg-secondary/50",
                  )}
                >
                  <div className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary">
                    <step.icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {index + 1}. {step.label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {error ? (
              <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            {session ? (
              <div className="mt-6 rounded-lg border border-primary/25 bg-secondary/60 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <BadgeCheck className="size-4" />
                  Signature verified
                </div>
                <p className="mt-2 break-all text-sm text-muted-foreground">
                  {session.address}
                </p>
              </div>
            ) : null}

            <Button
              className="mt-7 w-full"
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
              {status === "idle" || status === "error" ? <ArrowRight /> : null}
            </Button>

            <div className="mt-6 grid gap-3">
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <span className="size-1.5 rounded-full bg-primary" />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
