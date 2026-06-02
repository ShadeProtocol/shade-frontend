import { describe, it, expect, vi, afterEach } from "vitest";

import { validateInvoiceCreate } from "./invoice-schema";

const base = {
  amount: "100",
  description: "Consulting",
};

afterEach(() => {
  vi.useRealTimers();
});

describe("validateInvoiceCreate — expiresAt", () => {
  it("accepts a future expiry date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-02T12:00:00"));

    const result = validateInvoiceCreate({ ...base, expiresAt: "2026-06-03" });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.expiresAt).toBe("2026-06-03");
  });

  it("accepts today as the expiry date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-02T12:00:00"));

    const result = validateInvoiceCreate({ ...base, expiresAt: "2026-06-02" });

    expect(result.ok).toBe(true);
  });

  it("rejects a past expiry date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-02T12:00:00"));

    const result = validateInvoiceCreate({ ...base, expiresAt: "2026-06-01" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.expiresAt).toBe("Expiry date cannot be in the past");
    }
  });

  it("treats an empty expiry as omitted (optional)", () => {
    const result = validateInvoiceCreate({ ...base, expiresAt: "" });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.expiresAt).toBeUndefined();
  });

  it("succeeds when expiresAt is absent entirely", () => {
    const result = validateInvoiceCreate(base);

    expect(result.ok).toBe(true);
  });
});
