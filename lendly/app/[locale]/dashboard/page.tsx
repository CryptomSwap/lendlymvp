import { DashboardTabs } from "@/components/dashboard-tabs";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/i18n/routing";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return <DashboardTabs />;
}

