export type SubscriptionFrequency =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly";

export type SubscriptionPlan = {
  id: string;
  name: string;
  amount: string;
  token: string;
  frequency: SubscriptionFrequency;
  activeSubscribers: number;
};
