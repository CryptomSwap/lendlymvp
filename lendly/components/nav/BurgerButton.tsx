"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface BurgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  ariaLabel?: string;
  ariaControls?: string;
}

export function BurgerButton({
  isOpen,
  onClick,
  ariaLabel = "Toggle menu",
  ariaControls = "side-panel",
}: BurgerButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className="relative h-10 w-10 min-w-[40px] min-h-[40px] rounded-xl hover:bg-[#E7F8F8] active:scale-105 transition-all z-50"
      style={{ color: "#007C7C" }}
      role="button"
      aria-expanded={isOpen}
      aria-controls={ariaControls}
      aria-label={ariaLabel}
      type="button"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-5 h-4">
          {/* Top line */}
          <motion.span
            className="absolute top-0 left-0 w-full h-0.5 bg-current rounded-full"
            animate={{
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 8 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
          {/* Middle line */}
          <motion.span
            className="absolute top-1/2 left-0 w-full h-0.5 bg-current rounded-full -translate-y-1/2"
            animate={{
              opacity: isOpen ? 0 : 1,
              x: isOpen ? 10 : 0,
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          />
          {/* Bottom line */}
          <motion.span
            className="absolute bottom-0 left-0 w-full h-0.5 bg-current rounded-full"
            animate={{
              rotate: isOpen ? -45 : 0,
              y: isOpen ? -8 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
      </div>
    </Button>
  );
}

