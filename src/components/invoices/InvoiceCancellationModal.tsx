"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { ConfirmDialog } from "@/components/confirm-dialog";

export interface InvoiceCancellationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function InvoiceCancellationModal({
  open,
  onOpenChange,
  onConfirm,
}: InvoiceCancellationModalProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <>
          <AlertTriangle className="size-5 text-destructive" />
          Cancel Invoice
        </>
      }
      description="Are you sure you want to cancel this invoice? This cannot be undone."
      confirmLabel="Confirm Cancellation"
      variant="destructive"
      onConfirm={onConfirm}
    />
  );
}
