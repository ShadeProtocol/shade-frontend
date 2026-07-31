"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmVariant = "default" | "destructive";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Visual weight of the confirm button. */
  variant?: ConfirmVariant;
  /**
   * When set, the confirm button stays disabled until the user types this
   * exact string — the "type DELETE to confirm" pattern.
   */
  requireTypedConfirmation?: string;
  /** Label rendered above the typed-confirmation input. */
  typedConfirmationLabel?: React.ReactNode;
  /** Extra content rendered between the description and the footer. */
  children?: React.ReactNode;
  /** Disables the confirm button for reasons owned by the caller. */
  confirmDisabled?: boolean;
  /** Called on confirm. The dialog closes once a returned promise resolves. */
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  requireTypedConfirmation,
  typedConfirmationLabel,
  children,
  confirmDisabled = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [typedValue, setTypedValue] = React.useState("");
  const [isConfirming, setIsConfirming] = React.useState(false);
  const inputId = React.useId();

  React.useEffect(() => {
    if (!open) {
      setTypedValue("");
      setIsConfirming(false);
    }
  }, [open]);

  const typedConfirmationSatisfied =
    !requireTypedConfirmation || typedValue === requireTypedConfirmation;
  const canConfirm =
    !confirmDisabled && !isConfirming && typedConfirmationSatisfied;

  async function handleConfirm() {
    if (!canConfirm) {
      return;
    }

    const result = onConfirm();

    if (!(result instanceof Promise)) {
      onOpenChange(false);
      return;
    }

    setIsConfirming(true);

    try {
      await result;
      onOpenChange(false);
    } catch {
      // The dialog stays open so the user can retry. Surfacing the failure is
      // the caller's job, since only it knows what went wrong.
    } finally {
      setIsConfirming(false);
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isConfirming) {
      return;
    }

    if (!nextOpen) {
      onCancel?.();
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={!isConfirming}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children}

        {requireTypedConfirmation ? (
          <div className="space-y-2">
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-foreground"
            >
              {typedConfirmationLabel ?? (
                <>
                  Type{" "}
                  <span className="font-semibold">
                    {requireTypedConfirmation}
                  </span>{" "}
                  to confirm
                </>
              )}
            </label>
            <input
              id={inputId}
              type="text"
              autoComplete="off"
              value={typedValue}
              disabled={isConfirming}
              onChange={(event) => setTypedValue(event.target.value)}
              placeholder={requireTypedConfirmation}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
            />
          </div>
        ) : null}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isConfirming}>
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={variant}
            disabled={!canConfirm}
            onClick={handleConfirm}
          >
            {isConfirming ? <Loader2 className="animate-spin" /> : null}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
