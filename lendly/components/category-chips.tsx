"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const categories = [
  { key: "cameras", image: "/Cam.png" },
  { key: "drones", image: "/drone.png" },
  { key: "tools", image: "/drill.png" },
  { key: "djGear", image: "/ladder.png" },
  { key: "camping", image: "/shnork.png" },
  { key: "sports", image: "/racket.png" },
] as const;

export function CategoryChips() {
  const t = useTranslations("common");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [pressedCategory, setPressedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryKey: string) => {
    if (selectedCategory === categoryKey) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryKey);
    }
  };

  return (
    <div className="relative w-full">
      {/* Horizontal scrolling container */}
      <div 
        className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x',
        }}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.key;
          const isPressed = pressedCategory === category.key;
          return (
            <div
              key={category.key}
              className="flex flex-col items-center justify-center w-18 min-w-[72px] snap-center flex-shrink-0"
            >
              <button
                className="flex flex-col items-center justify-center cursor-pointer"
                aria-label={t(category.key)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryClick(category.key);
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setPressedCategory(category.key);
                  const target = e.currentTarget;
                  if (target) {
                    target.style.transform = 'scale(0.97)';
                  }
                }}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  setPressedCategory(null);
                  const target = e.currentTarget;
                  if (target) {
                    target.style.transform = '';
                  }
                }}
                onMouseLeave={(e) => {
                  setPressedCategory(null);
                  const target = e.currentTarget;
                  if (target) {
                    target.style.transform = '';
                  }
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setPressedCategory(category.key);
                  const target = e.currentTarget;
                  if (target) {
                    target.style.transform = 'scale(0.97)';
                  }
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  setPressedCategory(null);
                  const target = e.currentTarget;
                  setTimeout(() => {
                    if (target) {
                      target.style.transform = '';
                    }
                  }, 120);
                }}
                style={{ 
                  transition: 'transform 120ms ease-out',
                }}
              >
                <div 
                  className={cn(
                    "w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center transition-all relative category-shimmer",
                    isSelected && "border border-[#00B3A0]"
                  )}
                >
                  <img
                    src={category.image}
                    alt={t(category.key)}
                    className="object-contain relative z-10"
                    style={{
                      width: isPressed ? '48px' : '32px',
                      height: isPressed ? '48px' : '32px',
                      opacity: isSelected ? 1 : 0.7,
                      transition: 'width 200ms cubic-bezier(0.34, 1.56, 0.64, 1), height 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                  />
                </div>
                <span 
                  className={cn(
                    "text-xs mt-2 text-center",
                    isSelected ? "text-[#00B3A0]" : "text-gray-600"
                  )}
                >
                  {t(category.key)}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
