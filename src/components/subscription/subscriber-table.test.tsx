import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { SubscriberTable } from "./subscriber-table";
import type { Subscriber } from "@/lib/subscription-types";

const subscribers: Subscriber[] = [
  {
    id: "sub_1",
    walletAddress: "GA1B2C3D4E5F6G7H8I9J0KLMNOPQRSTUVWXYZ234567",
    startDate: "2026-01-15",
    status: "active",
  },
  {
    id: "sub_2",
    walletAddress: "GZ9Y8X7W6V5U4T3S2R1Q0PONMLKJIHGFEDCBA987654",
    startDate: "2026-03-02",
    status: "past_due",
  },
];

describe("SubscriberTable", () => {
  it("maps over subscriber data and renders a row for each subscriber", () => {
    render(<SubscriberTable subscribers={subscribers} />);

    // header row + one row per subscriber
    expect(screen.getAllByRole("row")).toHaveLength(subscribers.length + 1);
  });

  it("shows the wallet address, start date, and status for each subscriber", () => {
    render(<SubscriberTable subscribers={subscribers} />);

    const activeCell = screen.getByText("Active").closest("tr")!;
    expect(within(activeCell).getByText(/Jan 15, 2026/)).toBeInTheDocument();
    // full address is preserved in the title attribute
    expect(
      within(activeCell).getByTitle(subscribers[0].walletAddress),
    ).toBeInTheDocument();

    expect(screen.getByText("Past Due")).toBeInTheDocument();
  });

  it("renders an empty state when there are no subscribers", () => {
    render(<SubscriberTable subscribers={[]} />);

    expect(screen.getByText(/no subscribers yet/i)).toBeInTheDocument();
  });

  it("renders a custom empty state when provided", () => {
    render(
      <SubscriberTable subscribers={[]} emptyState="Nobody here." />,
    );

    expect(screen.getByText("Nobody here.")).toBeInTheDocument();
  });
});
