import { PayTabs } from "@/components/pay/pay-tabs";

export const metadata = {
  title: "Pay invoice | Shade",
  description: "Settle a Shade invoice with your Stellar wallet.",
};

export default function PayPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="space-y-1">
          <p className="text-sm font-semibold uppercase text-primary">
            Shade
          </p>
          <h1 className="text-3xl font-bold">Pay invoice</h1>
          <p className="text-sm text-muted-foreground">
            Choose how you want to settle this invoice.
          </p>
        </header>
        <PayTabs />
      </div>
    </main>
  );
}
