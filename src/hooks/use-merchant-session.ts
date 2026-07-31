"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getMerchantSessionAddress } from "@/lib/merchant-storage";

export type MerchantSession = {
  walletAddress: string | null;
  isLoading: boolean;
};

export function useMerchantSession(): MerchantSession {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const address = getMerchantSessionAddress();

    if (!address) {
      router.replace("/sign-in");
      setIsLoading(false);
      return;
    }

    setWalletAddress(address);
    setIsLoading(false);
  }, [router]);

  return { walletAddress, isLoading };

import { getMerchantSessionAddress } from "@/lib/merchant-storage";

export type MerchantSessionState = {
  /** Wallet address of the signed-in merchant, null when unauthenticated. */
  address: string | null;
  /** True until the sessionStorage check has run on the client. */
  isLoading: boolean;
};

export function useMerchantSession(): MerchantSessionState {
  const [state, setState] = useState<MerchantSessionState>({
    address: null,
    isLoading: true,
  });

  useEffect(() => {
    setState({ address: getMerchantSessionAddress(), isLoading: false });
  }, []);

  return state;
}
