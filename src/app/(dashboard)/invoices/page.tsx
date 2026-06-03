import { InvoicesClient } from "./invoices-client";

export const metadata = {
  title: "Invoices | Shade",
  description: "Generate and review your Shade invoices.",
};

export default function InvoicesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header className="space-y-1">
        <p className="text-sm font-semibold uppercase text-primary">
          Shade merchant
        </p>
        <h1 className="text-3xl font-bold">Invoices</h1>
      </header>
      <InvoicesClient />
    </div>
  );
}
