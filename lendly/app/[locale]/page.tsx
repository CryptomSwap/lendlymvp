"use client";

import { HeroArea } from "@/components/hero-area";
import { PopularRentalsArea } from "@/components/popular-rentals-area";
import { FloatingLenderCTA } from "@/components/floating-lender-cta";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only show background in light mode
  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  return (
    <div className="pb-24 flex flex-col relative w-full bg-transparent">
      {/* Main gradient background: extends from top and fades out below middle of page (light mode only) */}
      {!isDark && (
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            zIndex: 0,
            height: '70vh', // Extends below middle of viewport
            background: 'linear-gradient(to bottom, #F4FFFB 0%, #E7F6F1 50%, rgba(231, 246, 241, 0.9) 68%, rgba(231, 246, 241, 0.7) 78%, rgba(255, 255, 255, 0.4) 87%, rgba(255, 255, 255, 0.8) 94%, #FFFFFF 100%)',
            transform: 'translateZ(0)', // GPU acceleration
          }}
          aria-hidden="true"
        />
      )}

      {/* Subtle noise texture overlay for premium feel (light mode only) */}
      {!isDark && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix in='colorNoise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            mixBlendMode: 'overlay',
            opacity: 1,
            transform: 'translateZ(0)', // GPU acceleration
          }}
          aria-hidden="true"
        />
      )}
      
      {/* Soft radial pattern behind category icons area with fade-in animation (light mode only) */}
      {!isDark && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-48 sm:top-64 w-[90%] sm:w-full max-w-lg h-[300px] sm:h-[400px] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            zIndex: 1,
            background: 'radial-gradient(ellipse at center, rgba(233, 247, 243, 0.04) 0%, rgba(233, 247, 243, 0.02) 35%, transparent 65%)',
            willChange: mounted ? 'opacity' : 'auto',
            transform: 'translateZ(0)', // GPU acceleration
            maxHeight: 'calc(100vh - 200px)', // Prevent overlap with scrollable content
            backfaceVisibility: 'hidden', // Prevent flicker
          }}
          aria-hidden="true"
        />
      )}

      {/* Subtle abstract decorative blob shapes (light mode only) */}
      {!isDark && (
        <>
          {/* Blob 1: Top-left (behind search bar) */}
          <div
            className="absolute top-12 left-0 w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-3xl pointer-events-none"
            style={{
              zIndex: 1,
              background: '#DFF7EE',
              opacity: 0.1,
              transform: 'translateZ(0) translate(-30%, -30%)',
            }}
            aria-hidden="true"
          />
          
          {/* Blob 2: Center-right (behind category icons) */}
          <div
            className="absolute top-48 right-0 sm:top-64 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl pointer-events-none"
            style={{
              zIndex: 1,
              background: '#CBF3E0',
              opacity: 0.08,
              transform: 'translateZ(0) translate(25%, -20%)',
            }}
            aria-hidden="true"
          />
          
          {/* Blob 3: Bottom-left (behind listings) */}
          <div
            className="absolute bottom-32 left-0 sm:bottom-40 w-60 h-60 sm:w-80 sm:h-80 rounded-full blur-3xl pointer-events-none"
            style={{
              zIndex: 1,
              background: '#DFF7EE',
              opacity: 0.09,
              transform: 'translateZ(0) translate(-25%, 25%)',
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Hero Area - Tagline, CTA, Search, Categories */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-20"
      >
        <HeroArea />
      </motion.div>


      {/* Popular Rentals in Your Area Section */}
      {/* FIXED: Increased margin from mt-2 to mt-4 for better spacing from categories */}
      <motion.div 
        className="mt-4 relative z-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <PopularRentalsArea />
      </motion.div>

      {/* Premium Floating CTA Button - Fixed above bottom nav */}
      <FloatingLenderCTA variant="fixed" />
    </div>
  );
}

