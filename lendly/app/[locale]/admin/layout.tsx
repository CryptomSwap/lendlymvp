import { AdminGuard } from "@/components/admin-guard";
import { AdminSidebar } from "@/components/admin-sidebar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/i18n/routing";
import { checkAdminRole } from "@/lib/utils/auth";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const isAdmin = await checkAdminRole(user.id);
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main
          className="flex-1 md:ml-64 md:mr-0"
          style={locale === "he" ? { marginRight: "16rem", marginLeft: 0 } : { marginLeft: "16rem", marginRight: 0 }}
          dir={locale === "he" ? "rtl" : "ltr"}
        >
          <div className="container mx-auto px-4 py-6">{children}</div>
        </main>
      </div>
    </AdminGuard>
  );
}

