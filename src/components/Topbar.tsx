"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Wallet } from "lucide-react";

import { useTheme } from "@/components/ThemeProvider";
import { getMerchantSessionAddress } from "@/lib/merchant-storage";

function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function Topbar() {
  const { isDark, toggleTheme } = useTheme();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    setWalletAddress(getMerchantSessionAddress());
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-30 ml-60 flex h-16 items-center justify-between border-b bg-background px-6">
      <div />

      <div className="flex items-center gap-3">
        {walletAddress ? (
          <div className="flex items-center gap-2 rounded-md border bg-secondary/60 px-3 py-1.5">
            <Wallet className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="font-mono text-xs font-medium text-secondary-foreground">
              {truncateAddress(walletAddress)}
            </span>
          </div>
        ) : null}

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </div>
    </header>
  );
}
