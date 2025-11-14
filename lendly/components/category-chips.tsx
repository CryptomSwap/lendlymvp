"use client";

import { useState, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { useIsRTL } from "@/lib/utils/rtl";

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
  const locale = useLocale();
  const isRTL = useIsRTL();
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
      if (scrollContent.children.length < categories.length) {
        // Not enough items rendered yet
        return 0;
      }
      
      // Use getBoundingClientRect for more reliable measurements
      const firstItem = scrollContent.children[0] as HTMLElement;
      const middleItem = scrollContent.children[categories.length] as HTMLElement;
      
      if (firstItem && middleItem) {
        const firstRect = firstItem.getBoundingClientRect();
        const middleRect = middleItem.getBoundingClientRect();
        const width = Math.abs(middleRect.left - firstRect.left);
        
        if (width > 0) {
          return width;
        }
      }
      
      // Fallback: calculate based on item width + gap
      if (scrollContent.children.length > 0) {
        const firstChild = scrollContent.children[0] as HTMLElement;
        if (firstChild) {
          const itemWidth = firstChild.offsetWidth || 70; // 58px button + margin
          return itemWidth * categories.length + 12 * (categories.length - 1); // gap between items
        }
      }
      
      return 0;
    };

    const getScrollPosition = (): number => {
      // Check if container has RTL direction (might be inherited from parent)
      const computedStyle = window.getComputedStyle(container);
      const isContainerRTL = computedStyle.direction === 'rtl';
      
      if (isContainerRTL) {
        // In RTL, scrollLeft is reversed
        const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
        return maxScroll - container.scrollLeft;
      }
      return container.scrollLeft;
    };

    const setScrollPosition = (position: number) => {
      // Check if container has RTL direction
      const computedStyle = window.getComputedStyle(container);
      const isContainerRTL = computedStyle.direction === 'rtl';
      
      if (isContainerRTL) {
        const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
        container.scrollLeft = Math.max(0, maxScroll - position);
      } else {
        container.scrollLeft = position;
      }
    };

    const initializeScroll = () => {
      const width = calculateSingleSetWidth();
      if (width > 0 && !isInitializedRef.current) {
        singleSetWidthRef.current = width;
        
        // Always initialize scroll position for infinite scroll
        // Even if content fits, we want to enable scrolling
        container.style.scrollBehavior = 'auto';
        // Start at the middle set (second set) to enable infinite scroll in both directions
        setScrollPosition(width);
        // Force a reflow to ensure scroll position is set
        void container.offsetHeight;
        
        isInitializedRef.current = true;
        // Restore smooth scrolling after initialization
        requestAnimationFrame(() => {
          container.style.scrollBehavior = 'smooth';
        });
      }
    };

    const handleScroll = () => {
      if (isScrollingRef.current) return;
      
      if (!isInitializedRef.current) {
        // Try to initialize if not done yet
        initializeScroll();
        return;
      }
      
      const scrollPos = getScrollPosition();
      const singleSetWidth = singleSetWidthRef.current;

      if (singleSetWidth === 0) {
        const newWidth = calculateSingleSetWidth();
        if (newWidth > 0) {
          singleSetWidthRef.current = newWidth;
        }
        return;
      }

      // Always apply infinite scroll logic
      // The content should always be scrollable due to duplicated items

      // If scrolled near the end (third set), jump to corresponding position in middle set
      if (scrollPos >= singleSetWidth * 2 - 100) {
        isScrollingRef.current = true;
        container.style.scrollBehavior = 'auto';
        const offset = scrollPos - singleSetWidth * 2;
        setScrollPosition(singleSetWidth + offset);
        requestAnimationFrame(() => {
          container.style.scrollBehavior = 'smooth';
          isScrollingRef.current = false;
        });
      }
      // If scrolled near the beginning (first set), jump to corresponding position in middle set
      else if (scrollPos <= 100) {
        isScrollingRef.current = true;
        container.style.scrollBehavior = 'auto';
        setScrollPosition(singleSetWidth + scrollPos);
        requestAnimationFrame(() => {
          container.style.scrollBehavior = 'smooth';
          isScrollingRef.current = false;
        });
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initialize after DOM is ready - use multiple strategies
    const timeoutId = setTimeout(() => {
      initializeScroll();
    }, 100);

    // Also try on next frame
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (!isInitializedRef.current) {
          initializeScroll();
        }
      }, 100);
    });

    // Try again after a longer delay to ensure all styles are applied
    const longTimeoutId = setTimeout(() => {
      if (!isInitializedRef.current) {
        initializeScroll();
      }
    }, 500);

    // Also try when window loads
    const handleLoad = () => {
      if (!isInitializedRef.current) {
        initializeScroll();
      }
    };
    window.addEventListener('load', handleLoad);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(longTimeoutId);
      window.removeEventListener('load', handleLoad);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [categories.length, isRTL]);

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

  // Drag to scroll functionality
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !scrollContainerRef.current) return;
      e.preventDefault();
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startXRef.current) * 2; // Scroll speed multiplier
      scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
    };

    const handleMouseUp = () => {
      if (!scrollContainerRef.current) return;
      isDraggingRef.current = false;
      scrollContainerRef.current.style.cursor = 'grab';
      scrollContainerRef.current.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    scrollContainerRef.current.style.cursor = 'grabbing';
    scrollContainerRef.current.style.userSelect = 'none';
  };

  const handleMouseUp = () => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = false;
    scrollContainerRef.current.style.cursor = 'grab';
    scrollContainerRef.current.style.userSelect = '';
  };

  const handleMouseLeave = () => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = false;
    scrollContainerRef.current.style.cursor = 'grab';
    scrollContainerRef.current.style.userSelect = '';
  };

  return (
    <div className="py-2 relative" style={{ zIndex: 0, position: 'relative', width: '100%' }}>
      {/* Horizontal scrolling infinite carousel */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide scroll-smooth" 
        style={{ 
          overflowY: 'hidden',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x',
          cursor: 'grab',
          width: '100%',
          maxWidth: '100%',
          paddingLeft: '1rem',
          paddingRight: '1rem',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          ref={scrollContentRef} 
          className="flex relative" 
          style={{ 
            gap: '12px', 
            width: 'max-content',
            minWidth: '100%',
            display: 'flex',
            flexShrink: 0
          }}
        >
          {duplicatedCategories.map((category, index) => {
            const isSelected = selectedCategory === category.key;
            const uniqueKey = `${category.key}-${index}`;
            return (
              <div
                key={uniqueKey}
                className="flex-shrink-0 flex flex-col items-center"
                style={{ 
                  zIndex: isSelected ? 10 : 1,
                  minWidth: '70px',
                  flexShrink: 0
                }}
              >
                <button
                  className={cn(
                    "flex flex-col items-center justify-center cursor-pointer",
                    "transition-all duration-200 ease-out",
                    isSelected && "scale-98"
                  )}
                  aria-label={t(category.key)}
                  onClick={(e) => {
                    // Only trigger click if not dragging
                    if (!isDraggingRef.current) {
                      handleCategoryClick(category.key);
                    }
                  }}
                  onMouseDown={(e) => {
                    // Allow event to bubble for drag scrolling
                    if (!isDraggingRef.current) {
                      e.currentTarget.style.transform = 'scale(0.96)';
                    }
                    // Don't stop propagation - let parent handle drag
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
                    pointerEvents: 'auto',
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

