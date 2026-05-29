export const metadata = {
  title: "API Keys · Settings | Shade",
};

export default function ApiKeysSettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">API Keys</h2>
        <p className="text-sm text-muted-foreground">
          Programmatic access for your Shade integration.
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        Key generation will land here. You will be able to issue, rotate, and
        revoke keys used by your server to call Shade.
      </p>
    </div>
  );
}
