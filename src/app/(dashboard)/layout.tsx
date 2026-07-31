import { MerchantSessionGuard } from "@/components/merchant-session-guard";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Topbar />
      <div className="ml-0 pt-16 md:ml-60">
        <main className="min-h-[calc(100vh-4rem)] overflow-y-auto p-6">
          <MerchantSessionGuard>{children}</MerchantSessionGuard>
        </main>
      </div>
    </div>
  );
}
