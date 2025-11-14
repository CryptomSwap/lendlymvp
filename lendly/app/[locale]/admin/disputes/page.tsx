import { AdminDisputes } from "@/components/admin-disputes";
import { getCurrentUser } from "@/lib/auth";
import { checkAdminRole } from "@/lib/utils/auth";
import { redirect } from "@/i18n/routing";

export default async function AdminDisputesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }

  const isAdmin = await checkAdminRole(user.id);
  if (!isAdmin) {
    redirect("/");
  }

  return <AdminDisputes />;
}

