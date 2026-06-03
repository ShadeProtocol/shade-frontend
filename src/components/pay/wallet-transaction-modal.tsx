"use client";

import { Loader2 } from "lucide-react";

interface WalletTransactionModalProps {
  isOpen: boolean;
}

export function WalletTransactionModal({ isOpen }: WalletTransactionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border bg-card p-8 shadow-lg max-w-sm text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">
          Please sign the transaction in your wallet extension.
        </p>
      </div>
    </div>
  );
}
