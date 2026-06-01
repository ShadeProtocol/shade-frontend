import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: number;
};

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  const isPositive = trend >= 0;

  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>

      <div
        className={cn(
          "mt-2 flex items-center gap-1 text-xs font-medium",
          isPositive
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400",
        )}
      >
        {isPositive ? (
          <TrendingUp className="size-3.5 shrink-0" />
        ) : (
          <TrendingDown className="size-3.5 shrink-0" />
        )}
        <span>
          {isPositive ? "+" : ""}
          {trend}%
        </span>
        <span className="font-normal text-muted-foreground">vs last month</span>
      </div>
    </div>
  );
}
