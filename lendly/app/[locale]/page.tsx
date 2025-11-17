"use client";

import { HeroArea } from "@/components/hero-area";
import { PopularRentalsArea } from "@/components/popular-rentals-area";
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
    <div className="pb-24 flex flex-col relative w-full">

      {/* Subtle noise texture overlay for premium feel (light mode only) */}
      {!isDark && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: -20,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix in='colorNoise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            mixBlendMode: 'overlay',
            opacity: 1,
            transform: 'translateZ(0)', // GPU acceleration
          }}
          aria-hidden="true"
        />
      )}
      
      {/* Subtle light-green background texture - vertical gradient with fade-in animation (light mode only) */}
      {!isDark && (
        <motion.div
          className="absolute inset-0 pointer-events-none -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            background: 'linear-gradient(to bottom, rgba(247, 252, 250, 0.03) 0%, rgba(233, 247, 243, 0.03) 100%)',
            willChange: mounted ? 'opacity' : 'auto',
            transform: 'translateZ(0)', // GPU acceleration
            backfaceVisibility: 'hidden', // Prevent flicker
          }}
          aria-hidden="true"
        />
      )}
      
      {/* Soft radial pattern behind category icons area with fade-in animation (light mode only) */}
      {!isDark && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-48 sm:top-64 w-[90%] sm:w-full max-w-lg h-[300px] sm:h-[400px] pointer-events-none -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
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
            className="absolute top-12 left-0 w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-3xl pointer-events-none -z-10"
            style={{
              background: '#DFF7EE',
              opacity: 0.1,
              transform: 'translateZ(0) translate(-30%, -30%)',
            }}
            aria-hidden="true"
          />
          
          {/* Blob 2: Center-right (behind category icons) */}
          <div
            className="absolute top-48 right-0 sm:top-64 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl pointer-events-none -z-10"
            style={{
              background: '#CBF3E0',
              opacity: 0.08,
              transform: 'translateZ(0) translate(25%, -20%)',
            }}
            aria-hidden="true"
          />
          
          {/* Blob 3: Bottom-left (behind listings) */}
          <div
            className="absolute bottom-32 left-0 sm:bottom-40 w-60 h-60 sm:w-80 sm:h-80 rounded-full blur-3xl pointer-events-none -z-10"
            style={{
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
        className="relative z-10"
      >
        <HeroArea />
      </motion.div>

      {/* Fade-out transition from gradient to white (light mode only) */}
      {!isDark && (
        <div 
          className="h-8 -mt-8 relative pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(246, 255, 253, 0.3) 0%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 1) 100%)',
            transform: 'translateZ(0)', // GPU acceleration
          }}
          aria-hidden="true"
        />
      )}

      {/* Popular Rentals in Your Area Section */}
      <motion.div 
        className="mt-5 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <PopularRentalsArea />
      </motion.div>
    </div>
  );
}

