import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        data-slot="input"
        className={cn(
          "flex h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-primary/20 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
