"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { key: "cameras", image: "/Cam.png" },
  { key: "drones", image: "/drone.png" },
  { key: "tools", image: "/drill.png" },
  { key: "djGear", image: "/ladder.png" },
  { key: "camping", image: "/shnork.png" },
];

export function CategoryChips() {
  const t = useTranslations("common");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", checkScrollability);
    window.addEventListener("resize", checkScrollability);

    return () => {
      container.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth;
    const scrollTo = direction === "left" 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: scrollTo,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative px-4 py-4 overflow-visible">
      {/* Left scroll button */}
      {canScrollLeft && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-background/80 hover:bg-background/90 shadow-md"
          onClick={() => scroll("left")}
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto overflow-y-visible scrollbar-hide scroll-smooth snap-x snap-mandatory px-8"
        style={{ overflowY: 'visible' }}
      >
        {categories.map((category) => {
          return (
            <button
              key={category.key}
              className={cn(
                "flex flex-col items-center gap-2 cursor-pointer flex-shrink-0 snap-start",
                "hover:scale-105 active:scale-95 transition-transform",
                "pb-2"
              )}
              style={{
                width: 'calc((100% - 2.25rem) / 4)',
                minWidth: 'calc((100% - 2.25rem) / 4)'
              }}
              aria-label={t(category.key)}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow flex-shrink-0">
                <img
                  src={category.image}
                  alt={t(category.key)}
                  className="h-7 w-7 object-contain"
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Right scroll button */}
      {canScrollRight && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-background/80 hover:bg-background/90 shadow-md"
          onClick={() => scroll("right")}
          aria-label="Scroll categories right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

