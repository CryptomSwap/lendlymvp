"use client";

import { Button } from "@/components/ui/button";
import { Zap, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface StickyCTAProps {
  listingId: string;
  instantBook?: boolean;
  className?: string;
}

export function StickyCTA({ listingId, instantBook = false, className }: StickyCTAProps) {
  const router = useRouter();
  const t = useTranslations("listing");

  const handleBook = () => {
    router.push(`/listing/${listingId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className={cn(
        "sticky bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E6F3F3] p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      <div className="space-y-2">
        <Button
          onClick={handleBook}
          className={cn(
            "w-full h-14 rounded-xl text-base font-semibold shadow-md transition-all duration-200 active:scale-[0.98]",
            instantBook
              ? "bg-[#2ECC71] hover:bg-[#27AE60] text-white"
              : "bg-[#009999] hover:bg-[#0C7C7B] text-white"
          )}
        >
          {instantBook ? (
            <>
              <Zap className="h-5 w-5 ml-2" />
              {t("instantBooking")}
            </>
          ) : (
            <>
              <Shield className="h-5 w-5 ml-2" />
              {t("reserveNow")}
            </>
          )}
        </Button>
        <div className="flex items-center justify-center gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{t("freeCancellation")}</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>{t("support247")}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

