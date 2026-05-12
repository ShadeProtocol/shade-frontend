import { Button } from "@/components/ui/button";

const stats = [
  { label: "Pending invoices", value: "12" },
  { label: "Paid volume", value: "$24.8k" },
  { label: "Withdrawable", value: "$8.4k" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-12 sm:px-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase text-primary">
            Shade payments
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-foreground sm:text-6xl">
            Blue-chip crypto checkout for Stellar merchants.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Create invoices, accept wallet payments, and track settlement from
            one clean merchant dashboard.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg">Create invoice</Button>
            <Button size="lg" variant="outline">
              Pay an invoice
            </Button>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border bg-card p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-bold text-primary">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
