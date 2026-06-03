"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { X, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface GenerateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (keyName: string) => void | Promise<void>;
}

export function GenerateApiKeyModal({
  isOpen,
  onClose,
  onSubmit,
}: GenerateApiKeyModalProps) {
  const [keyName, setKeyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset states when modal is opened or closed
  useEffect(() => {
    if (isOpen) {
      setKeyName("");
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = keyName.trim();
    if (!trimmed) {
      setError("Key name is required");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(trimmed);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate API key");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="api-key-modal-title"
        className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl animate-in scale-in duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <X className="size-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h2
              id="api-key-modal-title"
              className="text-lg font-bold tracking-tight text-foreground"
            >
              Generate API Key
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a new programmatic access token for your integrations.
            </p>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="flex flex-col gap-1.5 text-sm">
            <label htmlFor="key-name" className="font-semibold text-foreground">
              Key Name
            </label>
            <input
              id="key-name"
              type="text"
              required
              autoFocus
              value={keyName}
              onChange={(e) => {
                setKeyName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Production Backend"
              disabled={isSubmitting}
              className={`rounded-md border bg-background px-3 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 text-foreground ${
                error ? "border-destructive focus:ring-destructive" : "border-input focus:ring-ring"
              }`}
            />
            {error && (
              <p role="alert" className="text-xs font-semibold text-destructive mt-0.5">
                {error}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5"
            >
              {isSubmitting ? "Generating..." : "Generate key"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
