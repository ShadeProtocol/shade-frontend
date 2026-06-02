/**
 * Invoice-creation validation schema (#21).
 *
 * Single source of truth for the rules the create-invoice form
 * enforces. Kept in `src/lib` so server-side actions (route handlers,
 * Soroban-invoke wrappers) can validate the same shape on submission
 * — drift between client-side and server-side validation is the
 * common way invalid data sneaks into the contract.
 */

import { z } from "zod";

/**
 * Today's date as a `YYYY-MM-DD` string in the local timezone. The
 * native `<input type="date">` emits dates in this format, so we
 * compare lexicographically rather than constructing `Date` objects
 * (which would drag UTC/timezone offsets into the comparison).
 */
function todayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const invoiceCreateSchema = z.object({
  amount: z
    .coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than zero"),
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
  // Optional expiry. Native date inputs yield `YYYY-MM-DD`; the
  // refinement rejects any date earlier than today so an invoice
  // cannot be created already-expired.
  expiresAt: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")
    .refine((value) => value >= todayIso(), "Expiry date cannot be in the past")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type InvoiceCreateInput = z.infer<typeof invoiceCreateSchema>;

/**
 * Validate a raw form payload. Returns either `{ ok: true, value }`
 * for the parsed input or `{ ok: false, errors }` with a per-field
 * map ready to drive the red error text under each input.
 */
export function validateInvoiceCreate(input: unknown):
  | { ok: true; value: InvoiceCreateInput }
  | { ok: false; errors: Partial<Record<keyof InvoiceCreateInput, string>> } {
  const parsed = invoiceCreateSchema.safeParse(input);
  if (parsed.success) return { ok: true, value: parsed.data };
  const errors: Partial<Record<keyof InvoiceCreateInput, string>> = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof InvoiceCreateInput | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}
