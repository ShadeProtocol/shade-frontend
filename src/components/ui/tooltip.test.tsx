import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Harness() {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>GABC...1234</TooltipTrigger>
        <TooltipContent>
          GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQR1234
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

describe("Tooltip", () => {
  it("shows the full value on hover", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await user.hover(screen.getByText("GABC...1234"));

    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQR1234",
    );
  });

  it("shows on keyboard focus for icon-only triggers", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.tab();

    expect(screen.getByText("GABC...1234")).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
  });
});
