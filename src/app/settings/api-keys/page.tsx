import { ApiKeysClient } from "./api-keys-client";

export const metadata = {
  title: "API Keys · Settings | Shade",
};

export default function ApiKeysSettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">API Keys</h2>
        <p className="text-sm text-muted-foreground">
          Programmatic access for your Shade integration. Key values are only
          shown once at creation and are never listed here.
        </p>
      </div>
      <ApiKeysClient />
    </div>
  );
}
