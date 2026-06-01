"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type InvoiceLookupFormProps = {
  onSubmit?: (referenceNumber: string) => Promise<void> | void;
  className?: string;
};

export function InvoiceLookupForm({
  onSubmit,
  className,
}: InvoiceLookupFormProps) {
  const [reference, setReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmed = reference.trim();
    if (!trimmed) {
      setError("Please enter an invoice reference number.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit?.(trimmed);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        "mx-auto flex w-full max-w-md flex-col gap-5 rounded-2xl border bg-card p-8 text-center shadow-sm",
        className,
      )}
    >
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold">Find your invoice</h2>
        <p className="text-sm text-muted-foreground">
          Enter the reference number your merchant shared with you.
        </p>
      </div>

      <label className="flex flex-col gap-2 text-left text-sm">
        <span className="font-medium">Invoice Reference Number</span>
        <input
          name="reference"
          value={reference}
          onChange={(event) => {
            setError(null);
            setReference(event.target.value);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "invoice-lookup-error" : undefined}
          disabled={isSubmitting}
          required
          placeholder="INV-XXXXXX-XXXXXX"
          className={cn(
            "rounded-md border bg-background px-3 py-2 text-sm font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-ring",
            error && "border-destructive focus:ring-destructive",
          )}
          autoComplete="off"
          autoFocus
        />
        {error ? (
          <span
            id="invoice-lookup-error"
            role="alert"
            className="text-xs font-medium text-destructive"
          >
            {error}
          </span>
        ) : null}
      </label>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        <Search aria-hidden />
        <span>{isSubmitting ? "Looking up…" : "Find Invoice"}</span>
      </Button>
    </form>
  );
}
