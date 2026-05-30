import { InvoiceToolsClient } from "./invoice-tools-client";

export const metadata = {
  title: "Invoice tools | Shade",
  description: "Validation, lookup, timeline, and avatar components preview.",
};

export default function InvoiceToolsPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto w-full max-w-5xl space-y-10">
        <header className="space-y-1">
          <p className="text-sm font-semibold uppercase text-primary">
            Shade merchant
          </p>
          <h1 className="text-3xl font-bold">Invoice tools</h1>
          <p className="text-sm text-muted-foreground">
            Validated invoice creation, payer lookup, timeline, and logo
            uploader.
          </p>
        </header>
        <InvoiceToolsClient />
      </div>
    </main>
  );
}
