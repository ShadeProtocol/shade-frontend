import { ApiKeyManagement } from "@/components/dashboard/api-key-management";

export const metadata = {
  title: "Dashboard | Shade",
  description: "Shade merchant dashboard.",
};

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <section className="w-full max-w-5xl space-y-8">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase text-primary">
            Shade merchant
          </p>
          <h1 className="mt-3 text-3xl font-bold">API key management</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Manage your merchant API keys and confirm destructive actions before
            they affect integrations.
          </p>
        </div>

        <ApiKeyManagement />
      </section>
    </main>
  );
}
