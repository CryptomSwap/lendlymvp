"use client";

import { useTranslations } from "next-intl";
import { useNearbyListings } from "@/lib/hooks/use-nearby-listings";
import { ListingCard, ListingCardSkeleton } from "@/components/listing-card";
import { Link } from "@/i18n/routing";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, PanInfo, useMotionValue, animate } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsRTL } from "@/lib/utils/rtl";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

export function PopularRentalsArea() {
  const t = useTranslations("common");
  const isRTL = useIsRTL();
  const { listings, loading } = useNearbyListings();
  const ChevronIcon = isRTL ? ChevronRight : ChevronLeft;
  
  // Carousel state: tracks the first visible card index (snaps by 2)
  // IMPORTANT: All hooks must be called before any conditional returns
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardWidth = 182; // w-[182px] - 30% smaller than original 260px (260 * 0.7 = 182)
  const gap = 16; // gap-4 = 16px
  const cardStep = cardWidth + gap; // Distance to move one card
  const dragThreshold = 60; // Minimum drag distance to trigger snap
  
  // Motion value for smooth dragging
  const x = useMotionValue(0);
  const dragStartX = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  
  // Calculate max index (last valid starting position for a pair)
  const maxIndex = Math.max(0, listings.length - 2);
  
  // Calculate centering offset to center the visible pair of cards
  const getCenteringOffset = () => {
    if (!viewportRef.current) return 0;
    // Get the actual content width (offsetWidth includes padding, so we need to subtract it)
    // The viewport has px-4 which is 16px padding on each side = 32px total
    const viewportPadding = 32; // 16px * 2 (px-4 = 1rem = 16px)
    const viewportWidth = viewportRef.current.offsetWidth - viewportPadding;
    const twoCardsWidth = (cardWidth * 2) + gap; // Width of 2 cards + gap between them
    const offset = (viewportWidth - twoCardsWidth) / 2;
    return offset;
  };
  
  // Update motion value when currentIndex changes (when not dragging)
  useEffect(() => {
    if (!isDragging && listings.length > 0) {
      const centeringOffset = getCenteringOffset();
      const baseX = isRTL ? currentIndex * cardStep : -currentIndex * cardStep;
      const targetX = baseX + (isRTL ? -centeringOffset : centeringOffset);
      animate(x, targetX, {
        type: "spring",
        stiffness: 180,
        damping: 28,
        mass: 0.8,
      });
    }
  }, [currentIndex, isDragging, isRTL, cardStep, x, listings.length]);
  
  // Initialize position on mount - center the first two cards
  useEffect(() => {
    if (listings.length > 0 && viewportRef.current) {
      // Use setTimeout to ensure viewport dimensions are available
      const timer = setTimeout(() => {
        const centeringOffset = getCenteringOffset();
        x.set(isRTL ? -centeringOffset : centeringOffset);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [x, listings.length, isRTL]);
  
  // Recalculate centering on window resize
  useEffect(() => {
    const handleResize = () => {
      if (!isDragging && listings.length > 0 && viewportRef.current) {
        const centeringOffset = getCenteringOffset();
        const baseX = isRTL ? currentIndex * cardStep : -currentIndex * cardStep;
        const targetX = baseX + (isRTL ? -centeringOffset : centeringOffset);
        x.set(targetX);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDragging, listings.length, currentIndex, isRTL, cardStep, x]);
  
  // Handle drag start - ensure we start from the current position
  const handleDragStart = () => {
    setIsDragging(true);
    // Store the current position when drag starts
    dragStartX.current = x.get();
  };
  
  // Handle drag end: snap to next/previous pair based on drag distance and direction
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Immediately stop dragging - carousel stops when mouse/touch is released
    setIsDragging(false);
    
    // Get the final drag position relative to where we started
    const dragDistance = info.offset.x;
    const dragVelocity = info.velocity.x;
    
    // Determine direction: negative = left (next), positive = right (previous)
    // For RTL, we need to invert the logic
    const effectiveDrag = isRTL ? -dragDistance : dragDistance;
    const effectiveVelocity = isRTL ? -dragVelocity : dragVelocity;
    
    let newIndex = currentIndex;
    
    // Use velocity if significant, otherwise use distance
    if (Math.abs(effectiveVelocity) > 400) {
      // Fast swipe: move in that direction
      if (effectiveVelocity < 0 && currentIndex < maxIndex) {
        newIndex = Math.min(currentIndex + 2, maxIndex);
      } else if (effectiveVelocity > 0 && currentIndex > 0) {
        newIndex = Math.max(currentIndex - 2, 0);
      }
    } else if (Math.abs(effectiveDrag) > dragThreshold) {
      // Slow drag: check distance threshold
      if (effectiveDrag < 0 && currentIndex < maxIndex) {
        newIndex = Math.min(currentIndex + 2, maxIndex);
      } else if (effectiveDrag > 0 && currentIndex > 0) {
        newIndex = Math.max(currentIndex - 2, 0);
      }
    }
    
    // Update index - this will trigger the spring animation to snap to the new position
    setCurrentIndex(newIndex);
  };
  
  // Calculate drag constraints (relative to current position)
  // Allow dragging enough to see the elastic effect
  const maxDragDistance = cardStep * 1.5;

  // Loading state - 3 shimmering placeholders
  // FIXED: Added overflow-y-visible to prevent vertical clipping, pb-8 for shadow space, mt-6 for spacing from categories
  if (loading) {
    return (
      <section className="w-full mt-6 flex flex-col overflow-y-visible" style={{ alignItems: 'center', paddingLeft: '8px' }}>
        {/* Header */}
        <div className="w-full max-w-[calc(100%-32px)] px-4 mb-2">
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
        {/* FIXED: Changed to overflow-x-auto overflow-y-visible, removed snap, added gap-4 for consistent spacing */}
        <div 
          className="flex gap-4 overflow-x-auto overflow-y-visible scrollbar-hide scroll-smooth px-4 w-full max-w-[calc(100%-32px)]"
          style={{
            scrollBehavior: 'smooth',
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            // FIXED: Fixed width cards with mb-3 for shadow space, using fullWidth so card fills wrapper
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3,
                delay: i * 0.012, // 12ms stagger
              }}
              className="flex-shrink-0 w-[182px] mb-3"
            >
              <ListingCardSkeleton fullWidth />
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  // Empty state
  // FIXED: Added overflow-y-visible to prevent vertical clipping, pb-8 for shadow space, mt-6 for spacing from categories
  if (listings.length === 0) {
    return (
      <section className="w-full mt-6 flex flex-col overflow-x-auto overflow-y-visible" style={{ alignItems: 'center', paddingLeft: '8px' }}>
        {/* Header */}
        <div className="w-full max-w-[calc(100%-32px)] px-4 mb-2">
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
          className="w-full max-w-[calc(100%-32px)]"
        >
          <Card 
            className="max-w-full rounded-2xl p-4 flex flex-col items-center justify-center text-center mx-4"
            style={{
              background: 'rgba(15, 162, 161, 0.02)',
              border: '1px solid #E6F3F3',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <MapPin className="w-7 h-7 text-[#0FA2A1] mb-2" strokeWidth={1.75} />
            <p className="text-[15px] font-medium mb-2 text-[#0F172A]">
              {t("noNearbyListings")}
            </p>
            <p className="text-[13px] text-[#475569] mb-2">
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

  
  // Listings carousel - IMPROVED: Bouncy drag-to-snap carousel that moves 2 cards at a time
  // FIXED: Added overflow-y-visible to prevent vertical clipping, pb-8 for shadow space, mt-6 for spacing from categories
  return (
    <section className="w-full mt-6 flex flex-col overflow-y-visible" style={{ alignItems: 'center', paddingLeft: '8px' }}>
      {/* Header */}
      <div className="w-full max-w-[calc(100%-32px)] px-4 mb-2">
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
      
      {/* Viewport wrapper: overflow-x-hidden to clip horizontal, overflow-y-visible for shadows */}
      <div ref={viewportRef} className="relative overflow-x-hidden overflow-y-visible px-4 w-full max-w-[calc(100%-32px)]">
        {/* Draggable carousel container with bouncy spring animation */}
        <motion.div
          drag="x"
          dragElastic={0.15}
          dragMomentum={false}
          dragTransition={{ 
            power: 0.3,
            timeConstant: 200,
          }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{
            x,
            willChange: 'transform',
          }}
          className="flex gap-4 cursor-grab active:cursor-grabbing select-none"
          whileDrag={{ cursor: 'grabbing' }}
          initial={false}
        >
          {listings.map((listing, index) => {
            // Determine if this card is in the visible pair (currentIndex or currentIndex + 1)
            // The visible pair gets full scale and opacity, others are scaled down
            const isVisible = index >= currentIndex && index < currentIndex + 2;
            
            return (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: isVisible ? 1 : 0.85,
                  scale: isVisible ? 1 : 0.92,
                }}
                transition={{
                  opacity: { 
                    duration: 0.3, 
                    ease: [0.25, 0.46, 0.45, 0.94] 
                  },
                  scale: { 
                    duration: 0.3, 
                    ease: [0.25, 0.46, 0.45, 0.94] 
                  },
                }}
                className="flex-shrink-0 w-[182px] mb-3"
              >
                <ListingCard listing={listing} fullWidth />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
