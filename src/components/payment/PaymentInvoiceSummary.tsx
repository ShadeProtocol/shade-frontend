import React from "react";
import Image from "next/image";

export interface InvoiceData {
  id: string;
  merchantName: string;
  merchantLogo?: string;
  description: string;
  amount: number;
  tokenSymbol: string;
  status: "valid" | "expired" | "invalid";
}

interface PaymentInvoiceSummaryProps {
  invoice: InvoiceData;
}

export function PaymentInvoiceSummary({ invoice }: PaymentInvoiceSummaryProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="p-8 flex flex-col items-center text-center space-y-5">
        {invoice.merchantLogo ? (
          <div className="size-16 rounded-full overflow-hidden bg-muted border flex items-center justify-center">
            <Image
              src={invoice.merchantLogo}
              alt={invoice.merchantName}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <span className="text-2xl font-bold text-primary">
              {invoice.merchantName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            {invoice.merchantName}
          </h2>
          <p className="text-sm text-muted-foreground">{invoice.description}</p>
        </div>

        <div className="pt-2 pb-2">
          <div className="text-5xl font-bold tracking-tighter flex items-baseline justify-center gap-2">
            {invoice.amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            <span className="text-2xl font-medium text-muted-foreground">
              {invoice.tokenSymbol}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
