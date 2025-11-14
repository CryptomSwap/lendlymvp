"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsRTL } from "@/lib/utils/rtl";
import { BurgerButton } from "@/components/nav/BurgerButton";
import { SidePanel } from "@/components/nav/SidePanel";
import { useMenu } from "@/components/nav/useMenu";

interface SignedInHeaderProps {
  user: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
    avatar?: string | null;
    roles?: string | any[];
  };
}

export function SignedInHeader({ user }: SignedInHeaderProps) {
  const t = useTranslations("common");
  const isRTL = useIsRTL();
  const { isOpen, toggle, close } = useMenu();
  const [hasNotifications, setHasNotifications] = useState(false);

  const handleNotificationsClick = () => {
    // TODO: Navigate to notifications page
    console.log("Notifications clicked");
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full border-b border-border/40 bg-white/95 backdrop-blur-sm shadow-sm"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="container mx-auto flex items-center justify-between px-4 h-14">
          {/* Left zone (RTL: right side) - Notifications */}
          <div className={`flex items-center ${isRTL ? "order-3" : "order-1"}`}>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full h-9 w-9"
              onClick={handleNotificationsClick}
              aria-label={t("notifications") || "Notifications"}
            >
              <Bell className="h-5 w-5" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </Button>
          </div>

          {/* Center zone - Logo */}
          <div className={`absolute left-1/2 transform -translate-x-1/2 ${isRTL ? "order-2" : "order-2"}`}>
            <img
              src="/logo.png"
              alt="לנדלי"
              className="h-[58px] w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src.endsWith(".png")) {
                  target.src = "/logo.svg";
                }
              }}
            />
          </div>

          {/* Right zone (RTL: left side) - Hamburger Menu */}
          <div
            className={`flex items-center ${isRTL ? "order-1" : "order-3"}`}
          >
            <BurgerButton
              isOpen={isOpen}
              onClick={toggle}
              ariaLabel={t("menu")}
              ariaControls="side-panel"
            />
          </div>
        </div>
      </header>
      <SidePanel isOpen={isOpen} onClose={close} user={user} />
    </>
  );
}

