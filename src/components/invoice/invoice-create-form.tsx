"use client";

import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type InvoiceCreateInput,
  validateInvoiceCreate,
} from "@/lib/invoice-schema";

type FieldErrors = Partial<Record<keyof InvoiceCreateInput, string>>;

const initialDraft = {
  amount: "",
  description: "",
  customerEmail: "",
  expiresAt: "",
};

/** Today's date as `YYYY-MM-DD`, used as the date picker's `min`. */
function todayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export type InvoiceCreateFormProps = {
  onSubmit?: (invoice: InvoiceCreateInput) => Promise<void> | void;
};

export function InvoiceCreateForm({ onSubmit }: InvoiceCreateFormProps) {
  const [draft, setDraft] = useState(initialDraft);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof typeof initialDraft>(
    field: K,
    value: string,
  ) {
    setDraft((current) => ({ ...current, [field]: value }));
    if (errors[field as keyof InvoiceCreateInput]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const result = validateInvoiceCreate({
      amount: draft.amount,
      description: draft.description,
      customerEmail: draft.customerEmail,
      expiresAt: draft.expiresAt,
    });

    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await onSubmit?.(result.value);
      setDraft(initialDraft);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full max-w-xl flex-col gap-5 rounded-lg border bg-card p-6 shadow-sm"
    >
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Create invoice</h2>
        <p className="text-sm text-muted-foreground">
          Validate every field before pushing on-chain.
        </p>
      </div>

      <Field
        label="Description"
        htmlFor="invoice-description"
        error={errors.description}
      >
        <textarea
          id="invoice-description"
          rows={3}
          required
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? "invoice-description-error" : undefined
          }
          value={draft.description}
          onChange={(event) => updateField("description", event.target.value)}
          disabled={isSubmitting}
          className={inputClass(Boolean(errors.description))}
          placeholder="What is this invoice for?"
        />
      </Field>

      <Field label="Amount" htmlFor="invoice-amount" error={errors.amount}>
        <input
          id="invoice-amount"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          required
          aria-invalid={Boolean(errors.amount)}
          aria-describedby={
            errors.amount ? "invoice-amount-error" : undefined
          }
          value={draft.amount}
          onChange={(event) => updateField("amount", event.target.value)}
          disabled={isSubmitting}
          className={inputClass(Boolean(errors.amount))}
          placeholder="0.00"
        />
      </Field>

      <Field
        label="Customer email (optional)"
        htmlFor="invoice-customer-email"
        error={errors.customerEmail}
      >
        <input
          id="invoice-customer-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.customerEmail)}
          aria-describedby={
            errors.customerEmail ? "invoice-customer-email-error" : undefined
          }
          value={draft.customerEmail}
          onChange={(event) =>
            updateField("customerEmail", event.target.value)
          }
          disabled={isSubmitting}
          className={inputClass(Boolean(errors.customerEmail))}
          placeholder="customer@example.com"
        />
      </Field>

      <Field
        label="Expiry date (optional)"
        htmlFor="invoice-expires-at"
        error={errors.expiresAt}
      >
        <input
          id="invoice-expires-at"
          type="date"
          min={todayIso()}
          aria-invalid={Boolean(errors.expiresAt)}
          aria-describedby={
            errors.expiresAt ? "invoice-expires-at-error" : undefined
          }
          value={draft.expiresAt}
          onChange={(event) => updateField("expiresAt", event.target.value)}
          disabled={isSubmitting}
          className={inputClass(Boolean(errors.expiresAt))}
        />
      </Field>

      <Button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="self-start"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            <span>Validating…</span>
          </>
        ) : (
          "Create invoice"
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <label htmlFor={htmlFor} className="font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-xs font-medium text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60",
    hasError && "border-destructive focus:ring-destructive",
  );
}
