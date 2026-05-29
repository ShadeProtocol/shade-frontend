"use client";

import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Invoice } from "@/lib/invoice-types";

const tokenOptions = ["XLM", "USDC", "EURC"] as const;

type InvoiceDraft = {
  description: string;
  amount: string;
  token: (typeof tokenOptions)[number];
};

const initialDraft: InvoiceDraft = {
  description: "",
  amount: "",
  token: "XLM",
};

function generateReference() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `INV-${Date.now().toString(36).toUpperCase()}-${random}`;
}

function isAmountValid(value: string) {
  if (!value.trim()) return false;
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0;
}

export type InvoiceFormProps = {
  onSubmit?: (invoice: Invoice) => Promise<void> | void;
};

export function InvoiceForm({ onSubmit }: InvoiceFormProps) {
  const [draft, setDraft] = useState<InvoiceDraft>(initialDraft);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);

  const canSubmit =
    draft.description.trim().length > 0 && isAmountValid(draft.amount);

  function updateField<K extends keyof InvoiceDraft>(
    field: K,
    value: InvoiceDraft[K],
  ) {
    setError(null);
    setDraft((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit || isSubmitting) return;

    const invoice: Invoice = {
      referenceId: generateReference(),
      description: draft.description.trim(),
      amount: Number(draft.amount).toFixed(2),
      token: draft.token,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit?.(invoice);
      setCreatedInvoice(invoice);
      setDraft(initialDraft);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to generate invoice. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl flex-col gap-5 rounded-lg border bg-card p-6 shadow-sm"
      noValidate
    >
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Generate invoice</h2>
        <p className="text-sm text-muted-foreground">
          Create a payable invoice your customer can settle on Stellar.
        </p>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Description</span>
        <textarea
          required
          rows={3}
          value={draft.description}
          onChange={(event) => updateField("description", event.target.value)}
          className="rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="What is this invoice for?"
          disabled={isSubmitting}
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Amount</span>
          <input
            required
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={draft.amount}
            onChange={(event) => updateField("amount", event.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="0.00"
            disabled={isSubmitting}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Token</span>
          <select
            value={draft.token}
            onChange={(event) =>
              updateField("token", event.target.value as InvoiceDraft["token"])
            }
            className="rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isSubmitting}
          >
            {tokenOptions.map((token) => (
              <option key={token} value={token}>
                {token}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {createdInvoice ? (
        <p
          role="status"
          className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
        >
          Invoice <span className="font-mono">{createdInvoice.referenceId}</span>{" "}
          generated.
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        aria-busy={isSubmitting}
        className="self-start"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            <span>Generating…</span>
          </>
        ) : (
          "Generate invoice"
        )}
      </Button>
    </form>
  );
}
