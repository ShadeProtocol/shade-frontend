"use client";

import { useState } from "react";
import { CalendarClock, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import type { SubscriptionFrequency } from "@/lib/subscription-types";

const frequencyLabels: Record<SubscriptionFrequency, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

type SubscriptionPlanCardProps = {
  name: string;
  amount: string;
  token: string;
  frequency: SubscriptionFrequency;
  activeSubscribers: number;
  defaultAcceptingNewSubscribers?: boolean;
  className?: string;
};

export function SubscriptionPlanCard({
  name,
  amount,
  token,
  frequency,
  activeSubscribers,
  defaultAcceptingNewSubscribers = true,
  className,
}: SubscriptionPlanCardProps) {
  const [acceptingNewSubscribers, setAcceptingNewSubscribers] = useState(
    defaultAcceptingNewSubscribers,
  );

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-1 bg-primary"
      />

      <div className="pl-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <h3 className="truncate text-lg font-semibold text-foreground">
              {name}
            </h3>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <CalendarClock className="size-3.5 shrink-0" />
              {frequencyLabels[frequency]}
            </div>
          </div>
          <p className="shrink-0 text-right">
            <span className="text-2xl font-bold tabular-nums text-foreground">
              {amount}
            </span>{" "}
            <span className="text-sm font-medium text-muted-foreground">
              {token}
            </span>
          </p>
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="size-4 shrink-0 text-primary" />
            <span className="font-medium text-foreground">
              {activeSubscribers.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              active subscriber{activeSubscribers === 1 ? "" : "s"}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Accepting New Subscribers
            </span>
            <Switch
              checked={acceptingNewSubscribers}
              onCheckedChange={setAcceptingNewSubscribers}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
