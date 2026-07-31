"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WalletAddressBadgeProps {
  /** Full Stellar address. */
  address: string;
  /** Characters kept from the start of the address. */
  leadingChars?: number;
  /** Characters kept from the end of the address. */
  trailingChars?: number;
  /** Class hook for callers. */
  className?: string;
}

export function truncateAddress(
  address: string,
  leadingChars = 4,
  trailingChars = 4,
) {
  if (address.length <= leadingChars + trailingChars) {
    return address;
  }

  return `${address.slice(0, leadingChars)}...${address.slice(-trailingChars)}`;
}

export function WalletAddressBadge({
  address,
  leadingChars = 4,
  trailingChars = 4,
  className,
}: WalletAddressBadgeProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function handleCopy() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(address);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = address;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
    } catch {
      // Silently fail — the full address stays selectable via the title.
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border bg-muted/30 py-1 pl-2 pr-1 text-xs font-mono",
        className,
      )}
    >
      <span title={address}>
        {truncateAddress(address, leadingChars, trailingChars)}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        aria-label={copied ? "Address copied" : "Copy wallet address"}
        aria-live="polite"
        className="size-6 p-0 [&_svg]:size-3"
      >
        {copied ? <Check /> : <Copy />}
      </Button>
    </span>
  );
}
