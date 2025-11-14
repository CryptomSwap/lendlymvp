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
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe px-4 py-2">
      <div 
        className="container mx-auto rounded-lg bg-white border border-[#E6F3F3] shadow-[0_-2px_8px_rgba(0,0,0,0.08)]"
        style={{
          borderRadius: '8px',
        }}
      >
        <div className="flex items-center justify-around h-16" dir="ltr">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200 relative group",
                  isActive
                    ? "text-[#009999]"
                    : "text-[#475569] hover:text-[#0F172A]"
                )}
                style={{
                  transition: 'all 200ms ease-out',
                }}
              >
                {isActive && (
                  <div 
                    className="absolute top-0 w-6 h-6 rounded-full bg-[#009999]/10"
                    style={{
                      width: '24px',
                      height: '24px',
                      top: '8px',
                    }}
                  />
                )}
                <Icon 
                  className={cn(
                    "relative z-10 transition-transform duration-200",
                    isActive ? "h-5 w-5 fill-[#009999] scale-105" : "h-5 w-5 group-hover:scale-110"
                  )}
                  strokeWidth={isActive ? 2 : 1.75}
                />
                <span 
                  className={cn(
                    "text-xs relative z-10",
                    isActive ? "font-semibold" : "font-medium"
                  )}
                  style={{ fontSize: '12px' }}
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

