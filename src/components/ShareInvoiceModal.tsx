"use client";

import { useState } from "react";
import { Check, Copy, X } from "lucide-react";

import { cn } from "@/lib/utils";

type ShareInvoiceModalProps = {
  invoiceId: string;
  isOpen: boolean;
  onClose: () => void;
};

export function ShareInvoiceModal({
  invoiceId,
  isOpen,
  onClose,
}: ShareInvoiceModalProps) {
  const [copied, setCopied] = useState(false);
  const url = `https://shade.app/pay/${invoiceId}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-invoice-title"
        className="relative z-10 w-full max-w-md rounded-lg border bg-card p-6 shadow-lg"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2
              id="share-invoice-title"
              className="text-base font-semibold text-card-foreground"
            >
              Share invoice
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Send this link to your customer to complete payment.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2.5">
          <span className="min-w-0 flex-1 truncate font-mono text-sm text-foreground">
            {url}
          </span>

          <button
            onClick={handleCopy}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              copied
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {copied ? (
              <>
                <Check className="size-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
