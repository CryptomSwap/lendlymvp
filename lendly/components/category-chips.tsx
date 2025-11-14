"use client";

import { useState, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const categories = [
  { key: "cameras", image: "/Cam.png" },
  { key: "drones", image: "/drone.png" },
  { key: "tools", image: "/drill.png" },
  { key: "djGear", image: "/ladder.png" },
  { key: "camping", image: "/shnork.png" },
  { key: "sports", image: "/racket.png" },
];

export function CategoryChips() {
  const t = useTranslations("common");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [animatingCategory, setAnimatingCategory] = useState<string | null>(null);
  const animationRefs = useRef<{ [key: string]: HTMLImageElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const singleSetWidthRef = useRef<number>(0);
  const isInitializedRef = useRef(false);

  // Create infinite loop by duplicating categories
  const duplicatedCategories = [...categories, ...categories, ...categories];

  // Handle infinite scroll loop
  useEffect(() => {
    const container = scrollContainerRef.current;
    const scrollContent = scrollContentRef.current;
    if (!container || !scrollContent) return;

    // Calculate actual width of one set of categories
    const calculateSingleSetWidth = (): number => {
      if (scrollContent.children.length < categories.length * 2) {
        // Fallback if not enough items rendered yet
        return categories.length * 70; // Approximate: 58px button + 12px gap
      }
      
      const firstItem = scrollContent.children[0] as HTMLElement;
      const middleItem = scrollContent.children[categories.length] as HTMLElement;
      
      if (firstItem && middleItem && middleItem.offsetLeft > firstItem.offsetLeft) {
        return middleItem.offsetLeft - firstItem.offsetLeft;
      }
      
      // Fallback calculation
      return categories.length * 70;
    };

    const initializeScroll = () => {
      const width = calculateSingleSetWidth();
      if (width > 0) {
        singleSetWidthRef.current = width;
        container.style.scrollBehavior = 'auto';
        container.scrollLeft = width;
        isInitializedRef.current = true;
        container.style.scrollBehavior = 'smooth';
      }
    };

    const handleScroll = () => {
      if (isScrollingRef.current || !isInitializedRef.current) return;
      
      const scrollLeft = container.scrollLeft;
      const singleSetWidth = singleSetWidthRef.current;

      if (singleSetWidth === 0) {
        // Recalculate if not set
        singleSetWidthRef.current = calculateSingleSetWidth();
        return;
      }

      // If scrolled near the end (third set), jump to corresponding position in middle set
      if (scrollLeft >= singleSetWidth * 2 - 50) {
        isScrollingRef.current = true;
        container.style.scrollBehavior = 'auto';
        const offset = scrollLeft - singleSetWidth * 2;
        container.scrollLeft = singleSetWidth + offset;
        setTimeout(() => {
          container.style.scrollBehavior = 'smooth';
          isScrollingRef.current = false;
        }, 0);
      }
      // If scrolled near the beginning (first set), jump to corresponding position in middle set
      else if (scrollLeft <= 50) {
        isScrollingRef.current = true;
        container.style.scrollBehavior = 'auto';
        container.scrollLeft = singleSetWidth + scrollLeft;
        setTimeout(() => {
          container.style.scrollBehavior = 'smooth';
          isScrollingRef.current = false;
        }, 0);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initialize after DOM is ready - use multiple strategies
    const timeoutId = setTimeout(() => {
      initializeScroll();
    }, 100);

    // Also try on next frame
    requestAnimationFrame(() => {
      if (!isInitializedRef.current) {
        initializeScroll();
      }
    });

    return () => {
      clearTimeout(timeoutId);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [categories.length]);

  const handleCategoryClick = (categoryKey: string) => {
    // Trigger animation instantly with synchronous state update
    flushSync(() => {
      setAnimatingCategory(categoryKey);
    });
    
    // Force animation restart if already animating (check all instances)
    Object.keys(animationRefs.current).forEach((key) => {
      if (key.startsWith(categoryKey)) {
        const imgElement = animationRefs.current[key];
        if (imgElement) {
          imgElement.style.animation = 'none';
          void imgElement.offsetWidth; // Trigger reflow
          requestAnimationFrame(() => {
            imgElement.style.animation = '';
          });
        }
      }
    });
    
    setTimeout(() => {
      setAnimatingCategory(null);
    }, 400);

    if (selectedCategory === categoryKey) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryKey);
    }
  };

  return (
    <div className="px-4 py-2 relative" style={{ zIndex: 0, position: 'relative' }}>
      {/* Horizontal scrolling infinite carousel */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-4 px-4" 
        style={{ overflowY: 'visible' }}
      >
        <div ref={scrollContentRef} className="flex gap-3 relative" style={{ gap: '12px' }}>
          {duplicatedCategories.map((category, index) => {
            const isSelected = selectedCategory === category.key;
            const uniqueKey = `${category.key}-${index}`;
            return (
              <div
                key={uniqueKey}
                className="flex-shrink-0 snap-start flex flex-col items-center"
                style={{ zIndex: isSelected ? 10 : 1 }}
              >
                <button
                  className={cn(
                    "flex flex-col items-center justify-center cursor-pointer",
                    "transition-all duration-200 ease-out",
                    isSelected && "scale-98"
                  )}
                  aria-label={t(category.key)}
                  onClick={() => handleCategoryClick(category.key)}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.96)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = '';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = '';
                  }}
                  style={{ 
                    transition: 'transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    willChange: 'transform',
                  }}
                >
                  <div 
                    className={cn(
                      "w-[58px] h-[58px] rounded-full flex items-center justify-center transition-all relative overflow-visible shadow-xs",
                      isSelected 
                        ? "ring-2 ring-[#009999] shadow-[0_4px_16px_rgba(0,153,153,0.3)]" 
                        : "shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                    )}
                    style={{
                      transition: 'all 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      background: isSelected 
                        ? 'linear-gradient(135deg, rgba(0,153,153,0.18) 0%, rgba(0,153,153,0.1) 100%)' 
                        : 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,250,0.95) 100%)',
                      transform: animatingCategory === category.key ? 'scale(1.08)' : undefined,
                      willChange: 'transform, box-shadow, background',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected && animatingCategory !== category.key) {
                        e.currentTarget.style.transform = 'scale(1.06)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,153,153,0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected && animatingCategory !== category.key) {
                        e.currentTarget.style.transform = '';
                        e.currentTarget.style.boxShadow = '';
                      }
                    }}
                  >
                    <img
                      ref={(el) => {
                        if (el) {
                          animationRefs.current[uniqueKey] = el;
                        }
                      }}
                      src={category.image}
                      alt={t(category.key)}
                      className={cn(
                        "object-contain relative z-10",
                        animatingCategory === category.key 
                          ? (category.key === "tools" ? "animate-symbol-pop-with-offset" : "animate-symbol-pop")
                          : (category.key === "tools" ? "translate-x-[-2px]" : "")
                      )}
                      style={{
                        width: '30px',
                        height: '30px',
                        transition: animatingCategory !== category.key ? 'transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
                        animationDelay: '0ms',
                      }}
                    />
                  </div>
                  <span 
                    className="text-[12px] font-medium mt-2 text-[#0F172A] text-center"
                    style={{ fontSize: '12px', marginTop: '8px' }}
                  >
                    {t(category.key)}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

