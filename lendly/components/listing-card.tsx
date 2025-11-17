"use client";

import Image from "next/image";
import { useRouter } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Shield, Zap, Calendar } from "lucide-react";
import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ListingPopup as PremiumListingPopup } from "@/components/listing-modal/ListingPopup";
import { useIsRTL } from "@/lib/utils/rtl";
import { cn } from "@/lib/utils";

export interface ListingCardProps {
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
  };
  showSkeleton?: boolean;
}

// Skeleton component for loading state
export function ListingCardSkeleton() {
  return (
    <Card 
      className="overflow-hidden w-52 min-w-[208px] flex-shrink-0 rounded-2xl"
      role="status"
      aria-label="Loading listing"
    >
      <Skeleton className="w-full h-[140px]" />
      <div className="p-3 space-y-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </Card>
  );
}

export function ListingCard({ listing, showSkeleton = false }: ListingCardProps) {
  const t = useTranslations("common");
  const isRTL = useIsRTL();
  const photos = JSON.parse(listing.photos || "[]");
  const mainPhoto = photos[0] || "/drill.png";
  const [imageError, setImageError] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  
  // Track if user is scrolling (for horizontal carousel)
  const isScrolling = useRef(false);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPopupOpen(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isScrolling.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const diffX = Math.abs(touchX - touchStartX.current);
    const diffY = Math.abs(touchY - touchStartY.current);
    
    // If user moved more than 10px horizontally (carousel scroll) or 5px vertically, they're scrolling
    if (diffX > 10 || diffY > 5) {
      isScrolling.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Clear scrolling flag after a short delay
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }
    
    const wasScrolling = isScrolling.current;
    
    scrollTimer.current = setTimeout(() => {
      isScrolling.current = false;
    }, 150);

    // Only open popup if not scrolling
    if (!wasScrolling) {
      e.preventDefault();
      setPopupOpen(true);
    }
  };

  if (showSkeleton) {
    return <ListingCardSkeleton />;
  }

  return (
    <>
      <Card
        className="overflow-hidden w-52 min-w-[208px] flex-shrink-0 cursor-pointer rounded-2xl shadow-sm hover:shadow-md transition-all select-none bg-white"
        role="article"
        aria-label={`${listing.title}, ${listing.dailyRate} ₪ per day`}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transition: 'transform 120ms ease-out, box-shadow 200ms ease-out',
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.97)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = '';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = '';
        }}
      >
        {/* Image Container - ~140px height */}
        <div 
          className="relative w-full h-[140px] bg-muted overflow-hidden"
        >
          {!imageError ? (
            <Image
              src={mainPhoto}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="208px"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xs">
              No Image
            </div>
          )}
          
          {/* Badges - Top Right corner */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end z-10">
            {listing.hasInsurance && (
              <div className="rounded-full bg-[#00B3A0] text-white text-[10px] px-2 py-1 font-medium shadow">
                {t("insurance")}
              </div>
            )}
            {listing.isInDemand && (
              <div className="rounded-full bg-orange-500 text-white text-[10px] px-2 py-1 font-medium shadow">
                {t("inDemand")}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-1">
          {/* Title - 2 lines max */}
          <h3 
            className="text-sm font-semibold line-clamp-2 text-gray-900"
            dir="auto"
          >
            {listing.title}
          </h3>
          
          {/* Price row */}
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-[#00B3A0]">
              ₪{listing.dailyRate}
            </span>
            <span className="text-xs text-gray-500">/יום</span>
          </div>
          
          {/* Rating Row */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span>{listing.ratingAvg.toFixed(1)}</span>
          </div>
        </div>
      </Card>

      {/* Listing Popup - Premium Design */}
      <PremiumListingPopup
        listing={{
          ...listing,
          description: undefined, // Description not available in card listing
          owner: undefined, // Owner data not available in card listing
          issueCount: 0, // Issues not tracked in card listing
        }}
        open={popupOpen}
        onOpenChange={setPopupOpen}
      />
    </>
  );
}
