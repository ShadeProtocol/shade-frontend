"use client";

import { useState } from "react";

import { ApiKeyTable } from "@/components/settings/api-key-table";
import type { ApiKey } from "@/lib/api-key-types";

const seedApiKeys: ApiKey[] = [
  {
    id: "key-001",
    name: "Production server",
    createdAt: "2026-03-15T10:00:00.000Z",
    lastUsedAt: "2026-05-28T16:42:00.000Z",
  },
  {
    id: "key-002",
    name: "Staging environment",
    createdAt: "2026-04-02T08:30:00.000Z",
    lastUsedAt: "2026-05-20T11:15:00.000Z",
  },
  {
    id: "key-003",
    name: "Local development",
    createdAt: "2026-05-10T14:20:00.000Z",
    lastUsedAt: null,
  },
];

export function ApiKeysClient() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(seedApiKeys);

  return (
    <ApiKeyTable
      apiKeys={apiKeys}
      onRevoke={(id) =>
        setApiKeys((current) => current.filter((key) => key.id !== id))
      }
    />
  );
}
