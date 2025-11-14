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
      className="overflow-hidden w-[170px] flex-shrink-0"
      role="status"
      aria-label="Loading listing"
    >
      <Skeleton className="w-full aspect-[4/3] rounded-t-lg" />
      <div className="p-2.5 space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-3 w-20" />
      </div>
    </Card>
  );
}

export function ListingCard({ listing, showSkeleton = false }: ListingCardProps) {
  const t = useTranslations("common");
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
        className="overflow-hidden w-[170px] flex-shrink-0 cursor-pointer rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.97] select-none"
        role="article"
        aria-label={`${listing.title}, ${listing.dailyRate} ₪ per day`}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          borderRadius: '12px',
        }}
      >
        {/* Image Container - 4:3 aspect ratio, rounded top */}
        <div 
          className="relative w-full aspect-[4/3] bg-muted overflow-hidden"
          style={{
            borderRadius: '12px 12px 0 0',
          }}
        >
          {!imageError ? (
            <Image
              src={mainPhoto}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="170px"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xs">
              No Image
            </div>
          )}
          
          {/* Badges - Top Right - Consistent position */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 items-end z-10">
            {listing.hasInsurance && (
              <Badge 
                variant="default"
                className="text-[10px] px-1.5 py-0.5 bg-primary/90 backdrop-blur-sm shadow-sm"
              >
                {t("insurance")}
              </Badge>
            )}
            {listing.isInDemand && (
              <Badge 
                variant="secondary"
                className="text-[10px] px-1.5 py-0.5 bg-orange-500/90 backdrop-blur-sm text-white shadow-sm"
              >
                {t("inDemand")}
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-2.5 space-y-1.5">
          {/* Name - 1 line ellipsis */}
          <h3 
            className="text-sm font-medium line-clamp-1 text-foreground"
            dir="auto"
          >
            {listing.title}
          </h3>
          
          {/* Price - Bold */}
          <p className="text-base font-bold text-primary">
            ₪{listing.dailyRate}
            <span className="text-xs font-normal text-muted-foreground">/יום</span>
          </p>
          
          {/* Rating and Distance Row */}
          <div className="flex items-center justify-between gap-2">
            {/* Rating Stars - Tiny */}
            <div className="flex items-center gap-0.5">
              <Star className="h-2.5 w-2.5 fill-warning text-warning" />
              <span className="text-[10px] font-medium">{listing.ratingAvg.toFixed(1)}</span>
            </div>
            
            {/* Distance */}
            {listing.distance !== null && listing.distance !== undefined && (
              <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <MapPin className="h-2.5 w-2.5" />
                <span>{listing.distance.toFixed(1)} {t("km")}</span>
              </div>
            )}
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
