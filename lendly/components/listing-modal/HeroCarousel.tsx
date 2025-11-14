"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";

interface HeroCarouselProps {
  photos: string[];
  title: string;
  hasInsurance?: boolean;
  isInDemand?: boolean;
  instantBook?: boolean;
  className?: string;
}

export function HeroCarousel({
  photos,
  title,
  hasInsurance = false,
  isInDemand = false,
  instantBook = false,
  className,
}: HeroCarouselProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const isRTL = locale === "he";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();
  };

  if (!photos || photos.length === 0) {
    return (
      <div className={cn("relative w-full h-64 bg-muted rounded-t-3xl overflow-hidden", className)}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-64 bg-muted rounded-t-3xl overflow-hidden", className)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Image
            src={photos[currentIndex] || "/drill.png"}
            alt={`${title} - Photo ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority={currentIndex === 0}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Badges */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
        {hasInsurance && (
          <Badge className="bg-[#2ECC71] text-white px-3 py-1.5 shadow-lg backdrop-blur-sm">
            כשיר
          </Badge>
        )}
        {isInDemand && (
          <Badge className="bg-orange-500 text-white px-3 py-1.5 shadow-lg backdrop-blur-sm">
            מבצע
          </Badge>
        )}
      </div>

      {/* Navigation arrows */}
      {photos.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-8 w-8 z-10",
              isRTL ? "right-2" : "left-2"
            )}
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-8 w-8 z-10",
              isRTL ? "left-2" : "right-2"
            )}
            onClick={goToNext}
            aria-label="Next image"
          >
            {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {photos.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-2 rounded-full transition-all",
                  index === currentIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/60 hover:bg-white/80"
                )}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

