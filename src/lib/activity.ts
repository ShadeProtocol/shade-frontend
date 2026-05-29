export type ActivityEventType =
  | "invoice_paid"
  | "invoice_created"
  | "invoice_overdue"
  | "refund_issued"
  | "payment_failed"
  | "payout_sent"
  | "customer_added";

export type ActivityEvent = {
  id: string;
  type: ActivityEventType;
  description: string;
  amount?: number;
  currency?: string;
  timestamp: Date | string;
};