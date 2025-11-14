"use client";

import { ReactNode } from "react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";

interface MenuItemProps {
  icon: ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  showChevron?: boolean;
  variant?: "default" | "destructive";
  ariaLabel?: string;
}

export function MenuItem({
  icon,
  label,
  href,
  onClick,
  isActive = false,
  showChevron = true,
  variant = "default",
  ariaLabel,
}: MenuItemProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const isRTL = locale === "he";
  const Chevron = isRTL ? ChevronLeft : ChevronRight;

  // Auto-detect active state if href matches pathname
  const active = isActive || (href && pathname === href);

  const content = (
    <motion.div
      className={`
        flex items-center gap-3 py-3 px-2 rounded-xl transition-all
        ${active 
          ? "text-[#0E7575] bg-teal-50 font-semibold" 
          : variant === "destructive"
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-[#E7F8F8]"
        }
        active:scale-[0.99]
      `}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex-shrink-0" style={{ color: active ? "#0E7575" : "inherit" }}>
        {icon}
      </div>
      <span className="flex-1 text-[15px]">{label}</span>
      {showChevron && (
        <Chevron 
          className="h-4 w-4 opacity-50 flex-shrink-0" 
          style={{ transform: isRTL ? "scaleX(-1)" : undefined }}
        />
      )}
    </motion.div>
  );

  if (href) {
    return (
      <Link 
        href={href} 
        aria-label={ariaLabel || label}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left"
      aria-label={ariaLabel || label}
    >
      {content}
    </button>
  );
}

