"use client";

import Image from "next/image";
import { useRouter } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Shield, Zap, Calendar, BadgeCheck } from "lucide-react";
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
  size?: "default" | "compact";
  fullWidth?: boolean;
}

// Skeleton component for loading state
export function ListingCardSkeleton({
  size = "default",
  fullWidth = false,
}: {
  size?: "default" | "compact";
  fullWidth?: boolean;
}) {
  const isCompact = size === "compact";
  const widthClass = fullWidth
    ? "w-full"
    : isCompact
      ? "w-[112px]"
      : "w-[208px]";
  return (
    <Card 
      className={cn(
        "overflow-hidden rounded-xl flex flex-col",
        widthClass,
        !fullWidth && "flex-shrink-0"
      )}
      role="status"
      aria-label="Loading listing"
      style={{
        minHeight: isCompact ? '180px' : '240px',
        maxHeight: isCompact ? '180px' : '240px',
        boxShadow: '0 4px 12px rgba(15, 162, 161, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
      }}
    >
      <Skeleton className={cn("w-full flex-shrink-0", isCompact ? "h-[70px]" : "h-[120px]")} />
      <div className={cn("flex flex-col flex-1", isCompact ? "p-2" : "p-4")}>
        <Skeleton className={cn("w-full", isCompact ? "h-6" : "h-8")} />
        <div className="flex flex-col gap-2 mt-auto">
          <Skeleton className={cn(isCompact ? "h-3 w-12" : "h-4 w-20")} />
          <Skeleton className={cn("h-3", isCompact ? "w-10" : "w-16")} />
        </div>
      </div>
    </Card>
  );
}

export function ListingCard({
  listing,
  showSkeleton = false,
  size = "default",
  fullWidth = false,
}: ListingCardProps) {
  const t = useTranslations("common");
  const isRTL = useIsRTL();
  const photos = JSON.parse(listing.photos || "[]");
  const mainPhoto = photos[0] || "/drill.png";
  const [imageError, setImageError] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const isCompact = size === "compact";
  const cardWidthClass = fullWidth
    ? "w-full"
    : isCompact
      ? "w-[112px]"
      : "w-[208px]";
  
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
    return <ListingCardSkeleton size={size} fullWidth={fullWidth} />;
  }

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden cursor-pointer rounded-xl transition-all select-none bg-white flex flex-col",
          cardWidthClass,
          !fullWidth && "flex-shrink-0"
        )}
        role="article"
        aria-label={`${listing.title}, ${listing.dailyRate} ₪ per day`}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transition: 'transform 120ms ease-out, box-shadow 200ms ease-out',
          minHeight: isCompact ? '180px' : '240px',
          maxHeight: isCompact ? '180px' : '240px',
          boxShadow: '0 4px 12px rgba(15, 162, 161, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(15, 162, 161, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 162, 161, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)';
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
        {/* Image Container */}
        <div 
          className={cn(
            "relative w-full bg-muted overflow-hidden flex-shrink-0",
            isCompact ? "h-[70px]" : "h-[120px]"
          )}
        >
          {!imageError ? (
            <Image
              src={mainPhoto}
              alt={listing.title}
              fill
              className="object-cover"
              sizes={isCompact ? "112px" : "208px"}
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={cn(
              "w-full h-full flex items-center justify-center bg-muted text-muted-foreground",
              isCompact ? "text-[9px]" : "text-xs"
            )}>
              No Image
            </div>
          )}
          
          {/* Badges - Top Left corner */}
          <div className={cn(
            "absolute top-2 left-2 flex flex-col items-start z-10",
            isCompact ? "gap-1" : "gap-1.5"
          )}>
            {listing.hasInsurance && (
              <div 
                className={cn(
                  "rounded-full text-blue-900 font-medium shadow-md flex items-center justify-center gap-0.5 whitespace-nowrap relative overflow-hidden",
                  isCompact ? "text-[7px] px-1.5 py-0.5" : "text-[9px] px-2 py-0.5"
                )}
                style={{
                  background: 'linear-gradient(135deg, #93C5FD 0%, #BFDBFE 50%, #93C5FD 100%)',
                  backgroundSize: '200% 200%',
                  animation: 'shimmer 3s ease-in-out infinite',
                }}
              >
                <div 
                  className="absolute inset-0 opacity-40"
                  style={{
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
                    backgroundSize: '200% 200%',
                    animation: 'sparkle 2.5s ease-in-out infinite',
                  }}
                />
                <BadgeCheck className={cn(
                  "flex-shrink-0 relative z-10 text-blue-900",
                  isCompact ? "h-2.5 w-2.5" : "h-3 w-3"
                )} />
                <span className="relative z-10">{t("insurance")}</span>
              </div>
            )}
            {listing.isInDemand && (
              <div 
                className={cn(
                  "rounded-full text-blue-900 font-medium shadow-md flex items-center justify-center gap-0.5 whitespace-nowrap relative overflow-hidden",
                  isCompact ? "text-[7px] px-1.5 py-0.5" : "text-[9px] px-2 py-0.5"
                )}
                style={{
                  background: 'linear-gradient(135deg, #93C5FD 0%, #BFDBFE 50%, #93C5FD 100%)',
                  backgroundSize: '200% 200%',
                  animation: 'shimmer 3s ease-in-out infinite',
                }}
              >
                <div 
                  className="absolute inset-0 opacity-40"
                  style={{
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
                    backgroundSize: '200% 200%',
                    animation: 'sparkle 2.5s ease-in-out infinite',
                  }}
                />
                <BadgeCheck className={cn(
                  "flex-shrink-0 relative z-10 text-blue-900",
                  isCompact ? "h-2.5 w-2.5" : "h-3 w-3"
                )} />
                <span className="relative z-10">{t("inDemand")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className={cn("flex flex-col flex-1 min-h-0", isCompact ? "p-2" : "p-4")}>
          {/* Title - 2 lines max with fixed height */}
          <h3 
            className={cn(
              "font-semibold line-clamp-2 text-gray-900 overflow-hidden",
              isCompact ? "text-[11px] leading-tight min-h-[24px]" : "text-sm leading-tight min-h-[32px]"
            )}
            dir="auto"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {listing.title}
          </h3>
          
          {/* Price, Rating, and Metadata - Aligned to same vertical grid */}
          <div className="flex flex-col gap-2 mt-auto">
          {/* Price row */}
          <div className="flex items-baseline gap-0.5 whitespace-nowrap">
            <span className={cn(
              "font-bold text-[#00B3A0]",
              isCompact ? "text-[11px]" : "text-sm"
            )}>
              ₪{listing.dailyRate}
            </span>
            <span className={cn(
              "text-gray-500",
              isCompact ? "text-[9px]" : "text-xs"
            )}>/יום</span>
          </div>
          
          {/* Rating Row */}
          <div className={cn(
            "flex items-center gap-0.5 text-gray-500 min-h-[20px]",
            isCompact ? "text-[9px]" : "text-xs"
          )}>
            <Star className={cn(
              "fill-warning text-warning flex-shrink-0",
              isCompact ? "h-2 w-2" : "h-3 w-3"
            )} />
            <span className="truncate">{listing.ratingAvg.toFixed(1)}</span>
            </div>
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
