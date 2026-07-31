import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { ConfirmDialog, type ConfirmDialogProps } from "./confirm-dialog";

function renderDialog(props: Partial<ConfirmDialogProps> = {}) {
  const onConfirm = props.onConfirm ?? vi.fn();
  const onOpenChange = props.onOpenChange ?? vi.fn();

  const utils = render(
    <ConfirmDialog
      open
      onOpenChange={onOpenChange}
      title="Cancel invoice"
      description="This cannot be undone."
      onConfirm={onConfirm}
      {...props}
    />,
  );

  return { ...utils, onConfirm, onOpenChange };
}

describe("ConfirmDialog", () => {
  it("renders the title, description and both actions", () => {
    renderDialog({ confirmLabel: "Cancel invoice", cancelLabel: "Go back" });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Cancel invoice" }),
    ).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancel invoice" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go back" })).toBeInTheDocument();
  });

  it("renders nothing when closed", () => {
    renderDialog({ open: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("fires onConfirm and closes on the simple confirm flow", async () => {
    const user = userEvent.setup();
    const { onConfirm, onOpenChange } = renderDialog();

    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("fires onCancel and closes when cancelling", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const { onConfirm, onOpenChange } = renderDialog({ onCancel });

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderDialog();

    await user.keyboard("{Escape}");

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("respects a caller-owned confirmDisabled flag", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderDialog({ confirmDisabled: true });

    const confirmButton = screen.getByRole("button", { name: "Confirm" });

    expect(confirmButton).toBeDisabled();
    await user.click(confirmButton);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  describe("typed confirmation flow", () => {
    it("keeps confirm disabled until the exact phrase is typed", async () => {
      const user = userEvent.setup();
      const { onConfirm } = renderDialog({
        requireTypedConfirmation: "DELETE",
        confirmLabel: "Delete API key",
      });

      const confirmButton = screen.getByRole("button", {
        name: "Delete API key",
      });
      const input = screen.getByRole("textbox");

      expect(confirmButton).toBeDisabled();

      await user.type(input, "delete");
      expect(confirmButton).toBeDisabled();

      await user.clear(input);
      await user.type(input, "DELET");
      expect(confirmButton).toBeDisabled();

      await user.type(input, "E");
      expect(confirmButton).toBeEnabled();

      await user.click(confirmButton);
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("labels the input with the required phrase by default", () => {
      renderDialog({ requireTypedConfirmation: "DELETE" });

      expect(screen.getByText(/type/i)).toBeInTheDocument();
      expect(screen.getByText("DELETE")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "placeholder",
        "DELETE",
      );
    });

    it("accepts a custom typed-confirmation label", () => {
      renderDialog({
        requireTypedConfirmation: "shade-key",
        typedConfirmationLabel: "Enter the API key name",
      });

      expect(
        screen.getByLabelText("Enter the API key name"),
      ).toBeInTheDocument();
    });

    it("does not render the input for the simple flow", () => {
      renderDialog();

      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    it("resets the typed value after the dialog closes and reopens", async () => {
      const user = userEvent.setup();

      function Harness() {
        const [open, setOpen] = useState(true);

        return (
          <>
            <button onClick={() => setOpen(true)}>open</button>
            <ConfirmDialog
              open={open}
              onOpenChange={setOpen}
              title="Delete API key"
              description="Cannot be undone."
              requireTypedConfirmation="DELETE"
              confirmLabel="Delete API key"
              onConfirm={vi.fn()}
            />
          </>
        );
      }

      render(<Harness />);

      await user.type(screen.getByRole("textbox"), "DELETE");
      await user.click(screen.getByRole("button", { name: "Cancel" }));

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "open" }));

      expect(await screen.findByRole("textbox")).toHaveValue("");
      expect(
        screen.getByRole("button", { name: "Delete API key" }),
      ).toBeDisabled();
    });
  });

  describe("async confirm", () => {
    it("shows a pending state and closes after the promise resolves", async () => {
      const user = userEvent.setup();
      let resolveConfirm: (() => void) | undefined;
      const onConfirm = vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveConfirm = resolve;
          }),
      );
      const onOpenChange = vi.fn();

      renderDialog({ onConfirm, onOpenChange });

      await user.click(screen.getByRole("button", { name: "Confirm" }));

      expect(screen.getByRole("button", { name: "Confirm" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
      expect(onOpenChange).not.toHaveBeenCalled();

      resolveConfirm?.();

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("stays open when the confirm promise rejects", async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn(() => Promise.reject(new Error("network")));
      const onOpenChange = vi.fn();

      renderDialog({ onConfirm, onOpenChange });

      await user.click(screen.getByRole("button", { name: "Confirm" }));

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Confirm" })).toBeEnabled();
      });
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  it("renders extra children between the description and the footer", () => {
    renderDialog({
      children: <p>Invoice INV-001 will be voided.</p>,
    });

    expect(
      screen.getByText("Invoice INV-001 will be voided."),
    ).toBeInTheDocument();
  });

  it("applies the destructive variant to the confirm button", () => {
    renderDialog({ variant: "destructive", confirmLabel: "Delete" });

    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass(
      "bg-destructive",
    );
  });
});
