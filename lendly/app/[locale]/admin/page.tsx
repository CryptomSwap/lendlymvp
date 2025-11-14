import { AdminOverview } from "@/components/admin-overview";
import { getCurrentUser } from "@/lib/auth";
import { checkAdminRole } from "@/lib/utils/auth";
import { redirect } from "@/i18n/routing";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }

  const isAdmin = await checkAdminRole(user.id);
  if (!isAdmin) {
    redirect("/");
  }

  return <AdminOverview />;
}
