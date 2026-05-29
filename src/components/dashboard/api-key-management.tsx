"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { DeleteApiKeyModal } from "@/components/api-key-management/delete-api-key-modal";

const apiKeyName = "Shade Merchant Key";

export function ApiKeyManagement() {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [isDeleted, setIsDeleted] = React.useState(false);

  const handleDelete = () => {
    setShowDeleteModal(false);
    setIsDeleted(true);
  };

  return (
    <section className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            API key management
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-foreground">
            Manage your API keys
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Securely delete API keys and confirm destructive actions before they
            break existing integrations.
          </p>
        </div>
        <Button variant="secondary" size="sm">
          Create API key
        </Button>
      </div>

      <div className="rounded-3xl border border-border bg-background p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-foreground">
              {apiKeyName}
            </p>
            <p className="text-sm text-muted-foreground">
              API key issued today
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              Copy
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {isDeleted ? (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          API key deleted. Existing integrations may stop working.
        </div>
      ) : null}

      <DeleteApiKeyModal
        open={showDeleteModal}
        apiKeyName={apiKeyName}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </section>
  );
}
