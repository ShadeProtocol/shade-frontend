import * as React from "react";
import { ClipboardCopy, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ApiKeyRevealProps {
  /**
   * The API key to display. In production this would be generated server‑side and
   * passed as a prop. For the mock UI we can provide a placeholder string.
   */
  apiKey: string;
  /** Optional custom warning message */
  warningMessage?: string;
}

/**
 * ApiKeyReveal – a premium alert component that shows a secret key exactly once.
 * It draws immediate attention with a bold background and provides a copy‑to‑clipboard
 * button. After the user copies the key a toast notification confirms the action.
 */
export function ApiKeyReveal({
  apiKey,
  warningMessage = "Please copy this key now. It will not be shown again.",
}: ApiKeyRevealProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      toast.success("API key copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy API key.");
    }
  };

  return (
    <div
      role="alert"
      className={cn(
        "border border-yellow-500/30 bg-yellow-100/30 text-yellow-900 shadow-sm rounded-lg p-4 flex flex-col gap-3",
        "relative",
      )}
    >
      {/* Dismiss icon – in a real flow you might hide the component after copy */}
      <button
        onClick={() => setCopied(true)}
        aria-label="Dismiss"
        className={cn(
          "absolute top-2 right-2 rounded-full p-1 hover:bg-yellow-200/50 transition-colors",
        )}
      >
        <X className="h-4 w-4" />
      </button>

      <p className="text-sm font-medium">{warningMessage}</p>

      <div className="flex items-center gap-2 overflow-x-auto">
        <code className="font-mono text-sm break-all bg-white/20 rounded px-2 py-1">
          {apiKey}
        </code>
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1 rounded px-2 py-1 text-sm font-medium",
            "bg-yellow-500 text-white hover:bg-yellow-600 transition-colors",
          )}
        >
          <ClipboardCopy className="h-4 w-4" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

export default ApiKeyReveal;
