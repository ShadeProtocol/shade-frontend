import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Generic empty-state component used wherever a list (invoices,
 * subscriptions, etc.) has no rows to display. Centered layout with a
 * muted-foreground description and an optional icon + action button.
 *
 * See ShadeProtocol/shade-frontend#57.
 */
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  actionButton,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-background/50 px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-6"
        >
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {actionButton ? <div className="pt-1">{actionButton}</div> : null}
    </div>
  );
}

export default EmptyState;
