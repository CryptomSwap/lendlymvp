"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { HeroCarousel } from "./HeroCarousel";
import { PriceBox } from "./PriceBox";
import { OwnerSection } from "./OwnerSection";
import { IssuesSection } from "./IssuesSection";
import { StickyCTA } from "./StickyCTA";
import { Star, MapPin, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface ListingPopupProps {
  listing: {
    id: string;
    title: string;
    dailyRate: number;
    ratingAvg: number;
    ratingCount: number;
    photos: string;
    locationText: string;
    distance?: number | null;
    hasInsurance?: boolean;
    isInDemand?: boolean;
    instantBook?: boolean;
    description?: string;
    owner?: {
      id: string;
      name: string;
      avatar?: string | null;
      trustScore?: number;
      verified?: boolean;
    };
    issueCount?: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ListingPopup({ listing, open, onOpenChange }: ListingPopupProps) {
  const t = useTranslations("common");
  const tListing = useTranslations("listing");
  const locale = useLocale();
  const isRTL = locale === "he";
  
  const photos = JSON.parse(listing.photos || "[]");
  const hasPhotos = photos.length > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          "h-[90vh] max-h-[90vh] overflow-y-auto rounded-t-3xl border-t-2 border-[#E6F3F3] p-0",
          isRTL && "rtl"
        )}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Visually hidden title for accessibility */}
        <SheetTitle className="sr-only">{listing.title}</SheetTitle>
        
        <div className="flex flex-col h-full">
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto pb-24">
            {/* Hero Image Carousel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="-mx-6 -mt-6"
            >
              <HeroCarousel
                photos={hasPhotos ? photos : ["/drill.png"]}
                title={listing.title}
                hasInsurance={listing.hasInsurance}
                isInDemand={listing.isInDemand}
                instantBook={listing.instantBook}
              />
            </motion.div>

            <div className="px-6 pt-6 space-y-6">
              {/* Title & Quick Details */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="space-y-3"
              >
                <h1 className="text-2xl font-bold text-[#0F172A]">{listing.title}</h1>
                <div className="flex items-center gap-4 text-sm text-[#64748B] flex-wrap">
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-[#FACC15] text-[#FACC15]" />
                    <span className="font-medium text-[#0F172A]">
                      {listing.ratingAvg.toFixed(1)}
                    </span>
                    <span className="text-[#64748B]">
                      ({listing.ratingCount} {listing.ratingCount === 1 ? tListing("review") : tListing("reviews")})
                    </span>
                  </div>
                  
                  {/* Distance */}
                  {listing.distance !== null && listing.distance !== undefined && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.distance.toFixed(1)} {t("km")}</span>
                    </div>
                  )}
                  
                  {/* Condition/Status */}
                  <div className="flex items-center gap-1">
                    <Wrench className="h-4 w-4" />
                    <span>מצב טוב</span>
                  </div>
                </div>
              </motion.div>

              {/* Price Box */}
              <PriceBox
                dailyRate={listing.dailyRate}
                hasInsurance={listing.hasInsurance || false}
              />

              {/* Owner Section */}
              {listing.owner && (
                <OwnerSection owner={listing.owner} />
              )}

              {/* Description */}
              {listing.description && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.35 }}
                  className="space-y-2"
                >
                  <h2 className="text-lg font-semibold text-[#0F172A]">{tListing("productDescription")}</h2>
                  <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </motion.div>
              )}

              {/* Issues Section */}
              {listing.issueCount !== undefined && listing.issueCount > 0 && (
                <IssuesSection
                  issueCount={listing.issueCount}
                  onLearnMore={() => {
                    // Navigate to full listing page or show more details
                  }}
                />
              )}
            </div>
          </div>

          {/* Sticky CTA Footer */}
          <StickyCTA
            listingId={listing.id}
            instantBook={listing.instantBook}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

