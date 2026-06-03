"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ApiKey } from "@/lib/api-key-types";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

type ApiKeyTableProps = {
  apiKeys: ApiKey[];
  onRevoke?: (id: string) => void;
  className?: string;
  emptyState?: React.ReactNode;
};

export function ApiKeyTable({
  apiKeys,
  onRevoke,
  className,
  emptyState,
}: ApiKeyTableProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-x-auto rounded-lg border bg-card shadow-sm",
        className,
      )}
    >
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead className="sticky top-0 z-10 bg-muted text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Name
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Created At
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Last Used
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-12 text-center text-sm text-muted-foreground"
              >
                {emptyState ?? "No API keys to display."}
              </td>
            </tr>
          ) : (
            apiKeys.map((apiKey) => (
              <tr key={apiKey.id} className="border-t hover:bg-muted/40">
                <td className="px-4 py-3 font-medium">{apiKey.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(apiKey.createdAt)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {apiKey.lastUsedAt
                    ? formatDate(apiKey.lastUsedAt)
                    : "Never"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => onRevoke?.(apiKey.id)}
                  >
                    <Trash2 className="size-3.5" />
                    Revoke
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
