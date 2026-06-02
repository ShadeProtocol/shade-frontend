/**
 * Recurring billing-plan validation schema.
 *
 * Mirrors `invoice-schema.ts`: a single source of truth for the rules
 * the create-plan form enforces, kept in `src/lib` so server-side
 * actions can validate the same shape on submission. A recurring plan
 * is just an invoice template plus a cadence ("Billing Interval"), so
 * the field set is intentionally close to the invoice schema.
 */

import { z } from "zod";

export const billingIntervals = ["daily", "weekly", "monthly", "yearly"] as const;

export type BillingInterval = (typeof billingIntervals)[number];

export const billingIntervalLabels: Record<BillingInterval, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

export const billingPlanCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Plan name is required"),
  amount: z
    .coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than zero"),
  interval: z.enum(billingIntervals, {
    errorMap: () => ({ message: "Select a billing interval" }),
  }),
  description: z
    .string()
    .trim()
    .min(1, "Description is required"),
  customerEmail: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type BillingPlanCreateInput = z.infer<typeof billingPlanCreateSchema>;

/**
 * Validate a raw form payload. Returns either `{ ok: true, value }`
 * for the parsed input or `{ ok: false, errors }` with a per-field
 * map ready to drive the red error text under each input.
 */
export function validateBillingPlanCreate(input: unknown):
  | { ok: true; value: BillingPlanCreateInput }
  | { ok: false; errors: Partial<Record<keyof BillingPlanCreateInput, string>> } {
  const parsed = billingPlanCreateSchema.safeParse(input);
  if (parsed.success) return { ok: true, value: parsed.data };
  const errors: Partial<Record<keyof BillingPlanCreateInput, string>> = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof BillingPlanCreateInput | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}
