export const metadata = {
  title: "Profile · Settings | Shade",
};

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Personal and business details visible to your customers.
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        Profile editing is coming next. This section will let you update your
        name, business details, and verified email.
      </p>
    </div>
  );
}
