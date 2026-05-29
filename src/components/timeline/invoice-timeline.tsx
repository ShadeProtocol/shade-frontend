import { cn } from "@/lib/utils";

export type InvoiceTimelineEvent = {
  id: string;
  name: string;
  description?: string;
  timestamp: string;
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return dateFormatter.format(date);
}

export function InvoiceTimeline({
  events,
  className,
}: {
  events: InvoiceTimelineEvent[];
  className?: string;
}) {
  if (events.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        No timeline events yet.
      </p>
    );
  }

  return (
    <ol
      role="list"
      aria-label="Invoice timeline"
      className={cn("relative flex flex-col gap-6", className)}
    >
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        return (
          <li key={event.id} className="relative flex gap-4 pl-2">
            <div className="flex flex-col items-center">
              <span
                aria-hidden
                className="z-10 mt-1 size-3 shrink-0 rounded-full border-2 border-primary bg-background"
              />
              {!isLast ? (
                <span
                  aria-hidden
                  className="w-px flex-1 bg-border"
                />
              ) : null}
            </div>
            <div className="flex flex-col gap-0.5 pb-2">
              <span className="text-sm font-semibold text-foreground">
                {event.name}
              </span>
              <time
                dateTime={event.timestamp}
                className="text-xs text-muted-foreground"
              >
                {formatTimestamp(event.timestamp)}
              </time>
              {event.description ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {event.description}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
