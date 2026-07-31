"use client";

import { useState, useCallback, useEffect } from "react";

export function useClipboard(timeout = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const t = window.setTimeout(() => setIsCopied(false), timeout);
    return () => window.clearTimeout(t);
  }, [isCopied, timeout]);

  const copy = useCallback(async (text: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  return { isCopied, copy };
}
