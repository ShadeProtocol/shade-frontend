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

export type SubscriberStatus = "active" | "past_due";

export type Subscriber = {
  id: string;
  walletAddress: string;
  startDate: string;
  status: SubscriberStatus;
};
