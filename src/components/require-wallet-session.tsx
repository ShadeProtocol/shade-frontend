"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useMerchantSession } from "@/hooks/use-merchant-session";

interface RequireWalletSessionProps {
  children: ReactNode;
  /** Where unauthenticated visitors are sent. */
  redirectTo?: string;
}

export function RequireWalletSession({
  children,
  redirectTo = "/sign-in",
}: RequireWalletSessionProps) {
  const router = useRouter();
  const { address, isLoading } = useMerchantSession();

  useEffect(() => {
    if (isLoading || address) {
      return;
    }

    router.replace(redirectTo);
  }, [address, isLoading, redirectTo, router]);

  if (isLoading || !address) {
    return (
      <div
        className="flex min-h-64 items-center justify-center"
        role="status"
        aria-label="Checking wallet session"
      >
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
