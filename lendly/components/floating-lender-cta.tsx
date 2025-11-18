"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingLenderCTAProps {
  variant?: "fixed" | "inline";
}

export function FloatingLenderCTA({ variant = "fixed" }: FloatingLenderCTAProps) {
  const router = useRouter();
  const [hasListings, setHasListings] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    if (variant !== "fixed") return;
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);
  
  // Scroll-aware opacity and scale - slightly reduce when scrolling deep
  const opacity = scrollY > 300 ? 0.85 : 1;
  const scale = scrollY > 300 ? 0.98 : 1;

  useEffect(() => {
    // Check if user has listings
    const checkListings = async () => {
      try {
        const response = await fetch("/api/dashboard/owner");
        if (response.ok) {
          const data = await response.json();
          setHasListings((data.listings?.length || 0) > 0);
        }
      } catch (error) {
        // User might not be logged in, that's okay - silently fail
      }
    };

    checkListings();
  }, []);

  const handleClick = () => {
    router.push("/listings/new");
  };

  const handlePressStart = () => {
    setIsPressed(true);
  };

  const handlePressEnd = () => {
    setIsPressed(false);
  };

  // Premium aspirational text
  const text = "תרוויחו מהציוד שלכם";

  const isFixed = variant === "fixed";

  return (
    <motion.button
      onClick={handleClick}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      className={cn(
        "w-[90%] max-w-[400px] h-[46px]",
        "rounded-full",
        "flex items-center justify-center gap-2.5",
        "text-white font-bold text-[15px]",
        "pointer-events-auto",
        "overflow-hidden relative",
        "px-5 py-2.5",
        // Subtle floating shadow - refined and soft
        "shadow-[0_4px_12px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.1)]",
        isFixed 
          ? "fixed left-1/2 -translate-x-1/2 z-[60]" 
          : "relative mx-auto"
      )}
      style={{
        ...(isFixed
          ? {
              // Position: 10px above bottom nav (compact gap)
              // Bottom nav container is at bottom-3 (12px)
              // Nav has py-2 (8px top/bottom) + h-14 (56px content) = 72px total height
              // Top of nav is at 12px + 72px = 84px from bottom
              // Button should be 10px above that = 94px from bottom
              // Plus safe area inset for devices with bottom insets (iPhone, Android)
              bottom: "calc(12px + 8px + 56px + 8px + 10px + env(safe-area-inset-bottom, 0px))",
            }
          : {}),
        // Refined teal gradient - darker on right to lighter on left (RTL)
        background: "linear-gradient(90deg, #0ea5a5 0%, #14b8a6 100%)",
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ 
        opacity: isFixed ? opacity : 1, 
        y: 0,
        scale: isPressed ? 0.97 : (isFixed ? scale : 1),
      }}
      transition={{
        opacity: {
          duration: 0.4,
          delay: 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
        y: {
          duration: 0.4,
          delay: 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
        scale: {
          type: isPressed ? "spring" : "tween",
          stiffness: isPressed ? 400 : undefined,
          damping: isPressed ? 25 : undefined,
          duration: isPressed ? undefined : 0.2,
          ease: "easeOut",
        },
      }}
      aria-label={text}
    >
      {/* Subtle glossy overlay effect - refined */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0) 60%, rgba(0,0,0,0.05) 100%)",
        }}
      />

      {/* Shimmer effect - animated gradient sweep */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          x: {
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          },
        }}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
          width: "50%",
          height: "100%",
          transform: "skewX(-20deg)",
        }}
      />

      {/* Content - RTL layout */}
      <div className="relative z-10 flex items-center justify-center gap-2.5" dir="rtl">
        {/* Text */}
        <span 
          className="font-bold leading-tight"
          style={{ 
            fontWeight: 700,
            fontSize: "15px",
            letterSpacing: "-0.01em",
          }}
        >
          {text}
        </span>
      </div>
    </motion.button>
  );
}

