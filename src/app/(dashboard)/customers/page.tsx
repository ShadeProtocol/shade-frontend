export const metadata = {
  title: "Customers | Shade",
  description: "Review and manage Shade customers.",
};

export default function CustomersPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header className="space-y-1">
        <p className="text-sm font-semibold uppercase text-primary">
          Shade merchant
        </p>
        <h1 className="text-3xl font-bold">Customers</h1>
      </header>

      <section className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-card-foreground">
          Customer management
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Customer profiles and payment history will appear here.
        </p>
      </section>
    </div>
  );
}
