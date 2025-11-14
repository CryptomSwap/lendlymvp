"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  Users,
  Settings,
  BarChart3,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const adminNavItems = [
  {
    title: "overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "listings",
    href: "/admin/listings",
    icon: Package,
  },
  {
    title: "disputes",
    href: "/admin/disputes",
    icon: AlertTriangle,
  },
  {
    title: "users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "rules",
    href: "/admin/rules",
    icon: Settings,
  },
  {
    title: "metrics",
    href: "/admin/metrics",
    icon: BarChart3,
  },
];

export function AdminSidebar() {
  const locale = useLocale();
  const t = useTranslations("admin");
  const pathname = usePathname();
  const isRTL = locale === "he";

  const NavContent = () => (
    <nav className="space-y-1 p-4">
      {adminNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === `/${locale}${item.href}`;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <Icon className="h-4 w-4" />
            <span>{t(`nav.${item.title}`)}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:top-0 md:pt-16 border-r bg-background",
          isRTL ? "md:right-0" : "md:left-0"
        )}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          <NavContent />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 z-50"
            style={isRTL ? { right: "1rem" } : { left: "1rem" }}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side={isRTL ? "right" : "left"}
          className="w-64 p-0"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="px-4 py-6">
            <h2 className="text-lg font-semibold mb-4">{t("nav.title")}</h2>
            <NavContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

