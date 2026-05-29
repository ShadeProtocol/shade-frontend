"use client";

import { useState } from "react";

import { InvoiceForm } from "@/components/invoice/invoice-form";
import { InvoiceTable } from "@/components/invoice/invoice-table";
import type { Invoice } from "@/lib/invoice-types";

const seedInvoices: Invoice[] = [
  {
    referenceId: "INV-DEMO-001",
    description: "Brand identity refresh",
    amount: "450.00",
    token: "USDC",
    status: "paid",
    createdAt: "2026-05-12T14:30:00.000Z",
  },
  {
    referenceId: "INV-DEMO-002",
    description: "May retainer",
    amount: "1200.00",
    token: "XLM",
    status: "pending",
    createdAt: "2026-05-20T09:05:00.000Z",
  },
];

export function InvoicesClient() {
  const [invoices, setInvoices] = useState<Invoice[]>(seedInvoices);

  return (
    <div className="flex flex-col gap-8">
      <InvoiceForm
        onSubmit={(invoice) =>
          setInvoices((current) => [invoice, ...current])
        }
      />
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Your invoices</h2>
        <InvoiceTable invoices={invoices} />
      </section>
    </div>
  );
}
