"use client";

import { HeroArea } from "@/components/hero-area";
import { PopularRentalsArea } from "@/components/popular-rentals-area";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="pb-24 flex flex-col">
      {/* Hero Area - Tagline, CTA, Search, Categories */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <HeroArea />
      </motion.div>

      {/* Popular Rentals in Your Area Section */}
      <motion.div 
        className="mt-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <PopularRentalsArea />
      </motion.div>
    </div>
  );
}

