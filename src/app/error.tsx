"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <section className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <AlertTriangle className="size-6" />
          </div>
          <h1 className="mt-5 text-3xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            An unexpected error occurred while loading this page. You can try
            again, or head back if the problem continues.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error.message || "Unknown error."}
            {error.digest ? (
              <p className="mt-2 break-all text-xs opacity-80">
                Reference: {error.digest}
              </p>
            ) : null}
          </div>

          <Button className="w-full" size="lg" onClick={() => reset()}>
            <RotateCcw />
            Try again
          </Button>
        </div>

        <div className="mt-8 flex justify-center">
          <Logo size="sm" />
        </div>
      </section>
    </main>
  );
}
