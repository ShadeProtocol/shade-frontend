import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

function renderFaq() {
  return render(
    <Accordion type="single" collapsible>
      <AccordionItem value="fees">
        <AccordionTrigger>What are the fees?</AccordionTrigger>
        <AccordionContent>
          Shade charges a flat 1% per invoice.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="settlement">
        <AccordionTrigger>How fast is settlement?</AccordionTrigger>
        <AccordionContent>Payments settle within seconds.</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
}

describe("Accordion", () => {
  it("hides every panel until an item is expanded", () => {
    renderFaq();

    expect(screen.queryByText(/flat 1% per invoice/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/settle within seconds/i),
    ).not.toBeInTheDocument();
  });

  it("expands and collapses the item that was clicked", async () => {
    const user = userEvent.setup();
    renderFaq();

    const trigger = screen.getByRole("button", { name: /what are the fees/i });

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/flat 1% per invoice/i)).toBeInTheDocument();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps unrelated content collapsed in single mode", async () => {
    const user = userEvent.setup();
    renderFaq();

    await user.click(
      screen.getByRole("button", { name: /what are the fees/i }),
    );

    expect(screen.getByText(/flat 1% per invoice/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/settle within seconds/i),
    ).not.toBeInTheDocument();
  });
});
