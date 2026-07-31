import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "flex min-h-28 w-full rounded-md border bg-background px-3 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-primary/20 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
