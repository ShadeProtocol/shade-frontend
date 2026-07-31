import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RegisterClient } from "./register-client";
import { MERCHANT_SESSION_KEY } from "@/lib/merchant-storage";
import { REGISTRATION_DRAFT_KEY } from "@/hooks/use-registration-draft";

const replace = vi.fn();
const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push }),
}));

const WALLET_ADDRESS = "GABC123";

describe("RegisterClient draft autosave", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    replace.mockClear();
    push.mockClear();
    sessionStorage.setItem(
      MERCHANT_SESSION_KEY,
      JSON.stringify({ address: WALLET_ADDRESS }),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("persists entered personal details to sessionStorage", async () => {
    const user = userEvent.setup();
    render(<RegisterClient />);

    await user.type(screen.getByLabelText(/first name/i), "Ada");
    await user.type(screen.getByLabelText(/last name/i), "Lovelace");
    await user.type(screen.getByLabelText(/email address/i), "ada@example.com");

    await waitFor(() => {
      const stored = sessionStorage.getItem(REGISTRATION_DRAFT_KEY);
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored as string)).toMatchObject({
        step: 1,
        values: {
          firstName: "Ada",
          lastName: "Lovelace",
          email: "ada@example.com",
        },
      });
    });
  });

  it("restores previously entered values after a remount (page refresh)", async () => {
    const user = userEvent.setup();
    const first = render(<RegisterClient />);

    await user.type(screen.getByLabelText(/first name/i), "Ada");
    await user.type(screen.getByLabelText(/last name/i), "Lovelace");
    await user.type(screen.getByLabelText(/email address/i), "ada@example.com");

    await waitFor(() => {
      expect(sessionStorage.getItem(REGISTRATION_DRAFT_KEY)).not.toBeNull();
    });

    first.unmount();
    render(<RegisterClient />);

    expect(await screen.findByDisplayValue("Ada")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Lovelace")).toBeInTheDocument();
    expect(screen.getByDisplayValue("ada@example.com")).toBeInTheDocument();
  });

  it("restores the business step and its values after a remount", async () => {
    const user = userEvent.setup();
    const first = render(<RegisterClient />);

    await user.type(screen.getByLabelText(/first name/i), "Ada");
    await user.type(screen.getByLabelText(/last name/i), "Lovelace");
    await user.type(screen.getByLabelText(/email address/i), "ada@example.com");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await user.type(screen.getByLabelText(/business name/i), "Analytical Co");
    await user.selectOptions(
      screen.getByLabelText(/business category/i),
      "SaaS",
    );
    await user.type(
      screen.getByLabelText(/business description/i),
      "Difference engines",
    );

    await waitFor(() => {
      const stored = sessionStorage.getItem(REGISTRATION_DRAFT_KEY);
      expect(JSON.parse(stored as string)).toMatchObject({ step: 2 });
    });

    first.unmount();
    render(<RegisterClient />);

    expect(
      await screen.findByDisplayValue("Analytical Co"),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Difference engines")).toBeInTheDocument();
    expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
  });

  it("ignores a malformed draft and starts from an empty step 1", async () => {
    sessionStorage.setItem(REGISTRATION_DRAFT_KEY, "{not json");

    render(<RegisterClient />);

    expect(await screen.findByLabelText(/first name/i)).toHaveValue("");
    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
  });

  it("clears the draft once registration is submitted", async () => {
    const user = userEvent.setup();
    render(<RegisterClient />);

    await user.type(screen.getByLabelText(/first name/i), "Ada");
    await user.type(screen.getByLabelText(/last name/i), "Lovelace");
    await user.type(screen.getByLabelText(/email address/i), "ada@example.com");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await user.type(screen.getByLabelText(/business name/i), "Analytical Co");
    await user.selectOptions(
      screen.getByLabelText(/business category/i),
      "SaaS",
    );
    await user.type(
      screen.getByLabelText(/business description/i),
      "Difference engines",
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    const digits = await screen.findAllByLabelText(/otp digit/i);

    const otpCode = sessionStorage.getItem(
      "shade:merchant-registration-otp",
    ) as string;
    expect(otpCode).toMatch(/^\d{6}$/);

    for (let index = 0; index < digits.length; index += 1) {
      await user.type(digits[index], otpCode[index]);
    }

    await user.click(screen.getByRole("button", { name: /verify email/i }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/dashboard");
    });
    expect(sessionStorage.getItem(REGISTRATION_DRAFT_KEY)).toBeNull();
  });

  it("redirects to sign-in when there is no wallet session", async () => {
    sessionStorage.removeItem(MERCHANT_SESSION_KEY);

    render(<RegisterClient />);

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/sign-in");
    });
  });
});
