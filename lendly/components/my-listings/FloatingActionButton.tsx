"use client";

import { Plus } from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";

export function FloatingActionButton() {
  return (
    <Link href="/listings/new">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-[#00A39A] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#008B83] transition-colors md:hidden"
        aria-label="השכר פריט חדש"
      >
        <Plus className="h-6 w-6" />
      </motion.button>
    </Link>
  );
}

