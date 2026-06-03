"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type InvoicePaginationProps = {
  /** Current page, 1-based. */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /** Emitted with the target page when the user navigates. */
  onPageChange: (page: number) => void;
  className?: string;
};

export function InvoicePagination({
  page,
  pageCount,
  onPageChange,
  className,
}: InvoicePaginationProps) {
  const isFirstPage = page <= 1;
  const isLastPage = page >= pageCount;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-1",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Page {page} of {pageCount}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={isFirstPage}
          aria-label="Previous page"
        >
          <ChevronLeft />
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={isLastPage}
          aria-label="Next page"
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
