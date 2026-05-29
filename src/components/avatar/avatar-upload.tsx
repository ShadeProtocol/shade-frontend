"use client";

import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { ImagePlus } from "lucide-react";

import { cn } from "@/lib/utils";

const ACCEPT = "image/png,image/jpeg,image/webp,image/svg+xml";

export type AvatarUploadProps = {
  shape?: "circle" | "square";
  initialPreviewUrl?: string;
  label?: string;
  onFileSelected?: (file: File, previewUrl: string) => void;
  className?: string;
};

export function AvatarUpload({
  shape = "circle",
  initialPreviewUrl,
  label = "Business logo",
  onFileSelected,
  className,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    initialPreviewUrl,
  );
  const objectUrlRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const next = URL.createObjectURL(file);
    objectUrlRef.current = next;
    setPreviewUrl(next);
    onFileSelected?.(file, next);

    event.target.value = "";
  }

  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-xl";

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <button
        type="button"
        onClick={openPicker}
        onKeyDown={handleKeyDown}
        aria-label={previewUrl ? `Change ${label}` : `Upload ${label}`}
        className={cn(
          "group relative flex size-24 items-center justify-center overflow-hidden border border-dashed border-input bg-muted/40 text-muted-foreground transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          shapeClass,
        )}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={label}
            className="size-full object-cover"
          />
        ) : (
          <ImagePlus className="size-7" aria-hidden />
        )}
        <span
          className={cn(
            "pointer-events-none absolute inset-0 hidden items-center justify-center bg-foreground/40 text-xs font-medium text-background group-hover:flex",
            shapeClass,
          )}
        >
          Change
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex flex-col gap-1 text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          PNG, JPG, WEBP or SVG. Click the avatar to pick a file.
        </span>
      </div>
    </div>
  );
}
