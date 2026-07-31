"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LogOut, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

import { clearMerchantSession } from "@/lib/merchant-storage";

export type DisconnectWalletMenuProps = {
  walletAddress: string;
};

function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function DisconnectWalletMenu({
  walletAddress,
}: DisconnectWalletMenuProps) {
  const router = useRouter();

  function handleDisconnect() {
    clearMerchantSession();
    router.replace("/sign-in");
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label="Wallet menu"
        className="inline-flex items-center gap-2 rounded-md border bg-secondary/60 px-3 py-1.5 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Wallet className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="font-mono text-xs font-medium text-secondary-foreground">
          {truncateAddress(walletAddress)}
        </span>
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[10rem] overflow-hidden rounded-md border bg-card p-1 text-card-foreground shadow-md"
        >
          <DropdownMenu.Item
            onSelect={handleDisconnect}
            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors focus:bg-destructive/10 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            <LogOut className="mr-2 size-4" />
            <span>Disconnect wallet</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
