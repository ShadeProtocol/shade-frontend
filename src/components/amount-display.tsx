import * as React from "react";
import { cn } from "@/lib/utils";

export interface AmountDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: number;
  token: string;
  size?: "sm" | "lg";
}

export function AmountDisplay({
  amount,
  token,
  size = "sm",
  className,
  ...props
}: AmountDisplayProps) {
  // Locale-aware thousands separators and fixed 2 decimals
  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return (
    <div
      className={cn(
        "inline-flex items-baseline gap-1.5 font-semibold",
        size === "sm" ? "text-sm" : "text-3xl tracking-tight",
        className
      )}
      {...props}
    >
      <span className="tabular-nums">{formattedAmount}</span>
      <span
        className={cn(
          "font-medium",
          size === "sm" ? "text-xs text-muted-foreground" : "text-xl text-muted-foreground"
        )}
      >
        {token}
      </span>
    </div>
  );
}
