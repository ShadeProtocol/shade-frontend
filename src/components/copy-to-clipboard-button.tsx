"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/use-clipboard";
import { cn } from "@/lib/utils";

export interface CopyToClipboardButtonProps extends Omit<React.ComponentPropsWithoutRef<typeof Button>, "onClick"> {
  text: string;
}

export const CopyToClipboardButton = React.forwardRef<HTMLButtonElement, CopyToClipboardButtonProps>(
  ({ text, className, variant = "ghost", size = "icon", ...props }, ref) => {
    const { isCopied, copy } = useClipboard();

    return (
      <Button
        ref={ref}
        type="button"
        variant={variant}
        size={size}
        className={cn("shrink-0", className)}
        onClick={() => copy(text)}
        aria-label={isCopied ? "Copied" : "Copy to clipboard"}
        {...props}
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-emerald-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    );
  }
);
CopyToClipboardButton.displayName = "CopyToClipboardButton";
