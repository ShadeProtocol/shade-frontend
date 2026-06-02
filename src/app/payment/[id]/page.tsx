"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PublicPaymentLayout } from "@/components/payment/PublicPaymentLayout";
import {
  PaymentInvoiceSummary,
  type InvoiceData,
} from "@/components/payment/PaymentInvoiceSummary";
import { InvalidInvoiceState } from "@/components/payment/InvalidInvoiceState";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Mock API service to fetch invoice by ID
const fetchMockInvoice = async (id: string): Promise<InvoiceData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === "invalid") {
        resolve({
          id,
          merchantName: "Unknown",
          description: "",
          amount: 0,
          tokenSymbol: "USDC",
          status: "invalid",
        });
      } else if (id === "expired") {
        resolve({
          id,
          merchantName: "Acme Corp",
          description: "Software Services",
          amount: 150.0,
          tokenSymbol: "USDC",
          status: "expired",
        });
      } else {
        // Default valid mock invoice
        resolve({
          id,
          merchantName: "DripWave Studios",
          description: "Freelance Design Work",
          amount: 50.0,
          tokenSymbol: "USDC",
          status: "valid",
        });
      }
    }, 1500); // 1.5s simulated network delay
  });
};

export default function PublicPaymentPage() {
  const params = useParams();
  const invoiceId = params?.id as string;

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!invoiceId) return;

    setLoading(true);
    fetchMockInvoice(invoiceId)
      .then((data) => {
        setInvoice(data);
      })
      .catch(() => {
        setInvoice(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [invoiceId]);

  return (
    <PublicPaymentLayout>
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading invoice details...
          </p>
        </div>
      ) : !invoice || invoice.status === "invalid" || invoice.status === "expired" ? (
        <InvalidInvoiceState
          message={
            invoice?.status === "expired"
              ? "This payment link has expired."
              : "This payment link is invalid or has expired."
          }
        />
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PaymentInvoiceSummary invoice={invoice} />

          {/* Placeholder for actual payment mechanism */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="font-semibold mb-4 text-center">
              Select Payment Method
            </h3>
            <Button className="w-full" size="lg">
              Connect Wallet to Pay
            </Button>
          </div>
        </div>
      )}
    </PublicPaymentLayout>
  );
}
