"use client";

import * as React from "react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

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
  const [confirmation, setConfirmation] = React.useState("");
  const isConfirmed = confirmation === "DELETE";

  React.useEffect(() => {
    if (!open) {
      setConfirmation("");
    }
  }, [open]);

  return (
    <ConfirmationModal
      open={open}
      title="Delete API key"
      description="Deleting this API key will immediately break any existing integrations using it. This action cannot be undone."
      confirmLabel="Delete API key"
      cancelLabel="Cancel"
      confirmDisabled={!isConfirmed}
      variant="destructive"
      onCancel={onCancel}
      onConfirm={() => {
        onConfirm();
        setConfirmation("");
      }}
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <p>
            Deleting <span className="font-semibold">{apiKeyName}</span> will
            break existing integrations.
          </p>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="delete-api-key-confirmation"
            className="block text-sm font-medium text-foreground"
          >
            Type <span className="font-semibold">DELETE</span> to confirm
          </label>
          <input
            id="delete-api-key-confirmation"
            type="text"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            placeholder="Type DELETE to confirm"
            aria-label="Type DELETE to confirm API key deletion"
          />
        </div>
      </div>
    </ConfirmationModal>
  );
}
