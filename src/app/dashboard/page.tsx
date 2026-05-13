export const metadata = {
  title: "Dashboard | Shade",
  description: "Shade merchant dashboard.",
};

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <section className="w-full max-w-xl rounded-lg border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase text-primary">
          Shade merchant
        </p>
        <h1 className="mt-3 text-3xl font-bold">Dashboard coming next</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Your wallet is verified and your merchant profile is ready.
        </p>
      </section>
    </main>
  );
}
