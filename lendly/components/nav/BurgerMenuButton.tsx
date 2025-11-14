"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BurgerMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  ariaLabel?: string;
  ariaControls?: string;
}

export function BurgerMenuButton({
  isOpen,
  onClick,
  ariaLabel = "Toggle menu",
  ariaControls = "side-menu",
}: BurgerMenuButtonProps) {
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
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" strokeWidth={2} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="h-6 w-6" strokeWidth={2} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Button>
  );
}

