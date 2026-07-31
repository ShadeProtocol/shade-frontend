import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Harness({ onSelect }: { onSelect?: () => void }) {
  return (
    <div>
      <button type="button">outside</button>
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

describe("DropdownMenu", () => {
  it("opens on trigger click and renders items", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(screen.getByText("Actions"));

    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Delete" }),
    ).toBeInTheDocument();
  });

  it("marks the trigger as expanded while open so the menu is anchored to it", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const trigger = screen.getByText("Actions");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const menu = await screen.findByRole("menu");
    expect(trigger).toHaveAttribute("aria-controls", menu.id);
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByText("Actions"));
    expect(await screen.findByRole("menu")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
  });

  it("closes on outside click", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByText("Actions"));
    expect(await screen.findByRole("menu")).toBeInTheDocument();

    // Radix sets `pointer-events: none` on the body while an open menu traps
    // interaction, which user-event refuses to click through. Dispatch the
    // dismiss sequence Radix actually listens for on the outside element.
    const outside = screen.getByText("outside");
    fireEvent.pointerDown(outside, { pointerType: "mouse", button: 0 });
    fireEvent.mouseDown(outside, { button: 0 });

    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
  });

  it("fires onSelect and closes when an item is chosen", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);

    await user.click(screen.getByText("Actions"));
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
  });
});
