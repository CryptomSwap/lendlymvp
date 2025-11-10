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
    <div className="relative flex items-center justify-center py-12 px-4 overflow-hidden">
      {/* Spinning background element */}
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
        <div className="absolute inset-0 blur-xl opacity-30">
          <img
            src="/spin.png"
            alt="Spin decoration"
            className="h-full w-full max-w-64 max-h-64 object-contain"
          />
        </div>
        <img
          src="/spin.png"
          alt="Spin decoration"
          className="h-full w-full max-w-64 max-h-64 object-contain"
        />
      </motion.div>

      {/* Two person symbols */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="/person.png"
            alt="Person"
            className="h-12 w-12 object-contain"
          />
        </motion.div>
      </div>
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <img
            src="/person.png"
            alt="Person"
            className="h-12 w-12 object-contain"
          />
        </motion.div>
      </div>

      {/* Rotating item symbol in center */}
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
            <div className="absolute inset-0 blur-xl opacity-30">
              <img
                src={currentItemData.image}
                alt={currentItemData.label}
                className="h-20 w-20 object-contain"
              />
            </div>
            <img
              src={currentItemData.image}
              alt={currentItemData.label}
              className="relative h-20 w-20 object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
    </div>
  );
}

