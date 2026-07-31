"use client";

import * as React from "react";

import { ConfirmDialog } from "@/components/confirm-dialog";

interface DeleteApiKeyModalProps {
  open: boolean;
  apiKeyName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteApiKeyModal({
  open,
  apiKeyName,
  onConfirm,
  onCancel,
}: DeleteApiKeyModalProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onCancel();
        }
      }}
      title="Delete API key"
      description="Deleting this API key will immediately break any existing integrations using it. This action cannot be undone."
      confirmLabel="Delete API key"
      variant="destructive"
      requireTypedConfirmation="DELETE"
      onConfirm={onConfirm}
    >
      <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        <p>
          Deleting <span className="font-semibold">{apiKeyName}</span> will
          break existing integrations.
        </p>
      </div>
    </ConfirmDialog>
  );
}
