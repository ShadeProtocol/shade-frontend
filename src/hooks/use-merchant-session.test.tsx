import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, it, expect, vi } from "vitest";

import { MERCHANT_SESSION_KEY } from "@/lib/merchant-storage";
import { useMerchantSession } from "./use-merchant-session";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("useMerchantSession", () => {
  beforeEach(() => {
    replace.mockClear();
    sessionStorage.clear();
  });

  it("redirects to /sign-in when there is no session", async () => {
    const { result } = renderHook(() => useMerchantSession());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(replace).toHaveBeenCalledWith("/sign-in");
    expect(result.current.walletAddress).toBeNull();
  });

  it("returns the wallet address without redirecting when a session exists", async () => {
    sessionStorage.setItem(
      MERCHANT_SESSION_KEY,
      JSON.stringify({ address: "GTESTADDRESS" }),
    );

    const { result } = renderHook(() => useMerchantSession());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(replace).not.toHaveBeenCalled();
    expect(result.current.walletAddress).toBe("GTESTADDRESS");
  });
});
