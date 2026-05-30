"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { ManualTransferView } from "./manual-transfer-view";
import { PayWithConnectedWalletView } from "./pay-with-connected-wallet-view";

type PayTab = "connected-wallet" | "manual-transfer";

const tabs: Array<{ id: PayTab; label: string }> = [
  { id: "connected-wallet", label: "Pay with Connected Wallet" },
  { id: "manual-transfer", label: "Manual transfer" },
];

export function PayTabs() {
  const [activeTab, setActiveTab] = useState<PayTab>("connected-wallet");

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div role="tablist" aria-label="Payment method" className="flex gap-2 border-b">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            type="button"
            id={`pay-tab-${id}`}
            aria-selected={activeTab === id}
            aria-controls={`pay-panel-${id}`}
            onClick={() => setActiveTab(id)}
            className={cn(
              "rounded-t-md px-4 py-2 text-sm font-medium transition-colors",
              activeTab === id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id="pay-panel-connected-wallet"
        aria-labelledby="pay-tab-connected-wallet"
        hidden={activeTab !== "connected-wallet"}
      >
        <PayWithConnectedWalletView />
      </div>

      <div
        role="tabpanel"
        id="pay-panel-manual-transfer"
        aria-labelledby="pay-tab-manual-transfer"
        hidden={activeTab !== "manual-transfer"}
      >
        <ManualTransferView />
      </div>
    </div>
  );
}
