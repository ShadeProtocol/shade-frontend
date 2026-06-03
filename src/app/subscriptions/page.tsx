import { Plus } from "lucide-react";

import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { SubscriptionPlanCard } from "@/components/subscription/subscription-plan-card";
import { Button } from "@/components/ui/button";
import type { SubscriptionPlan } from "@/lib/subscription-types";

const seedPlans: SubscriptionPlan[] = [
  {
    id: "plan-starter",
    name: "Starter",
    amount: "9.99",
    token: "USDC",
    frequency: "monthly",
    activeSubscribers: 42,
  },
  {
    id: "plan-pro",
    name: "Pro",
    amount: "49.00",
    token: "USDC",
    frequency: "monthly",
    activeSubscribers: 128,
  },
  {
    id: "plan-enterprise",
    name: "Enterprise",
    amount: "499.00",
    token: "XLM",
    frequency: "yearly",
    activeSubscribers: 7,
  },
  {
    id: "plan-weekly",
    name: "Weekly digest",
    amount: "5.00",
    token: "USDC",
    frequency: "weekly",
    activeSubscribers: 19,
  },
];

export const metadata = {
  title: "Subscriptions | Shade",
  description: "Manage your recurring subscription plans.",
};

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Topbar />

      <div className="ml-60 pt-16">
        <main className="min-h-[calc(100vh-4rem)] overflow-y-auto p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Subscriptions
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Create and manage recurring payment plans for your customers.
              </p>
            </div>
            <Button type="button" className="shrink-0 gap-2 self-start">
              <Plus className="size-4" />
              Create New Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {seedPlans.map((plan) => (
              <SubscriptionPlanCard
                key={plan.id}
                name={plan.name}
                amount={plan.amount}
                token={plan.token}
                frequency={plan.frequency}
                activeSubscribers={plan.activeSubscribers}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
