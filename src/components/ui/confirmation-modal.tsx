"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmDisabled?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export function ConfirmationModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmDisabled = false,
  variant = "destructive",
  onConfirm,
  onCancel,
  children,
}: ConfirmationModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const confirmButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onCancel]);

  React.useEffect(() => {
    if (open && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [open]);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/40 px-4 py-6"
      role="presentation"
      onClick={(event) => {
        if (event.target === overlayRef.current) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-xl rounded-3xl border border-border bg-popover p-6 shadow-xl"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <h2
              id={titleId}
              className="text-xl font-semibold leading-7 text-foreground"
            >
              {title}
            </h2>
            <p
              id={descriptionId}
              className="text-sm leading-6 text-muted-foreground"
            >
              {description}
            </p>
          </div>
          {children}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button
              ref={confirmButtonRef}
              variant={variant}
              onClick={onConfirm}
              disabled={confirmDisabled}
              className={cn(
                "disabled:cursor-not-allowed",
                confirmDisabled && "opacity-70",
              )}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
