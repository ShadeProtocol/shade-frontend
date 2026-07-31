"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const REGISTRATION_DRAFT_KEY = "shade:merchant-registration-draft";

const DEFAULT_DEBOUNCE_MS = 500;

type UseRegistrationDraftOptions<TDraft> = {
  /** sessionStorage key the draft is written to. */
  key?: string;
  /** Milliseconds to wait after the last change before persisting. */
  debounceMs?: number;
  /**
   * Narrows an unknown parsed payload to a usable draft. Return null to
   * discard a draft written by an older version of the form.
   */
  validate?: (value: unknown) => TDraft | null;
};

function readDraft<TDraft>(
  key: string,
  validate?: (value: unknown) => TDraft | null,
): TDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.sessionStorage.getItem(key);

  if (!stored) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(stored);
    return validate ? validate(parsed) : (parsed as TDraft);
  } catch {
    window.sessionStorage.removeItem(key);
    return null;
  }
}

/**
 * Debounced-persists an in-progress registration draft to sessionStorage and
 * restores it on mount, so a refresh mid-registration does not lose progress.
 */
export function useRegistrationDraft<TDraft>(
  options: UseRegistrationDraftOptions<TDraft> = {},
) {
  const {
    key = REGISTRATION_DRAFT_KEY,
    debounceMs = DEFAULT_DEBOUNCE_MS,
    validate,
  } = options;

  const [restoredDraft] = useState(() => readDraft<TDraft>(key, validate));
  const [isRestored, setIsRestored] = useState(
    () => typeof window !== "undefined",
  );

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsRestored(true);
  }, []);

  const cancelPendingSave = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => cancelPendingSave, [cancelPendingSave]);

  const saveDraft = useCallback(
    (draft: TDraft) => {
      if (typeof window === "undefined") {
        return;
      }

      cancelPendingSave();

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;

        try {
          window.sessionStorage.setItem(key, JSON.stringify(draft));
        } catch {
          // Storage can be full or blocked; losing the draft is preferable to
          // breaking the registration flow.
        }
      }, debounceMs);
    },
    [cancelPendingSave, debounceMs, key],
  );

  const clearDraft = useCallback(() => {
    cancelPendingSave();

    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.removeItem(key);
  }, [cancelPendingSave, key]);

  return { restoredDraft, isRestored, saveDraft, clearDraft };
}
