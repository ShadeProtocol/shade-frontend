"use client";

import { CheckCircle2, Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PaymentSuccess() {
  return (
    <section
      role="status"
      aria-live="polite"
      className="overflow-hidden rounded-lg border bg-card p-8 text-center shadow-sm"
    >
      <div className="mx-auto flex max-w-md flex-col items-center gap-5">
        <div className="relative flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-inner dark:bg-emerald-950 dark:text-emerald-300">
          <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
          <CheckCircle2 className="relative size-11" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-emerald-950 dark:text-emerald-100">
            Payment Successful!
          </h2>
          <p className="text-sm leading-6 text-white">
            Your payment has been confirmed. Shade has recorded the transaction
            and the merchant will be notified.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="bg-background"
        >
          <Download aria-hidden="true" />
          <span>Download Receipt</span>
        </Button>
      </div>
    </section>
  );
}
