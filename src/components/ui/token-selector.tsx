"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const XLMIcon = () => (
  <svg
    className="h-5 w-5 text-indigo-400 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.5 16.5c-1.5-1.25-2.5-3-2.5-5 0-3.87 3.13-7 7-7 2 0 3.75 1 5 2.5" />
    <path d="M19.5 7.5c1.5 1.25 2.5 3 2.5 5 0 3.87-3.13 7-7 7-2 0-3.75-1-5-2.5" />
    <line x1="6" y1="18" x2="18" y2="6" />
    <line x1="9" y1="21" x2="21" y2="9" />
  </svg>
);

export const USDCIcon = () => (
  <svg
    className="h-5 w-5 text-blue-500 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12" />
    <path d="M15 9.5a2.5 2.5 0 0 0-5 0v0a2.5 2.5 0 0 0 5 0" />
    <path d="M14 14.5a2.5 2.5 0 0 1-5 0v0a2.5 2.5 0 0 1 5 0" />
  </svg>
);

export const EURCIcon = () => (
  <svg
    className="h-5 w-5 text-emerald-500 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M15 9a4 4 0 0 0-6 3.5 4 4 0 0 0 6 3.5" />
    <path d="M8 11h6" />
    <path d="M8 13h6" />
  </svg>
);

export type TokenOption = {
  symbol: string;
  name: string;
  icon: React.ReactNode;
};

export const tokens: TokenOption[] = [
  { symbol: "XLM", name: "Stellar Lumens", icon: <XLMIcon /> },
  { symbol: "USDC", name: "USD Coin", icon: <USDCIcon /> },
  { symbol: "EURC", name: "Euro Coin", icon: <EURCIcon /> },
];

export interface TokenSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TokenSelector({ value, onChange, disabled }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedToken = tokens.find((t) => t.symbol === value) || tokens[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (symbol: string) => {
    onChange(symbol);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-left",
          isOpen && "ring-2 ring-ring"
        )}
      >
        <span className="flex items-center gap-2">
          {selectedToken.icon}
          <span className="font-medium text-foreground">{selectedToken.symbol}</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            ({selectedToken.name})
          </span>
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label="Select Stellar token"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-50 slide-in-from-top-1 duration-150 focus:outline-none"
        >
          {tokens.map((token) => {
            const isSelected = token.symbol === value;
            return (
              <li
                key={token.symbol}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(token.symbol)}
                className={cn(
                  "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  isSelected && "bg-accent/50 text-accent-foreground font-medium"
                )}
              >
                <span className="flex items-center gap-2">
                  {token.icon}
                  <span>{token.symbol}</span>
                  <span className="text-xs text-muted-foreground">({token.name})</span>
                </span>
                {isSelected && (
                  <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
