"use client";

import { Loader2 } from "lucide-react";

import { useMerchantSession } from "@/hooks/use-merchant-session";

export function MerchantSessionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { walletAddress, isLoading } = useMerchantSession();

  if (isLoading || !walletAddress) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
