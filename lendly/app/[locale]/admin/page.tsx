import { AdminGuard } from "@/components/admin-guard";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminSettings } from "@/components/admin-settings";

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}
