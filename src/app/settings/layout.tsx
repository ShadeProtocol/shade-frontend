import type { Metadata } from "next";

import { SettingsNav } from "@/components/settings/settings-nav";

export const metadata: Metadata = {
  title: "Settings | Shade",
  description: "Manage your Shade merchant profile and API keys.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="space-y-1">
          <p className="text-sm font-semibold uppercase text-primary">
            Shade merchant
          </p>
          <h1 className="text-3xl font-bold">Settings</h1>
        </header>
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <SettingsNav />
          <section className="min-w-0 flex-1 rounded-lg border bg-card p-6 shadow-sm">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
