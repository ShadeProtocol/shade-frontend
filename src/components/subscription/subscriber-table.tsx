import { SubscriberStatusBadge } from "@/components/subscription/subscriber-status-badge";
import { cn } from "@/lib/utils";
import type { Subscriber } from "@/lib/subscription-types";

function formatStartDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function shortenAddress(address: string) {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

type SubscriberTableProps = {
  subscribers: Subscriber[];
  className?: string;
  emptyState?: React.ReactNode;
};

export function SubscriberTable({
  subscribers,
  className,
  emptyState,
}: SubscriberTableProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-x-auto rounded-lg border bg-card shadow-sm",
        className,
      )}
    >
      <table className="w-full min-w-[480px] border-collapse text-left text-sm">
        <thead className="sticky top-0 z-10 bg-muted text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Wallet address
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Start date
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {subscribers.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="px-4 py-12 text-center text-sm text-muted-foreground"
              >
                {emptyState ?? "No subscribers yet."}
              </td>
            </tr>
          ) : (
            subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="border-t hover:bg-muted/40">
                <td
                  className="px-4 py-3 font-mono text-xs"
                  title={subscriber.walletAddress}
                >
                  {shortenAddress(subscriber.walletAddress)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatStartDate(subscriber.startDate)}
                </td>
                <td className="px-4 py-3">
                  <SubscriberStatusBadge status={subscriber.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
