"use client";

import { useState } from "react";

import { AvatarUpload } from "@/components/avatar/avatar-upload";
import { InvoiceCreateForm } from "@/components/invoice/invoice-create-form";
import { InvoiceLookupForm } from "@/components/invoice/invoice-lookup-form";
import {
  InvoiceTimeline,
  type InvoiceTimelineEvent,
} from "@/components/timeline/invoice-timeline";

const seedEvents: InvoiceTimelineEvent[] = [
  {
    id: "created",
    name: "Invoice Created",
    timestamp: "2026-05-20T09:05:00.000Z",
    description: "Reference INV-DEMO-002 generated for the May retainer.",
  },
  {
    id: "viewed",
    name: "Payer Opened Link",
    timestamp: "2026-05-21T14:32:00.000Z",
  },
  {
    id: "paid",
    name: "Payment Received",
    timestamp: "2026-05-22T11:10:00.000Z",
    description: "1,200 XLM settled on Stellar testnet.",
  },
];

export function InvoiceToolsClient() {
  const [lastReference, setLastReference] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Create invoice (with validation)</h2>
        <InvoiceCreateForm
          onDraft={(draft) => {
            console.log("Draft saved:", draft);
            alert(`Draft saved for: ${draft.description || "unnamed invoice"}`);
          }}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Payer lookup</h2>
        <InvoiceLookupForm
          onSubmit={(reference) => setLastReference(reference)}
        />
        {lastReference ? (
          <p
            role="status"
            className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
          >
            Looking up <span className="font-mono">{lastReference}</span>…
          </p>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Business logo</h2>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <AvatarUpload />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Invoice timeline</h2>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <InvoiceTimeline events={seedEvents} />
        </div>
      </section>
    </div>
  );
}
