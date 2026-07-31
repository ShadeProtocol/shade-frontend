import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground"
    >
      <Loader2 className="size-8 animate-spin text-primary" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
