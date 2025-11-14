"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { BurgerButton } from "@/components/nav/BurgerButton";
import { SidePanel } from "@/components/nav/SidePanel";
import { useMenu } from "@/components/nav/useMenu";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import Link from "next/link";
import { SignedInHeader } from "@/components/header/SignedInHeader";

export function Header() {
  const locale = useLocale();
  const t = useTranslations("common");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const { isOpen, open, close, toggle } = useMenu();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isRTL = locale === "he";

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
      <header className="sticky top-0 z-40 w-full border-b border-border backdrop-blur supports-[backdrop-filter]:bg-white/80" style={{ background: 'linear-gradient(to bottom, rgba(248, 250, 250, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)' }} dir={isRTL ? "rtl" : "ltr"}>
        {/* Reserved space at top for animated element */}
        <div className="h-2" />
        <div className="container mx-auto flex min-h-20 items-center justify-center px-4 relative py-2">
          <div className="absolute left-1/2 transform -translate-x-1/2 top-2 flex flex-col items-center">
            <img
              src="/logo.png"
              alt="לנדלי"
              className="h-14 w-auto"
              onError={(e) => {
                // Fallback to SVG if PNG doesn't exist
                const target = e.target as HTMLImageElement;
                if (target.src.endsWith('.png')) {
                  target.src = '/logo.svg';
                }
              }}
            />
            <p className="text-[11px] text-[#2BA6A6] text-center font-bold" style={{ fontSize: '11px', marginTop: '-10px' }}>
              לא צריך לקנות הכל - פשוט משכירים.
            </p>
          </div>
          
          {/* Burger Menu - opposite side from CTA */}
          <div className={`absolute top-4 ${isRTL ? "right-4" : "left-4"} z-50`}>
            <BurgerButton
              isOpen={isOpen}
              onClick={toggle}
              ariaLabel={t("menu")}
              ariaControls="side-panel"
            />
          </div>

          {/* Sign In Button - positioned at visual start (left for RTL, right for LTR) */}
          <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} z-50`}>
            {!isLoading && (
              <Link href="/auth/signin">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  aria-label={tAuth("signIn")}
                >
                  {tAuth("signIn")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <SidePanel isOpen={isOpen} onClose={close} user={user} />
    </>
  );
}

