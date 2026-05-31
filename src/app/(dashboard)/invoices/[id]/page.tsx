import Link from "next/link";

import { InvoiceStatusBadge } from "@/components/invoice/invoice-status-badge";
import type { InvoiceStatus } from "@/lib/invoice-types";

export const metadata = {
  title: "Invoice details | Shade",
  description: "View invoice details.",
};

type InvoiceDetailsPageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function InvoiceDetailsPage({
  params,
}: InvoiceDetailsPageProps) {
  const { id } = await params;

  const amount = "450.00";
  const token = "USDC";
  const status: InvoiceStatus = "pending";
  const createdAt = "2026-05-12T14:30:00.000Z";
  const dueDate = "2026-06-12T14:30:00.000Z";
  const payerName = "Acme Corp";
  const payerEmail = "billing@acme.example";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header className="space-y-1">
        <Link
          href="/invoices"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to invoices
        </Link>
        <p className="text-sm font-semibold uppercase text-primary">
          Invoice {id}
        </p>
      </header>

      <section className="rounded-lg border bg-card p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Amount due
            </p>
            <p className="text-4xl font-bold tabular-nums tracking-tight">
              {amount}{" "}
              <span className="text-2xl font-semibold text-muted-foreground">
                {token}
              </span>
            </p>
          </div>
          <InvoiceStatusBadge status={status} className="text-sm px-3 py-1.5" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 border-t pt-8 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Created
            </p>
            <p className="text-sm font-medium">{formatDate(createdAt)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Due date
            </p>
            <p className="text-sm font-medium">{formatDate(dueDate)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Payer name
            </p>
            <p className="text-sm font-medium">{payerName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Payer email
            </p>
            <p className="text-sm font-medium">{payerEmail}</p>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </p>
            <p className="text-sm font-medium">
              Brand identity refresh — invoice reference {id}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
