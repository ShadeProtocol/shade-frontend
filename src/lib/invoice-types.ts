export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue" | "cancelled";

export type Invoice = {
  referenceId: string;
  description: string;
  amount: string;
  token: string;
  status: InvoiceStatus;
  createdAt: string;
};
