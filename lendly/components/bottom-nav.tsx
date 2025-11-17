"use client";

import { Link, usePathname } from "@/i18n/routing";
import { Home, Search, MessageSquare, Calendar, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("common");

  const navItems = [
    { href: "/messages", icon: MessageSquare, label: t("messages") },
    { href: "/search", icon: Search, label: t("search") },
    { href: "/", icon: Home, label: t("home") },
    { href: "/bookings", icon: Calendar, label: t("bookings") },
    { href: "/profile", icon: User, label: t("profile") },
  ];

  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 max-w-[480px] w-[calc(100%-32px)]">
      <div 
        className="rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-6 py-2"
      >
        <div className="flex items-center justify-around h-14" dir="ltr">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200 relative group active:scale-[0.97]",
                  isActive
                    ? "text-[#00A596]"
                    : "text-gray-600 hover:text-gray-900"
                )}
                style={{
                  transition: 'all 200ms ease-out, transform 120ms ease-out',
                }}
              >
                <Icon 
                  className={cn(
                    "relative z-10 transition-transform duration-200",
                    isActive ? "h-5 w-5 text-[#00A596] scale-105" : "h-5 w-5 group-hover:scale-110"
                  )}
                  strokeWidth={isActive ? 2 : 1.75}
                  fill={isActive ? "#00A596" : "none"}
                />
                <span 
                  className={cn(
                    "text-xs relative z-10 font-normal",
                    isActive && "font-semibold text-[#00A596]"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

