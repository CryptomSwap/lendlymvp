"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  { image: "/ladder.png", label: "Ladder" },
  { image: "/Cam.png", label: "Camera" },
  { image: "/shnork.png", label: "Snorkel" },
  { image: "/drill.png", label: "Drill" },
  { image: "/drone.png", label: "Drone" },
];

export function HeroCarousel() {
  const [currentItem, setCurrentItem] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentItem((prev) => (prev + 1) % items.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentItemData = items[currentItem];

  return (
    <div className="relative flex items-center justify-center py-3 px-4 overflow-hidden">
      {/* Stronger radial gradient behind hero area only */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Light mode gradient */}
        <div 
          className="absolute w-80 h-80 rounded-full blur-3xl opacity-70 dark:opacity-0"
          style={{
            background: 'radial-gradient(circle, rgba(14, 165, 165, 0.15) 0%, rgba(14, 165, 165, 0.08) 40%, rgba(14, 165, 165, 0.03) 70%, transparent 100%)'
          }}
        />
        {/* Dark mode gradient - more visible */}
        <div 
          className="absolute w-80 h-80 rounded-full blur-3xl opacity-0 dark:opacity-80"
          style={{
            background: 'radial-gradient(circle, rgba(20, 184, 166, 0.25) 0%, rgba(20, 184, 166, 0.12) 40%, rgba(20, 184, 166, 0.05) 70%, transparent 100%)'
          }}
        />
      </div>

      {/* Spinning background element - increased by 20-25% */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-0"
        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          rotate: 360 
        }}
        transition={{
          rotate: {
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          },
          opacity: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
          },
          scale: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        }}
      >
        <div className="absolute inset-0 blur-xl opacity-25">
          <img
            src="/spin.png"
            alt="Spin decoration"
            className="w-[110px] h-[110px] object-contain"
          />
        </div>
        <img
          src="/spin.png"
          alt="Spin decoration"
          className="w-[110px] h-[110px] object-contain"
        />
      </motion.div>

      {/* Two person symbols - increased size */}
      <div className="absolute left-[32%] top-1/2 -translate-y-1/2 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="/person.png"
            alt="Person"
            className="h-10 w-10 object-contain"
          />
        </motion.div>
      </div>
      <div className="absolute right-[32%] top-1/2 -translate-y-1/2 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <img
            src="/person.png"
            alt="Person"
            className="h-10 w-10 object-contain"
          />
        </motion.div>
      </div>

      {/* Rotating item symbol in center - increased size */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem}
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="relative"
          >
            <div className="absolute inset-0 blur-xl opacity-25">
              <img
                src={currentItemData.image}
                alt={currentItemData.label}
                className="h-[65px] w-[65px] object-contain"
              />
            </div>
            <img
              src={currentItemData.image}
              alt={currentItemData.label}
              className="relative h-[65px] w-[65px] object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

