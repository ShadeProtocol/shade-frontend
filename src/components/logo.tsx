import Image from "next/image";

import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

const SIZES: Record<LogoSize, { mark: number; gap: string; wordmark: string }> =
  {
    sm: { mark: 24, gap: "gap-2", wordmark: "text-sm" },
    md: { mark: 28, gap: "gap-2.5", wordmark: "text-base" },
    lg: { mark: 32, gap: "gap-2.5", wordmark: "text-xl" },
  };

type LogoProps = {
  size?: LogoSize;
  showWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
  priority?: boolean;
};

export function Logo({
  size = "md",
  showWordmark = true,
  className,
  wordmarkClassName,
  priority = false,
}: LogoProps) {
  const { mark, gap, wordmark } = SIZES[size];

  return (
    <span className={cn("inline-flex items-center", gap, className)}>
      <Image
        src="/shade_logo_transparent.png"
        alt={showWordmark ? "" : "Shade"}
        aria-hidden={showWordmark || undefined}
        width={mark}
        height={mark}
        priority={priority}
        className="shrink-0"
      />
      {showWordmark ? (
        <span
          className={cn(
            "font-bold tracking-tight text-foreground",
            wordmark,
            wordmarkClassName,
          )}
        >
          Shade
        </span>
      ) : null}
    </span>
  );
}

export type { LogoProps, LogoSize };
