"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeyRound, UserCircle, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SettingsNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const items: SettingsNavItem[] = [
  { href: "/settings/profile", label: "Profile", icon: UserCircle },
  { href: "/settings/api-keys", label: "API Keys", icon: KeyRound },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Settings sections"
      className="flex shrink-0 flex-row gap-1 overflow-x-auto rounded-lg border bg-card p-2 md:w-60 md:flex-col"
    >
      {items.map(({ href, label, icon: Icon }) => {
        const isActive =
          pathname === href ||
          (pathname?.startsWith(href + "/") ?? false);

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted",
            )}
          >
            <Icon className="size-4" aria-hidden />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
