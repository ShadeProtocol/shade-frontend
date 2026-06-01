"use client";

import { FormEvent, useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TokenSelector } from "@/components/ui/token-selector";
import type { Invoice } from "@/lib/invoice-types";

type InvoiceDraft = {
  description: string;
  amount: string;
  token: string;
  payerEmail: string;
  expiration: string;
};

const initialDraft: InvoiceDraft = {
  description: "",
  amount: "",
  token: "XLM",
  payerEmail: "",
  expiration: "",
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

function isEmailValid(email: string) {
  if (!email.trim()) return true; // Optional field
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export type InvoiceFormProps = {
  onSubmit?: (invoice: Invoice) => Promise<void> | void;
};

export function InvoiceForm({ onSubmit }: InvoiceFormProps) {
  const [draft, setDraft] = useState<InvoiceDraft>(initialDraft);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const canSubmit =
    draft.description.trim().length > 0 &&
    isAmountValid(draft.amount) &&
    isEmailValid(draft.payerEmail);

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
      payerEmail: draft.payerEmail.trim() || undefined,
      expiration: draft.expiration || undefined,
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
      className="flex w-full max-w-xl flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-md transition-all duration-300 hover:shadow-lg"
      noValidate
    >
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Generate invoice</h2>
        <p className="text-sm text-muted-foreground">
          Create a payable invoice your customer can settle on Stellar.
        </p>
      </div>

      {/* Basic Details Section */}
      <div className="space-y-4 rounded-lg bg-muted/30 p-4 border border-border/40">
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
            Basic Details
          </h3>
          <span className="text-[11px] font-medium text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">Required</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">Amount</span>
            <input
              required
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={draft.amount}
              onChange={(event) => updateField("amount", event.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-indigo-500 disabled:opacity-60 text-foreground"
              placeholder="0.00"
              disabled={isSubmitting}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">Token</span>
            <TokenSelector
              value={draft.token}
              onChange={(value) => updateField("token", value)}
              disabled={isSubmitting}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Description</span>
          <textarea
            required
            rows={3}
            value={draft.description}
            onChange={(event) => updateField("description", event.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-indigo-500 disabled:opacity-60 resize-none text-foreground"
            placeholder="What is this invoice for?"
            disabled={isSubmitting}
          />
        </label>
      </div>

      {/* Advanced Options Section */}
      <div className="space-y-4 rounded-lg bg-muted/10 p-4 border border-border/40">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between py-1 text-sm font-semibold tracking-wide text-foreground uppercase text-left group"
        >
          <span>Advanced Options</span>
          <span className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-normal font-sans group-hover:text-foreground">
              {showAdvanced ? "Hide" : "Show"}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                showAdvanced ? "rotate-180" : ""
              }`}
            />
          </span>
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 gap-4 pt-2 border-t border-border/20 animate-in fade-in-50 slide-in-from-top-2 duration-200">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">Payer Email (optional)</span>
              <input
                type="email"
                value={draft.payerEmail}
                onChange={(event) => updateField("payerEmail", event.target.value)}
                className={`rounded-md border bg-background px-3 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 text-foreground ${
                  draft.payerEmail && !isEmailValid(draft.payerEmail)
                    ? "border-destructive focus:ring-destructive"
                    : "border-input focus:ring-ring"
                }`}
                placeholder="payer@example.com"
                disabled={isSubmitting}
              />
              {draft.payerEmail && !isEmailValid(draft.payerEmail) && (
                <span className="text-xs text-destructive">Please enter a valid email address</span>
              )}
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">Expiration Date (optional)</span>
              <input
                type="date"
                value={draft.expiration}
                onChange={(event) => updateField("expiration", event.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-indigo-500 disabled:opacity-60 text-foreground"
                disabled={isSubmitting}
              />
            </label>
          </div>
        )}
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive font-medium">
          {error}
        </p>
      ) : null}

      {createdInvoice ? (
        <div
          role="status"
          className="rounded-md border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900/50 px-3 py-2 text-sm text-emerald-900 dark:text-emerald-300 space-y-1"
        >
          <p>
            Invoice <span className="font-mono font-semibold">{createdInvoice.referenceId}</span>{" "}
            generated successfully.
          </p>
          {createdInvoice.payerEmail && (
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Payer Email: {createdInvoice.payerEmail}
            </p>
          )}
          {createdInvoice.expiration && (
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Expires: {new Date(createdInvoice.expiration).toLocaleDateString()}
            </p>
          )}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        aria-busy={isSubmitting}
        className="w-full sm:w-auto self-start mt-2 px-6"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" aria-hidden />
            <span>Generating…</span>
          </>
        ) : (
          "Generate invoice"
        )}
      </Button>
    </form>
  );
}

