import { Skeleton } from "@/components/ui/skeleton";

export function StatCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="size-9 rounded-md" />
      </div>

      <Skeleton className="mt-3 h-8 w-20" />

      <div className="mt-2 flex items-center gap-1">
        <Skeleton className="size-3.5 shrink-0" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}
