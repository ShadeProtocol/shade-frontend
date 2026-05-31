import { DollarSign, FileText, TrendingUp, Users } from "lucide-react";

import { ApiKeyManagement } from "@/components/dashboard/api-key-management";
import { StatCard } from "@/components/StatCard";
import { DashboardActions } from "./dashboard-actions";

export const metadata = {
  title: "Dashboard | Shade",
  description: "Shade merchant dashboard.",
};

export default function DashboardPage() {
  return (
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

      <DashboardActions />

      <ApiKeyManagement />
    </div>
  );
}
