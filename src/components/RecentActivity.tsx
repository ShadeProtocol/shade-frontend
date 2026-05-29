import * as React from "react";
import { cn } from "@/lib/utils";
import type { ActivityEvent, ActivityEventType } from "@/lib/activity";

export interface RecentActivityProps {
  events?: ActivityEvent[];
  className?: string;
  maxItems?: number;
}

// Helpers

function formatRelativeTime(ts: Date | string): string {
  const date = ts instanceof Date ? ts : new Date(ts);
  const diffMs = Date.now() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatAmount(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// Icon components (inline SVG, no external deps)

const icons: Record<ActivityEventType, React.ReactNode> = {
  invoice_paid: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.5 10.5l2.5 2.5 4.5-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  invoice_created: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
      <rect
        x="4"
        y="3"
        width="12"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 7h6M7 10h6M7 13h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  invoice_overdue: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
      <path
        d="M10 3l7.5 13H2.5L10 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 9v3M10 14.5v.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  ),
  refund_issued: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
      <path
        d="M4 10a6 6 0 1 1 .5 2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4 14v-4H8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  payment_failed: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 7l6 6M13 7l-6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  ),
  payout_sent: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
      <path
        d="M3 10h14M12 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  customer_added: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
      <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2 17c0-3.314 2.686-5 6-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15 12v6M12 15h6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  ),
};

// Styling config

const eventConfig: Record<
  ActivityEventType,
  { iconBg: string; iconColor: string; amountColor: string }
> = {
  invoice_paid: {
    iconBg: "bg-emerald-100 dark:bg-emerald-950",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    amountColor: "text-emerald-600 dark:text-emerald-400",
  },
  invoice_created: {
    iconBg: "bg-[color:var(--accent)]",
    iconColor: "text-[color:var(--primary)]",
    amountColor: "text-[color:var(--foreground)]",
  },
  invoice_overdue: {
    iconBg: "bg-amber-100 dark:bg-amber-950",
    iconColor: "text-amber-600 dark:text-amber-400",
    amountColor: "text-amber-600 dark:text-amber-400",
  },
  refund_issued: {
    iconBg: "bg-sky-100 dark:bg-sky-950",
    iconColor: "text-sky-600 dark:text-sky-400",
    amountColor: "text-sky-600 dark:text-sky-400",
  },
  payment_failed: {
    iconBg: "bg-red-100 dark:bg-red-950",
    iconColor: "text-[color:var(--destructive)]",
    amountColor: "text-[color:var(--destructive)]",
  },
  payout_sent: {
    iconBg: "bg-violet-100 dark:bg-violet-950",
    iconColor: "text-violet-600 dark:text-violet-400",
    amountColor: "text-violet-600 dark:text-violet-400",
  },
  customer_added: {
    iconBg: "bg-[color:var(--muted)]",
    iconColor: "text-[color:var(--muted-foreground)]",
    amountColor: "text-[color:var(--muted-foreground)]",
  },
};

// Empty state

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 px-4">
      <div className="flex size-12 items-center justify-center rounded-full bg-[color:var(--muted)]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-6 text-[color:var(--muted-foreground)]"
          aria-hidden="true"
        >
          <path
            d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-[color:var(--foreground)]">
          No recent activity
        </p>
        <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
          Events like payments and invoices will appear here.
        </p>
      </div>
    </div>
  );
}

// Single row

function ActivityRow({
  event,
  isLast,
}: {
  event: ActivityEvent;
  isLast: boolean;
}) {
  const cfg = eventConfig[event.type];

  return (
    <li
      className={cn(
        "group flex items-center gap-3 px-4 py-3 transition-colors duration-150",
        "hover:bg-[color:var(--accent)]/40",
        !isLast && "border-b border-[color:var(--border)]",
      )}
    >
      {/* Icon badge */}
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          cfg.iconBg,
          cfg.iconColor,
        )}
        aria-hidden="true"
      >
        {icons[event.type]}
      </span>

      {/* Description */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[color:var(--foreground)]">
          {event.description}
        </p>
        <p className="mt-0.5 text-xs text-[color:var(--muted-foreground)]">
          {formatRelativeTime(event.timestamp)}
        </p>
      </div>

      {/* Amount */}
      {event.amount !== undefined && (
        <span
          className={cn(
            "shrink-0 text-sm font-semibold tabular-nums",
            cfg.amountColor,
          )}
        >
          {formatAmount(event.amount, event.currency)}
        </span>
      )}
    </li>
  );
}

export function RecentActivity({
  events = [],
  className,
  maxItems = 10,
}: RecentActivityProps) {
  const visible = events.slice(0, maxItems);

  return (
    <section
      aria-label="Recent activity"
      className={cn(
        "flex flex-col rounded-xl border border-[color:var(--border)]",
        "bg-[color:var(--card)] text-[color:var(--card-foreground)]",
        "shadow-sm overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3">
        <h2 className="text-sm font-semibold text-[color:var(--foreground)]">
          Recent Activity
        </h2>
        {visible.length > 0 && (
          <span className="rounded-full bg-[color:var(--muted)] px-2 py-0.5 text-xs font-medium text-[color:var(--muted-foreground)]">
            {visible.length}
          </span>
        )}
      </div>

      {/* Body */}
      {visible.length === 0 ? (
        <EmptyState />
      ) : (
        <ul role="list" className="flex flex-col">
          {visible.map((event, i) => (
            <ActivityRow
              key={event.id}
              event={event}
              isLast={i === visible.length - 1}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default RecentActivity;
