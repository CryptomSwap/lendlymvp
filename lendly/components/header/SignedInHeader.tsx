"use client";

import { useTranslations } from "next-intl";
import { useIsRTL } from "@/lib/utils/rtl";
import { BurgerButton } from "@/components/nav/BurgerButton";
import { SidePanel } from "@/components/nav/SidePanel";
import { useMenu } from "@/components/nav/useMenu";
import { usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";

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
  const pathname = usePathname();
  const locale = useLocale();
  const { isOpen, toggle, close } = useMenu();
  const isHomePage = pathname === "/" || pathname === `/${locale}` || pathname === `/${locale}/`;

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-sm border-b border-teal-50 shadow-sm"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="w-full flex flex-col px-4 py-3">
          <div className="w-full flex items-center justify-between">
            {/* Center zone - Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
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
            <div className={`flex items-center ${isRTL ? "order-1" : "order-3"}`}>
              <BurgerButton
                isOpen={isOpen}
                onClick={toggle}
                ariaLabel={t("menu")}
                ariaControls="side-panel"
              />
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

