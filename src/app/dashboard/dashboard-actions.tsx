"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ShareInvoiceModal } from "@/components/ShareInvoiceModal";

export function DashboardActions() {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShareOpen(true)}
        className="gap-2"
      >
        <Share2 className="size-4" />
        Share invoice
      </Button>

      <ShareInvoiceModal
        invoiceId="INV-001"
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}
