"use client";

import { useTranslations } from "next-intl";
import { useNearbyListings } from "@/lib/hooks/use-nearby-listings";
import { ListingCard, ListingCardSkeleton } from "@/components/listing-card";
import { Link } from "@/i18n/routing";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsRTL } from "@/lib/utils/rtl";
import { cn } from "@/lib/utils";

export function PopularRentalsArea() {
  const t = useTranslations("common");
  const isRTL = useIsRTL();
  const { listings, loading } = useNearbyListings();
  const ChevronIcon = isRTL ? ChevronRight : ChevronLeft;

  // Loading state - 3 shimmering placeholders
  if (loading) {
    return (
      <section className="w-full mt-4 pt-3 pb-4 rounded-3xl bg-white/80 shadow-[0_8px_20px_rgba(0,0,0,0.03)] mx-4">
        {/* Header */}
        <div className="px-3 mb-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <h2 className="text-lg font-semibold text-gray-900">
              השכרות באיזורך
            </h2>
          </motion.div>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth px-3">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3,
                delay: i * 0.012, // 12ms stagger
              }}
              className="flex-shrink-0 snap-start"
            >
              <ListingCardSkeleton />
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  // Empty state
  if (listings.length === 0) {
    return (
      <section className="w-full mt-4 pt-3 pb-4 rounded-3xl bg-white/80 shadow-[0_8px_20px_rgba(0,0,0,0.03)] mx-4">
        {/* Header */}
        <div className="px-3 mb-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <h2 className="text-lg font-semibold text-gray-900">
              השכרות באיזורך
            </h2>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.012 }}
        >
          <Card 
            className="max-w-full rounded-2xl p-5 flex flex-col items-center justify-center text-center"
            style={{
              background: 'rgba(15, 162, 161, 0.02)',
              border: '1px solid #E6F3F3',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: '20px',
            }}
          >
            <MapPin className="w-7 h-7 text-[#0FA2A1] mb-4" strokeWidth={1.75} />
            <p className="text-[15px] font-medium mb-2 text-[#0F172A]">
              {t("noNearbyListings")}
            </p>
            <p className="text-[13px] text-[#475569] mb-4">
              נסה לחפש באזור אחר או עיין בכל ההשכרות הזמינות
            </p>
            <Link href="/search">
              <Button 
                className="h-11 rounded-xl bg-[#0FA2A1] hover:bg-[#0C7C7B] text-white font-medium px-6"
                style={{
                  height: '44px',
                  borderRadius: '12px',
                }}
              >
                {t("viewAllListings")}
              </Button>
            </Link>
          </Card>
        </motion.div>
      </section>
    );
  }

  // Listings carousel
  return (
    <section className="w-full mt-4 pt-3 pb-4 rounded-3xl bg-white/80 shadow-[0_8px_20px_rgba(0,0,0,0.03)] mx-4">
      {/* Header */}
      <div className="px-3 mb-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <h2 className="text-lg font-semibold text-gray-900">
            השכרות באיזורך
          </h2>
          <Link href="/search">
            <button 
              className={cn(
                "flex items-center gap-1 text-xs text-[#00A596] font-medium hover:opacity-80 transition-opacity duration-120 active:scale-[0.97]",
                isRTL && "flex-row-reverse"
              )}
              style={{ 
                transition: 'opacity 120ms ease-out, transform 120ms ease-out'
              }}
            >
              {t("seeAll")}
              <ChevronIcon className="h-3 w-3" strokeWidth={2} />
            </button>
          </Link>
        </motion.div>
      </div>
      
      <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth px-3">
        {listings.map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.3,
              delay: index * 0.012, // 12ms stagger (between 10-15ms)
            }}
            className="flex-shrink-0 snap-center"
          >
            <ListingCard listing={listing} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
