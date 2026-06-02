import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { BillingPlanForm } from "./billing-plan-form";

describe("BillingPlanForm", () => {
  it("captures every field and submits the parsed plan", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<BillingPlanForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/plan name/i), "Pro membership");
    await user.type(
      screen.getByLabelText(/description/i),
      "Monthly pro access",
    );
    await user.type(screen.getByLabelText(/^amount$/i), "19.99");
    await user.selectOptions(
      screen.getByLabelText(/billing interval/i),
      "yearly",
    );
    await user.type(
      screen.getByLabelText(/customer email/i),
      "buyer@example.com",
    );

    await user.click(screen.getByRole("button", { name: /create plan/i }));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1));
    expect(handleSubmit).toHaveBeenCalledWith({
      name: "Pro membership",
      description: "Monthly pro access",
      amount: 19.99,
      interval: "yearly",
      customerEmail: "buyer@example.com",
    });
  });

  it("blocks submission and shows errors when required fields are empty", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<BillingPlanForm onSubmit={handleSubmit} />);

    await user.click(screen.getByRole("button", { name: /create plan/i }));

    expect(await screen.findByText(/plan name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    expect(screen.getByText(/amount must be/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("rejects a non-positive amount and an invalid email", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<BillingPlanForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/plan name/i), "Starter");
    await user.type(screen.getByLabelText(/description/i), "Entry tier");
    await user.type(screen.getByLabelText(/^amount$/i), "0");
    await user.type(
      screen.getByLabelText(/customer email/i),
      "not-an-email",
    );

    await user.click(screen.getByRole("button", { name: /create plan/i }));

    expect(
      await screen.findByText(/amount must be greater than zero/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("clears a field error once the user corrects it", async () => {
    const user = userEvent.setup();

    render(<BillingPlanForm />);

    await user.click(screen.getByRole("button", { name: /create plan/i }));
    expect(
      await screen.findByText(/plan name is required/i),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/plan name/i), "Pro");
    expect(screen.queryByText(/plan name is required/i)).not.toBeInTheDocument();
  });
});
