"use client";

import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  billingIntervals,
  billingIntervalLabels,
  type BillingPlanCreateInput,
  validateBillingPlanCreate,
} from "@/lib/billing-plan-schema";

type FieldErrors = Partial<Record<keyof BillingPlanCreateInput, string>>;

const initialDraft = {
  name: "",
  amount: "",
  interval: "monthly",
  description: "",
  customerEmail: "",
};

export type BillingPlanFormProps = {
  onSubmit?: (plan: BillingPlanCreateInput) => Promise<void> | void;
};

export function BillingPlanForm({ onSubmit }: BillingPlanFormProps) {
  const [draft, setDraft] = useState(initialDraft);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof typeof initialDraft>(
    field: K,
    value: string,
  ) {
    setDraft((current) => ({ ...current, [field]: value }));
    if (errors[field as keyof BillingPlanCreateInput]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const result = validateBillingPlanCreate({
      name: draft.name,
      amount: draft.amount,
      interval: draft.interval,
      description: draft.description,
      customerEmail: draft.customerEmail,
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
        <h2 className="text-xl font-semibold">Create billing plan</h2>
        <p className="text-sm text-muted-foreground">
          Define a recurring charge. Validate every field before activating
          the plan.
        </p>
      </div>

      <Field label="Plan name" htmlFor="plan-name" error={errors.name}>
        <input
          id="plan-name"
          type="text"
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "plan-name-error" : undefined}
          value={draft.name}
          onChange={(event) => updateField("name", event.target.value)}
          disabled={isSubmitting}
          className={inputClass(Boolean(errors.name))}
          placeholder="e.g. Pro membership"
        />
      </Field>

      <Field
        label="Description"
        htmlFor="plan-description"
        error={errors.description}
      >
        <textarea
          id="plan-description"
          rows={3}
          required
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? "plan-description-error" : undefined
          }
          value={draft.description}
          onChange={(event) => updateField("description", event.target.value)}
          disabled={isSubmitting}
          className={inputClass(Boolean(errors.description))}
          placeholder="What does this plan cover?"
        />
      </Field>

      <Field label="Amount" htmlFor="plan-amount" error={errors.amount}>
        <input
          id="plan-amount"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          required
          aria-invalid={Boolean(errors.amount)}
          aria-describedby={errors.amount ? "plan-amount-error" : undefined}
          value={draft.amount}
          onChange={(event) => updateField("amount", event.target.value)}
          disabled={isSubmitting}
          className={inputClass(Boolean(errors.amount))}
          placeholder="0.00"
        />
      </Field>

      <Field
        label="Billing interval"
        htmlFor="plan-interval"
        error={errors.interval}
      >
        <select
          id="plan-interval"
          required
          aria-invalid={Boolean(errors.interval)}
          aria-describedby={
            errors.interval ? "plan-interval-error" : undefined
          }
          value={draft.interval}
          onChange={(event) => updateField("interval", event.target.value)}
          disabled={isSubmitting}
          className={inputClass(Boolean(errors.interval))}
        >
          {billingIntervals.map((interval) => (
            <option key={interval} value={interval}>
              {billingIntervalLabels[interval]}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Customer email (optional)"
        htmlFor="plan-customer-email"
        error={errors.customerEmail}
      >
        <input
          id="plan-customer-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.customerEmail)}
          aria-describedby={
            errors.customerEmail ? "plan-customer-email-error" : undefined
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
          "Create plan"
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
