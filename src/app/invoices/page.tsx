import { InvoicesClient } from "./invoices-client";

export const metadata = {
  title: "Invoices | Shade",
  description: "Generate and review your Shade invoices.",
};

export default function InvoicesPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="space-y-1">
          <p className="text-sm font-semibold uppercase text-primary">
            Shade merchant
          </p>
          <h1 className="text-3xl font-bold">Invoices</h1>
        </header>
        <InvoicesClient />
      </div>
    </main>
  );
}
