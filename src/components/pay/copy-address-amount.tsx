"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { notify } from "@/lib/toast";

interface CopyAddressAmountProps {
  address: string;
  amount: string;
  amountAssetCode?: string;
}

type CopyField = "address" | "amount";

/**
 * Read-only display of the destination address and amount for a manual
 * transfer, each with a copy-to-clipboard icon. The user copies these
 * into their external Stellar wallet to complete the payment.
 *
 * The copy implementation prefers the async Clipboard API and falls back
 * to an offscreen textarea + execCommand("copy") so it still works in
 * non-secure (HTTP) contexts, embedded webviews, and older browsers.
 *
 * See ShadeProtocol/shade-frontend#55.
 */
export function CopyAddressAmount({
  address,
  amount,
  amountAssetCode = "XLM",
}: CopyAddressAmountProps) {
  const [copied, setCopied] = useState<CopyField | null>(null);

  async function copyToClipboard(value: string): Promise<boolean> {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch {
        // Fall through to the execCommand fallback below — common in
        // non-secure contexts where navigator.clipboard rejects.
      }
    }

    if (typeof document === "undefined") return false;
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(textarea);
    return ok;
  }

  async function handleCopy(field: CopyField, value: string, label: string) {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(field);
      notify.success(`${label} copied`);
      window.setTimeout(() => {
        setCopied((current) => (current === field ? null : current));
      }, 1500);
    } else {
      notify.error(
        `Could not copy ${label.toLowerCase()}`,
        "Long-press the field to copy it manually.",
      );
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <CopyField
        id="manual-transfer-address"
        label="Address"
        value={address}
        copied={copied === "address"}
        onCopy={() => handleCopy("address", address, "Address")}
      />
      <CopyField
        id="manual-transfer-amount"
        label={`Amount (${amountAssetCode})`}
        value={amount}
        copied={copied === "amount"}
        onCopy={() => handleCopy("amount", amount, "Amount")}
      />
    </div>
  );
}

interface CopyFieldProps {
  id: string;
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}

function CopyField({ id, label, value, copied, onCopy }: CopyFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <div className="flex items-stretch overflow-hidden rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
        <input
          id={id}
          type="text"
          readOnly
          value={value}
          aria-label={label}
          className="flex-1 truncate bg-transparent px-3 py-2 font-mono text-sm text-foreground outline-none"
          onFocus={(event) => event.currentTarget.select()}
        />
        <button
          type="button"
          onClick={onCopy}
          aria-label={`Copy ${label.toLowerCase()}`}
          aria-pressed={copied}
          className={cn(
            "flex items-center gap-1.5 border-l px-3 text-xs font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            copied && "bg-emerald-50 text-emerald-900",
          )}
        >
          {copied ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </div>
  );
}
