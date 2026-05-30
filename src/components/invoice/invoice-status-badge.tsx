import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@/lib/invoice-types";

const statusStyles: Record<InvoiceStatus, string> = {
  paid: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  pending:
    "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
  cancelled: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300",
  draft: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  overdue: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300",
};

const statusLabels: Record<InvoiceStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  cancelled: "Cancelled",
  draft: "Draft",
  overdue: "Overdue",
};

type InvoiceStatusBadgeProps = {
  status: InvoiceStatus;
  className?: string;
};

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        statusStyles[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
