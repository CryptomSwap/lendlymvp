import { AdminMetrics } from "@/components/admin-metrics";
import { getCurrentUser } from "@/lib/auth";
import { checkAdminRole } from "@/lib/utils/auth";
import { redirect } from "@/i18n/routing";

export default async function AdminMetricsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }

  const isAdmin = await checkAdminRole(user.id);
  if (!isAdmin) {
    redirect("/");
  }

  return <AdminMetrics />;
}

