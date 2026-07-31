"use client";

import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { notify } from "@/lib/toast";
import { useClipboard } from "@/hooks/use-clipboard";

interface CopyAddressAmountProps {
  address: string;
  amount: string;
  amountAssetCode?: string;
}

/**
 * Read-only display of the destination address and amount for a manual
 * transfer, each with a copy-to-clipboard icon. The user copies these
 * into their external Stellar wallet to complete the payment.
 */
export function CopyAddressAmount({
  address,
  amount,
  amountAssetCode = "XLM",
}: CopyAddressAmountProps) {
  return (
    <div className="flex flex-col gap-4">
      <CopyField
        id="manual-transfer-address"
        label="Address"
        value={address}
      />
      <CopyField
        id="manual-transfer-amount"
        label={`Amount (${amountAssetCode})`}
        value={amount}
      />
    </div>
  );
}

interface CopyFieldProps {
  id: string;
  label: string;
  value: string;
}

function CopyField({ id, label, value }: CopyFieldProps) {
  const { isCopied: copied, copy } = useClipboard(1500);

  async function handleCopy() {
    const ok = await copy(value);
    if (ok) {
      notify.success(`${label} copied`);
    } else {
      notify.error(
        `Could not copy ${label.toLowerCase()}`,
        "Long-press the field to copy it manually.",
      );
    }
  }

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
          onClick={handleCopy}
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
