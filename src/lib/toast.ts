/**
 * Thin wrapper around `sonner` so feature code does not have to import the
 * library directly and stays portable if the toast provider changes later.
 *
 * Usage:
 *
 *   import { notify } from "@/lib/toast";
 *
 *   notify.success("Link copied");
 *   notify.error("Could not save changes");
 *   notify.info("Heads up", "Your session expires in 5 minutes");
 *
 * The `<Toaster />` mount point lives in `src/app/layout.tsx`, so toasts
 * fire from any client component without additional wiring.
 *
 * See ShadeProtocol/shade-frontend#59.
 */
import { toast } from "sonner";

export const notify = {
  success: (title: string, description?: string) =>
    toast.success(title, description ? { description } : undefined),
  error: (title: string, description?: string) =>
    toast.error(title, description ? { description } : undefined),
  info: (title: string, description?: string) =>
    toast(title, description ? { description } : undefined),
  warning: (title: string, description?: string) =>
    toast.warning(title, description ? { description } : undefined),
  /** Direct access to the underlying `sonner` toast for advanced cases
   * (promise toasts, custom JSX, etc.). */
  raw: toast,
};

export type Notify = typeof notify;
