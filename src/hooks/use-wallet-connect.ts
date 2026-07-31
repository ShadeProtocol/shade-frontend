"use client";

import { useCallback, useState } from "react";

import { MERCHANT_SESSION_KEY } from "@/lib/merchant-storage";

export type WalletConnectStatus =
  | "idle"
  | "connecting"
  | "signing"
  | "verified"
  | "error";

export type WalletSession = {
  address: string;
  challenge: string;
  signature: string;
  signedAt: string;
};

export function createChallenge(address: string) {
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

export function useWalletConnect() {
  const [status, setStatus] = useState<WalletConnectStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<WalletSession | null>(null);

  const connect = useCallback(async () => {
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

      const nextSession: WalletSession = {
        address,
        challenge,
        signature: signature.signedMessage,
        signedAt: new Date().toISOString(),
      };

      sessionStorage.setItem(MERCHANT_SESSION_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
      setStatus("verified");

      return nextSession;
    } catch (connectError) {
      setStatus("error");
      setError(
        connectError instanceof Error
          ? connectError.message
          : "Unable to verify the connected wallet.",
      );

      return null;
    }
  }, []);

  return { status, error, session, connect };
}
