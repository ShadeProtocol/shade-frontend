import { InvoiceStatusBadge } from "@/components/invoice/invoice-status-badge";
import { cn } from "@/lib/utils";
import type { Invoice } from "@/lib/invoice-types";

function formatCreatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

type InvoiceTableProps = {
  invoices: Invoice[];
  className?: string;
  emptyState?: React.ReactNode;
};

export function InvoiceTable({ invoices, className, emptyState }: InvoiceTableProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-x-auto rounded-lg border bg-card shadow-sm",
        className,
      )}
    >
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead className="sticky top-0 z-10 bg-muted text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Reference ID
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Description
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Amount / Token
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Created
            </th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-12 text-center text-sm text-muted-foreground"
              >
                {emptyState ?? "No invoices to display."}
              </td>
            </tr>
          ) : (
            invoices.map((invoice) => (
              <tr
                key={invoice.referenceId}
                className="border-t hover:bg-muted/40"
              >
                <td className="px-4 py-3 font-mono text-xs">
                  {invoice.referenceId}
                </td>
                <td className="px-4 py-3">{invoice.description}</td>
                <td className="px-4 py-3 tabular-nums">
                  {invoice.amount}{" "}
                  <span className="text-muted-foreground">{invoice.token}</span>
                </td>
                <td className="px-4 py-3">
                  <InvoiceStatusBadge status={invoice.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatCreatedAt(invoice.createdAt)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
