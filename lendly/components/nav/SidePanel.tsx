"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  Home,
  Search,
  Calendar,
  Boxes,
  PlusCircle,
  MessageSquare,
  ClipboardList,
  Wallet,
  Settings,
  LifeBuoy,
  Shield,
  LogOut,
  CheckCircle2,
  XCircle,
  Moon,
  Sun,
  Globe,
  Bell,
  MapPin,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useIsRTL } from "@/lib/utils/rtl";
import { signOut } from "@/lib/auth";
import { Role } from "@prisma/client";
import { parseRoles } from "@/lib/auth/roles";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
    avatar?: string | null;
    roles?: string | Role[];
    trustScore?: number;
    isVerified?: boolean;
  } | null;
}

interface MenuItem {
  label: string;
  labelHe: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  roles?: Role[];
  show?: (user: SidePanelProps["user"]) => boolean;
}

export function SidePanel({ isOpen, onClose, user }: SidePanelProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");
  const tAuth = useTranslations("auth");
  const { theme, setTheme } = useTheme();
  const isRTL = useIsRTL();
  const panelRef = useRef<HTMLDivElement>(null);

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    setMounted(true);
    const savedNotifications = localStorage.getItem("notifications") !== "false";
    setNotifications(savedNotifications);
  }, []);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle navigation
  const handleNavigate = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [router, onClose]
  );

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Handle language change
  const handleLanguageChange = (newLocale: "he" | "en") => {
    router.replace(pathname, { locale: newLocale });
  };

  // Save settings
  const saveSetting = (key: string, value: string | boolean) => {
    localStorage.setItem(key, String(value));
  };

  // Get user info
  const avatarUrl = user?.image || user?.avatar || null;
  const userName = user?.name || user?.email.split("@")[0] || "";
  const firstName = userName.split(" ")[0] || userName;
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const userRoles = user?.roles 
    ? (typeof user.roles === "string" ? parseRoles(user.roles) : user.roles)
    : [];
  const isAdmin = userRoles.includes("ADMIN");
  const isVerified = user?.isVerified || false;

  // Menu items
  const menuItems: MenuItem[] = [
    {
      label: "Home",
      labelHe: "דף הבית",
      icon: Home,
      href: "/",
      show: () => true,
    },
    {
      label: "Search",
      labelHe: "חיפוש",
      icon: Search,
      href: "/search",
      show: () => true,
    },
    {
      label: "My Rentals",
      labelHe: "ההשכרות שלי",
      icon: Calendar,
      href: "/bookings",
      show: () => true,
    },
    {
      label: "My Gear",
      labelHe: "הציוד שלי",
      icon: Boxes,
      href: "/listings",
      show: () => true,
    },
    {
      label: "List Item",
      labelHe: "רשום פריט חדש",
      icon: PlusCircle,
      href: "/listings/new",
      show: () => true,
    },
    {
      label: "Messages",
      labelHe: "הודעות",
      icon: MessageSquare,
      href: "/messages",
      show: () => true,
    },
    {
      label: "Wallet",
      labelHe: "ארנק/תשלומים",
      icon: Wallet,
      href: "/dashboard?tab=wallet",
      show: () => true,
    },
    {
      label: "Settings",
      labelHe: "הגדרות",
      icon: Settings,
      href: "/dashboard?tab=settings",
      show: () => true,
    },
    {
      label: "Support",
      labelHe: "תמיכה",
      icon: LifeBuoy,
      href: "/support",
      show: () => true,
    },
    {
      label: "Admin",
      labelHe: "נהל מערכת",
      icon: Shield,
      href: "/admin",
      roles: ["ADMIN"],
      show: (u) => {
        if (!u?.roles) return false;
        const roles = typeof u.roles === "string" ? parseRoles(u.roles) : u.roles;
        return roles.includes("ADMIN");
      },
    },
  ];

  // Filter menu items based on user roles
  const visibleMenuItems = menuItems.filter((item) => {
    if (item.show) {
      return item.show(user);
    }
    if (item.roles && user) {
      const roles = typeof user.roles === "string" ? parseRoles(user.roles) : (user.roles || []);
      return item.roles.some((role) => roles.includes(role));
    }
    return true;
  });

  // Animation variants
  const panelVariants = {
    closed: {
      x: isRTL ? "100%" : "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const backdropVariants = {
    closed: {
      opacity: 0,
      pointerEvents: "none" as const,
    },
    open: {
      opacity: 1,
      pointerEvents: "auto" as const,
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Side Panel */}
          <motion.div
            ref={panelRef}
            initial="closed"
            animate="open"
            exit="closed"
            variants={panelVariants}
            className={`fixed top-0 ${isRTL ? "right-0" : "left-0"} h-full w-[78vw] max-w-sm bg-white shadow-2xl z-50 ${
              isRTL ? "rounded-l-2xl" : "rounded-r-2xl"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
            drag="x"
            dragConstraints={isRTL ? { right: 0, left: -1000 } : { left: 0, right: 1000 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              const threshold = 100;
              const velocity = isRTL ? info.velocity.x : -info.velocity.x;
              const offset = isRTL ? info.offset.x : -info.offset.x;

              if (velocity > 500 || offset > threshold) {
                onClose();
              }
            }}
          >
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Profile Block */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-[#E8F6F6] to-white">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                    <AvatarImage src={avatarUrl || undefined} alt={userName} />
                    <AvatarFallback className="bg-[#009999] text-white text-xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold text-gray-900 truncate">
                      {locale === "he" ? `שלום, ${firstName} 👋` : `Hello, ${firstName} 👋`}
                    </p>
                    <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                    {isVerified && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {locale === "he" ? "מאומת" : "Verified"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 py-4">
                {visibleMenuItems.map((item, index) => {
                  const Icon = item.icon;
                  const label = locale === "he" ? item.labelHe : item.label;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  // Use a combination of href and index to ensure unique keys
                  const uniqueKey = `${item.href}-${index}`;

                  return (
                    <button
                      key={uniqueKey}
                      onClick={() => handleNavigate(item.href)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl hover:bg-[#E8F6F6] text-gray-700 hover:text-[#009999] transition ${
                        isActive ? "bg-[#E8F6F6] text-[#009999]" : ""
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="text-base font-medium">{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Settings Quick Actions */}
              <div className="border-t border-gray-200 p-4 space-y-3">
                {/* Language Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#E8F6F6] transition">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {locale === "he" ? "שפה" : "Language"}
                    </span>
                  </div>
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => handleLanguageChange("he")}
                      className={`px-3 py-1 rounded text-xs font-medium transition ${
                        locale === "he"
                          ? "bg-white text-[#009999] shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      עברית
                    </button>
                    <button
                      onClick={() => handleLanguageChange("en")}
                      className={`px-3 py-1 rounded text-xs font-medium transition ${
                        locale === "en"
                          ? "bg-white text-[#009999] shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                {/* Notifications Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#E8F6F6] transition">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {locale === "he" ? "התראות" : "Notifications"}
                    </span>
                  </div>
                  {mounted && (
                    <Switch
                      checked={notifications}
                      onCheckedChange={(checked) => {
                        setNotifications(checked);
                        saveSetting("notifications", checked);
                      }}
                    />
                  )}
                </div>

                {/* Dark Mode Toggle */}
                {mounted && (
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#E8F6F6] transition">
                    <div className="flex items-center gap-3">
                      {theme === "dark" ? (
                        <Moon className="h-5 w-5 text-gray-600" />
                      ) : (
                        <Sun className="h-5 w-5 text-gray-600" />
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {locale === "he" ? "מצב כהה" : "Dark Mode"}
                      </span>
                    </div>
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => {
                        setTheme(checked ? "dark" : "light");
                        saveSetting("theme", checked ? "dark" : "light");
                      }}
                    />
                  </div>
                )}

                {/* Verification Status */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    {isVerified ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {locale === "he" ? "אימות זהות" : "Identity Verification"}
                    </span>
                  </div>
                  <Badge variant={isVerified ? "default" : "secondary"}>
                    {isVerified
                      ? locale === "he"
                        ? "מאומת"
                        : "Verified"
                      : locale === "he"
                      ? "לא מאומת"
                      : "Not Verified"}
                  </Badge>
                </div>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-200 p-4">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-base font-medium">
                    {locale === "he" ? "התנתקות" : "Logout"}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

