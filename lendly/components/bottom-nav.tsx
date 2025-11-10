"use client";

import { Link, usePathname } from "@/i18n/routing";
import { Home, Search, MessageSquare, Calendar, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("common");

  const navItems = [
    { href: "/", icon: Home, label: t("home") },
    { href: "/search", icon: Search, label: t("search") },
    { href: "/messages", icon: MessageSquare, label: t("messages") },
    { href: "/bookings", icon: Calendar, label: t("bookings") },
    { href: "/profile", icon: User, label: t("profile") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-safe">
      <div className="container mx-auto flex items-center justify-around h-16" dir="ltr">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

