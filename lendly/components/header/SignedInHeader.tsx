"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Bell, Plus, User, Settings, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useIsRTL } from "@/lib/utils/rtl";
import { signOut } from "@/lib/auth";
import { Role } from "@prisma/client";
import { BurgerButton } from "@/components/nav/BurgerButton";
import { SidePanel } from "@/components/nav/SidePanel";
import { useMenu } from "@/components/nav/useMenu";
import { parseRoles } from "@/lib/auth/roles";

interface SignedInHeaderProps {
  user: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
    avatar?: string | null;
    roles?: string | Role[];
  };
}

export function SignedInHeader({ user }: SignedInHeaderProps) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("common");
  const tAuth = useTranslations("auth");
  const isRTL = useIsRTL();
  const { isOpen, toggle, close } = useMenu();
  const [hasNotifications, setHasNotifications] = useState(false);

  // Get user avatar (prefer image, fallback to avatar, then initials)
  const avatarUrl = user.image || user.avatar || null;
  const userName = user.name || user.email.split("@")[0];
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Check if user has admin role
  const roles = typeof user.roles === "string" ? parseRoles(user.roles) : (user.roles || []);
  const isAdmin = roles.includes("ADMIN");

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleListItemClick = () => {
    router.push("/listings/new");
  };

  const handleNotificationsClick = () => {
    // TODO: Navigate to notifications page
    console.log("Notifications clicked");
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleSettingsClick = () => {
    router.push("/dashboard?tab=settings");
  };

  const handleAdminClick = () => {
    router.push("/admin");
  };

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-border backdrop-blur supports-[backdrop-filter]:bg-white/80"
      style={{
        background:
          "linear-gradient(to bottom, rgba(248, 250, 250, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)",
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Reserved space at top for animated element */}
      <div className="h-2" />
      <div className="container mx-auto flex min-h-20 items-center justify-between px-4 relative py-2">
        {/* Left side (RTL: right side) - Burger Menu and CTA Button */}
        <div className={`flex items-center gap-3 ${isRTL ? "order-3" : "order-1"}`}>
          {/* Burger Menu - on logical start side */}
          <BurgerButton
            isOpen={isOpen}
            onClick={toggle}
            ariaLabel={t("menu")}
            ariaControls="side-panel"
          />
          <Button
            onClick={handleListItemClick}
            className="rounded-full bg-[#009999] hover:bg-[#008888] text-white shadow-sm hover:shadow-md transition-all hover:scale-[1.02] px-4 py-2 h-auto text-sm font-medium"
            aria-label={isRTL ? "השכר פריט" : "List an item"}
          >
            {isRTL ? (
              <>
                השכר פריט
                <Plus className="h-4 w-4 ms-2" />
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 me-2" />
                List an item
              </>
            )}
          </Button>
        </div>

        {/* Center - Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-2 flex flex-col items-center order-2">
          <img
            src="/logo.png"
            alt="לנדלי"
            className="h-14 w-auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src.endsWith(".png")) {
                target.src = "/logo.svg";
              }
            }}
          />
          <p
            className="text-[11px] text-[#2BA6A6] text-center font-bold"
            style={{ fontSize: "11px", marginTop: "-10px" }}
          >
            לא צריך לקנות הכל - פשוט משכירים.
          </p>
        </div>

        {/* Right side (RTL: left side) - Icons */}
        <div
          className={`flex items-center gap-2 ${isRTL ? "order-1" : "order-3"}`}
        >
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full"
            onClick={handleNotificationsClick}
            aria-label={t("notifications") || "Notifications"}
          >
            <Bell className="h-5 w-5" />
            {hasNotifications && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            )}
          </Button>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full p-0 h-10 w-10"
                aria-label={tAuth("profile") || "Profile"}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={avatarUrl || undefined} alt={userName} />
                  <AvatarFallback className="bg-[#009999] text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={isRTL ? "start" : "end"}
              className="w-56"
            >
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  {isAdmin && (
                    <Badge variant="secondary" className="w-fit mt-1">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="h-4 w-4 mr-2" />
                {tAuth("profile") || "Profile"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="h-4 w-4 mr-2" />
                {t("settings") || "Settings"}
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleAdminClick}>
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Panel
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                {tAuth("signOut") || "Sign Out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <SidePanel isOpen={isOpen} onClose={close} user={user} />
    </header>
  );
}

