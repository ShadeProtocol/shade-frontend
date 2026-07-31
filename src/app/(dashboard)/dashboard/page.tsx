import { DollarSign, FileText, TrendingUp, Users } from "lucide-react";

import RecentActivity from "@/components/RecentActivity";
import { RequireWalletSession } from "@/components/require-wallet-session";
import RevenueChart from "@/components/RevenueChart";
import { ApiKeyManagement } from "@/components/dashboard/api-key-management";
import { StatCard } from "@/components/StatCard";
import type { ActivityEvent } from "@/lib/activity";
import { DashboardActions } from "./dashboard-actions";

export const metadata = {
  title: "Dashboard | Shade",
  description: "Shade merchant dashboard.",
};

const RECENT_ACTIVITY_EVENTS: ActivityEvent[] = [
  {
    id: "evt_1",
    type: "invoice_paid",
    description: "Invoice INV-1042 was paid",
    amount: 1840,
    currency: "USD",
    timestamp: "2026-06-23T10:15:00Z",
  },
  {
    id: "evt_2",
    type: "invoice_created",
    description: "New invoice INV-1043 was created",
    amount: 620,
    currency: "USD",
    timestamp: "2026-06-23T08:40:00Z",
  },
  {
    id: "evt_3",
    type: "customer_added",
    description: "Acme Labs was added as a customer",
    timestamp: "2026-06-22T16:20:00Z",
  },
  {
    id: "evt_4",
    type: "payout_sent",
    description: "Weekly payout sent to connected wallet",
    amount: 3120,
    currency: "USD",
    timestamp: "2026-06-21T12:00:00Z",
  },
];

export default function DashboardPage() {
  return (
    <RequireWalletSession>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back. Here&apos;s an overview of your business.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total revenue"
            value="$12,430"
            icon={<DollarSign className="size-4" />}
            trend={12.5}
          />
          <StatCard
            title="Active invoices"
            value="24"
            icon={<FileText className="size-4" />}
            trend={-3.2}
          />
          <StatCard
            title="Total customers"
            value="138"
            icon={<Users className="size-4" />}
            trend={8.1}
          />
          <StatCard
            title="Payment volume"
            value="$9,870"
            icon={<TrendingUp className="size-4" />}
            trend={5.4}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <RecentActivity events={RECENT_ACTIVITY_EVENTS} className="h-full" />
        </div>

        <DashboardActions />

        <ApiKeyManagement />
      </div>
    </RequireWalletSession>
  );
}
