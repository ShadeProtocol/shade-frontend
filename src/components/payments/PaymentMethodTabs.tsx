'use client';

import * as React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

export interface PaymentMethodTabsProps {
  walletContent: React.ReactNode;
  manualTransferContent: React.ReactNode;
  className?: string;
}

export function PaymentMethodTabs({
  walletContent,
  manualTransferContent,
  className,
}: PaymentMethodTabsProps) {
  return (
    <Tabs.Root defaultValue="wallet" className={cn("w-full", className)}>
      <Tabs.List className="inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 w-full max-w-md mx-auto mb-6">
        <Tabs.Trigger
          value="wallet"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm flex-1"
        >
          Connect Wallet
        </Tabs.Trigger>
        <Tabs.Trigger
          value="manual"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm flex-1"
        >
          Manual Transfer
        </Tabs.Trigger>
      </Tabs.List>
      
      <Tabs.Content
        value="wallet"
        className="mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
      >
        {walletContent}
      </Tabs.Content>
      
      <Tabs.Content
        value="manual"
        className="mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
      >
        {manualTransferContent}
      </Tabs.Content>
    </Tabs.Root>
  );
}
