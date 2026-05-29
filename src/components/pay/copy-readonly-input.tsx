"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyReadonlyInputProps {
  /** Visible label rendered above the input. */
  label: string;
  /** The value users copy into their wallet. */
  value: string;
  /** Optional id; auto-generated otherwise. */
  id?: string;
  /** Class hook for callers. */
  className?: string;
  /** Hint shown beneath the input (e.g. "Stellar address"). */
  hint?: string;
}

/**
 * Read-only input with a one-click copy-to-clipboard button (#55).
 *
 * Used in the manual-transfer pay view for the recipient address + the
 * amount. Renders feedback for ~1.5s after a successful copy so users
 * see the action confirm without needing a toast layer.
 */
export function CopyReadonlyInput({
  label,
  value,
  id,
  className,
  hint,
}: CopyReadonlyInputProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(t);
  }, [copied]);

  async function handleCopy() {
    // Prefer the async clipboard API; fall back to selecting + execCommand
    // for environments (older Safari, insecure contexts) where it's
    // unavailable.
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else if (inputRef.current) {
        inputRef.current.select();
        document.execCommand("copy");
        inputRef.current.setSelectionRange(0, 0);
      }
      setCopied(true);
    } catch {
      // Silently fail — user can still select + ⌘C manually.
    }
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={fieldId} className="text-sm font-medium">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          id={fieldId}
          readOnly
          value={value}
          aria-readonly
          className="flex-1 rounded-md border bg-muted/30 px-3 py-2 text-sm font-mono"
          onFocus={(event) => event.target.select()}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleCopy}
          aria-label={
            copied ? `${label} copied to clipboard` : `Copy ${label.toLowerCase()}`
          }
          aria-live="polite"
          className="shrink-0"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
