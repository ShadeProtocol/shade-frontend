"use client";

import React, { useState } from "react";
import { Plus, Key, Calendar, Trash2, Check, Copy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenerateApiKeyModal } from "@/components/settings/generate-api-key-modal";

type ApiKey = {
  id: string;
  name: string;
  token: string;
  createdAt: string;
};

const initialKeys: ApiKey[] = [
  {
    id: "key-1",
    name: "Production Backend",
    token: "sh_live_••••••••••••••••3a9c",
    createdAt: "2026-05-10T14:30:00.000Z",
  },
  {
    id: "key-2",
    name: "Stripe Sync Webhook",
    token: "sh_live_••••••••••••••••9e8f",
    createdAt: "2026-05-24T09:15:00.000Z",
  },
];

export function ApiKeysClient() {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<{ name: string; token: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleGenerateKey = (name: string) => {
    // Generate a mock API token
    const randomHex = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const rawToken = `sh_live_${randomHex}`;
    
    // Masked version for the list
    const maskedToken = `sh_live_••••••••••••••••${rawToken.slice(-4)}`;
    
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name,
      token: maskedToken,
      createdAt: new Date().toISOString(),
    };

    setKeys((current) => [newKey, ...current]);
    setNewlyCreatedKey({ name, token: rawToken });
  };

  const handleRevokeKey = (id: string) => {
    setKeys((current) => current.filter((key) => key.id !== id));
  };

  const handleCopyNewKey = async () => {
    if (newlyCreatedKey) {
      await navigator.clipboard.writeText(newlyCreatedKey.token);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">API Keys</h2>
          <p className="text-sm text-muted-foreground">
            Programmatic access for your Shade integration.
          </p>
        </div>
        <Button
          onClick={() => {
            setNewlyCreatedKey(null);
            setIsModalOpen(true);
          }}
          className="self-start sm:self-auto flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Generate API Key</span>
        </Button>
      </div>

      {newlyCreatedKey && (
        <div className="rounded-xl border border-yellow-300 bg-yellow-50/50 dark:border-yellow-900/30 dark:bg-yellow-950/10 p-5 space-y-3 animate-in fade-in duration-300">
          <div className="flex gap-2 text-yellow-800 dark:text-yellow-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div className="text-sm font-semibold">Copy your new API key</div>
          </div>
          <p className="text-xs text-yellow-700/95 dark:text-yellow-400/90 leading-relaxed">
            For security reasons, this key will only be shown once. If you lose it, you will need to revoke it and generate a new one.
          </p>
          <div className="flex items-center gap-2 rounded-lg border bg-background p-2 max-w-xl">
            <span className="min-w-0 flex-1 truncate font-mono text-sm px-2 text-foreground font-semibold">
              {newlyCreatedKey.token}
            </span>
            <Button
              size="sm"
              variant={copiedKey ? "secondary" : "default"}
              onClick={handleCopyNewKey}
              className="shrink-0 flex items-center gap-1.5"
            >
              {copiedKey ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {keys.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center bg-muted/10">
            <Key className="h-10 w-10 text-muted-foreground/60 mb-3" />
            <h3 className="font-semibold text-foreground">No active API keys</h3>
            <p className="text-xs text-muted-foreground max-w-[280px] mt-1">
              Create a key to authenticate your server side integration with Shade.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="divide-y divide-border/60">
              {keys.map((key) => (
                <div
                  key={key.id}
                  className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/10 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-sm">{key.name}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-mono">
                      <span>{key.token}</span>
                      <span className="flex items-center gap-1 text-[11px] font-sans">
                        <Calendar className="h-3.5 w-3.5" />
                        Created {new Date(key.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRevokeKey(key.id)}
                    className="self-start sm:self-auto text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 flex items-center gap-1.5"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Revoke</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <GenerateApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGenerateKey}
      />
    </div>
  );
}
