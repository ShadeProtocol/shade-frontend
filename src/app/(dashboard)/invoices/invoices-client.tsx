"use client";

import { useEffect, useState } from "react";

import { InvoiceForm } from "@/components/invoice/invoice-form";
import { InvoiceControls } from "@/components/invoice/invoice-controls";
import { InvoiceTable } from "@/components/invoice/invoice-table";
import { InvoicePagination } from "@/components/invoice/invoice-pagination";
import type { Invoice } from "@/lib/invoice-types";

const PAGE_SIZE = 10;

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
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const filteredAndSortedInvoices = invoices
    .filter((invoice) => {
      const query = search.toLowerCase();
      const matchesSearch =
        invoice.referenceId.toLowerCase().includes(query) ||
        invoice.description.toLowerCase().includes(query);
      const matchesStatus = status === "all" || invoice.status === status;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "amount-high") {
        return Number(b.amount) - Number(a.amount);
      }
      if (sortBy === "amount-low") {
        return Number(a.amount) - Number(b.amount);
      }
      return 0;
    });

  const pageCount = Math.max(
    1,
    Math.ceil(filteredAndSortedInvoices.length / PAGE_SIZE),
  );

  // Reset to the first page whenever the result set changes so we never land
  // on a page that no longer exists (e.g. after filtering down the list).
  useEffect(() => {
    setPage(1);
  }, [search, status, sortBy, filteredAndSortedInvoices.length]);

  const paginatedInvoices = filteredAndSortedInvoices.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div className="flex flex-col gap-8">
      <InvoiceForm
        onSubmit={(invoice) =>
          setInvoices((current) => [invoice, ...current])
        }
      />
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Your invoices</h2>
        <InvoiceControls
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <InvoiceTable
          invoices={paginatedInvoices}
          emptyState="No invoices match your search or filter criteria."
        />
        {filteredAndSortedInvoices.length > 0 && (
          <InvoicePagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        )}
      </section>
    </div>
  );
}

