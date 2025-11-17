"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { BurgerButton } from "@/components/nav/BurgerButton";
import { SidePanel } from "@/components/nav/SidePanel";
import { useMenu } from "@/components/nav/useMenu";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/routing";
import Link from "next/link";
import { SignedInHeader } from "@/components/header/SignedInHeader";

export function Header() {
  const locale = useLocale();
  const t = useTranslations("common");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, open, close, toggle } = useMenu();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isRTL = locale === "he";
  const isHomePage = pathname === "/" || pathname === `/${locale}` || pathname === `/${locale}/`;

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // If user is signed in, use SignedInHeader
  if (!isLoading && user) {
    return (
      <>
        <SignedInHeader user={user} />
      </>
    );
  }

  // Signed out header
  return (
    <>
      <header 
        className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-sm border-b border-teal-50 shadow-sm" 
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="w-full flex flex-col px-4 py-3">
          <div className="w-full flex items-center justify-between">
            {/* Left zone (RTL: right side) - Hamburger Menu */}
            <div className={`flex items-center ${isRTL ? "order-3" : "order-1"}`}>
              <BurgerButton
                isOpen={isOpen}
                onClick={toggle}
                ariaLabel={t("menu")}
                ariaControls="side-panel"
              />
            </div>

            {/* Center zone - Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img
                src="/logo.png"
                alt="לנדלי"
                className="h-[58px] w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src.endsWith('.png')) {
                    target.src = '/logo.svg';
                  }
                }}
              />
            </div>

            {/* Right zone (RTL: left side) - Sign In Button */}
            <div className={`flex items-center ${isRTL ? "order-1" : "order-3"}`}>
              {!isLoading && (
                <Link href="/auth/signin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full h-9"
                    aria-label={tAuth("signIn")}
                  >
                    {tAuth("signIn")}
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Tagline */}
          {isHomePage && (
            <p className="text-sm text-[#009C8D] font-medium text-center mt-1">
              לא צריך לקנות הכל – פשוט משכירים
            </p>
          )}
        </div>
      </header>
      <SidePanel isOpen={isOpen} onClose={close} user={user} />
    </>
  );
}

