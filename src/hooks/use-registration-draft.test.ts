import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  REGISTRATION_DRAFT_KEY,
  useRegistrationDraft,
} from "./use-registration-draft";

type Draft = { firstName: string };

describe("useRegistrationDraft", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns no draft when sessionStorage is empty", () => {
    const { result } = renderHook(() => useRegistrationDraft<Draft>());

    expect(result.current.restoredDraft).toBeNull();
  });

  it("restores a previously persisted draft on mount", () => {
    sessionStorage.setItem(
      REGISTRATION_DRAFT_KEY,
      JSON.stringify({ firstName: "Ada" }),
    );

    const { result } = renderHook(() => useRegistrationDraft<Draft>());

    expect(result.current.restoredDraft).toEqual({ firstName: "Ada" });
  });

  it("persists the draft only after the debounce delay elapses", () => {
    const { result } = renderHook(() =>
      useRegistrationDraft<Draft>({ debounceMs: 500 }),
    );

    act(() => {
      result.current.saveDraft({ firstName: "Ada" });
    });

    expect(sessionStorage.getItem(REGISTRATION_DRAFT_KEY)).toBeNull();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(sessionStorage.getItem(REGISTRATION_DRAFT_KEY)).toBe(
      JSON.stringify({ firstName: "Ada" }),
    );
  });

  it("writes only once for a burst of changes, keeping the latest value", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    const { result } = renderHook(() =>
      useRegistrationDraft<Draft>({ debounceMs: 500 }),
    );

    act(() => {
      result.current.saveDraft({ firstName: "A" });
      result.current.saveDraft({ firstName: "Ad" });
      result.current.saveDraft({ firstName: "Ada" });
      vi.advanceTimersByTime(500);
    });

    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(REGISTRATION_DRAFT_KEY)).toBe(
      JSON.stringify({ firstName: "Ada" }),
    );
  });

  it("clears the stored draft and cancels a pending write", () => {
    sessionStorage.setItem(
      REGISTRATION_DRAFT_KEY,
      JSON.stringify({ firstName: "Ada" }),
    );

    const { result } = renderHook(() =>
      useRegistrationDraft<Draft>({ debounceMs: 500 }),
    );

    act(() => {
      result.current.saveDraft({ firstName: "Grace" });
      result.current.clearDraft();
      vi.advanceTimersByTime(500);
    });

    expect(sessionStorage.getItem(REGISTRATION_DRAFT_KEY)).toBeNull();
  });

  it("does not write after unmount", () => {
    const { result, unmount } = renderHook(() =>
      useRegistrationDraft<Draft>({ debounceMs: 500 }),
    );

    act(() => {
      result.current.saveDraft({ firstName: "Ada" });
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(sessionStorage.getItem(REGISTRATION_DRAFT_KEY)).toBeNull();
  });

  it("discards a malformed stored draft", () => {
    sessionStorage.setItem(REGISTRATION_DRAFT_KEY, "{not json");

    const { result } = renderHook(() => useRegistrationDraft<Draft>());

    expect(result.current.restoredDraft).toBeNull();
    expect(sessionStorage.getItem(REGISTRATION_DRAFT_KEY)).toBeNull();
  });

  it("drops a draft the validator rejects", () => {
    sessionStorage.setItem(
      REGISTRATION_DRAFT_KEY,
      JSON.stringify({ unexpected: true }),
    );

    const { result } = renderHook(() =>
      useRegistrationDraft<Draft>({
        validate: (value) =>
          typeof (value as Draft)?.firstName === "string"
            ? (value as Draft)
            : null,
      }),
    );

    expect(result.current.restoredDraft).toBeNull();
  });

  it("honours a custom storage key", () => {
    const { result } = renderHook(() =>
      useRegistrationDraft<Draft>({ key: "shade:custom-draft", debounceMs: 0 }),
    );

    act(() => {
      result.current.saveDraft({ firstName: "Ada" });
      vi.advanceTimersByTime(0);
    });

    expect(sessionStorage.getItem("shade:custom-draft")).toBe(
      JSON.stringify({ firstName: "Ada" }),
    );
    expect(sessionStorage.getItem(REGISTRATION_DRAFT_KEY)).toBeNull();
  });

  it("does not throw when sessionStorage rejects the write", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    const { result } = renderHook(() =>
      useRegistrationDraft<Draft>({ debounceMs: 0 }),
    );

    expect(() => {
      act(() => {
        result.current.saveDraft({ firstName: "Ada" });
        vi.advanceTimersByTime(0);
      });
    }).not.toThrow();
  });
});
