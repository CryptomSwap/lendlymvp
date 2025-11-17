"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * AppBackground Component
 * 
 * Provides a subtle mint/teal gradient background with abstract blob shapes
 * for visual depth. Designed to be extremely subtle and not interfere with
 * content readability.
 * 
 * Features:
 * - Soft gradient: #F5FBFA (top) to #E9F7F3 (bottom)
 * - Two blurred blob shapes (top-left, bottom-right)
 * - Mobile-first responsive sizing
 * - Respects dark mode (blobs disabled in dark mode for better contrast)
 */
export function AppBackground() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if we're in dark mode
  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  return (
    <div
      className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Blob Shapes - Only show in light mode */}
      {!isDark && (
        <>
          {/* Top-left blob */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              top: "-8%",
              left: "-8%",
              width: "clamp(260px, 35vw, 340px)",
              height: "clamp(260px, 35vw, 340px)",
              background: "#C7F1E9",
              opacity: 0.07,
              filter: "blur(100px)",
              WebkitFilter: "blur(100px)",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Bottom-right blob */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              bottom: "-8%",
              right: "-8%",
              width: "clamp(260px, 35vw, 340px)",
              height: "clamp(260px, 35vw, 340px)",
              background: "#C7F1E9",
              opacity: 0.07,
              filter: "blur(100px)",
              WebkitFilter: "blur(100px)",
              transform: "translate(50%, 50%)",
            }}
          />
        </>
      )}
    </div>
  );
}

