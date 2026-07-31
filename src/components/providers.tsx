"use client";

import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/ThemeProvider";

/**
 * Single composition point for every global provider in the app.
 *
 * `src/app/layout.tsx` renders `<Providers>` around `{children}` so new global
 * context providers are added here instead of being appended to the root
 * layout one by one.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </ThemeProvider>
  );
}
