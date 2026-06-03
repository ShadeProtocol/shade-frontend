import { cn } from "@/lib/utils";
import type { SubscriberStatus } from "@/lib/subscription-types";

const statusStyles: Record<SubscriberStatus, string> = {
  active:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  past_due: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300",
};

const statusLabels: Record<SubscriberStatus, string> = {
  active: "Active",
  past_due: "Past Due",
};

type SubscriberStatusBadgeProps = {
  status: SubscriberStatus;
  className?: string;
};

export function SubscriberStatusBadge({
  status,
  className,
}: SubscriberStatusBadgeProps) {
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
