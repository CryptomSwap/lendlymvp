"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

/**
 * BodyGradient Component
 * 
 * Dynamically updates the body background gradient based on theme.
 * This ensures the gradient behind the app shell changes in dark mode.
 */
export function BodyGradient() {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const isDark = resolvedTheme === "dark" || theme === "dark";
    const body = document.body;
    
    // Get base classes (font variables, antialiased, etc.)
    const baseClasses = body.className
      .replace(/bg-gradient-to-b from-\[#E8F8F5\] to-\[#F9FFFD\]/g, "")
      .replace(/bg-gradient-to-b from-\[#0a0a0a\] to-\[#000000\]/g, "")
      .trim();
    
    if (isDark) {
      // Dark mode: use dark background
      body.className = `${baseClasses} min-h-screen flex justify-center bg-gradient-to-b from-[#0a0a0a] to-[#000000]`.trim();
    } else {
      // Light mode: use light green gradient
      body.className = `${baseClasses} min-h-screen flex justify-center bg-gradient-to-b from-[#E8F8F5] to-[#F9FFFD]`.trim();
    }
  }, [theme, resolvedTheme]);

  return null;
}
