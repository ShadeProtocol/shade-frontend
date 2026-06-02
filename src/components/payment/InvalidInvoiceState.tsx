import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface InvalidInvoiceStateProps {
  title?: string;
  message?: string;
}

export function InvalidInvoiceState({
  title = "Invoice Not Available",
  message = "This payment link is invalid or has expired.",
}: InvalidInvoiceStateProps) {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 flex flex-col items-center text-center space-y-5">
      <div className="size-14 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="size-7 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <div className="pt-4 w-full">
        <Button asChild variant="outline" className="w-full">
          <Link href="/">Try Another Reference</Link>
        </Button>
      </div>
    </div>
  );
}
