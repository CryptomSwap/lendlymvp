"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { toast } from "sonner";

export function LocationInput() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const t = useTranslations("common");
  const locale = useLocale();
  
  // Rotating placeholder words for Hebrew
  const hebrewPlaceholders = ["מקדחה", "פטיש", "מצלמה", "סולם", "ציוד אירועים"];
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [placeholderOpacity, setPlaceholderOpacity] = useState(1);
  
  // Rotate placeholder text with fade animation (only for Hebrew)
  useEffect(() => {
    if (locale !== "he" || searchQuery) return;
    
    const fadeDuration = 500; // milliseconds
    const showDuration = 2000; // milliseconds
    
    const interval = setInterval(() => {
      // Fade out
      setPlaceholderOpacity(0);
      
      setTimeout(() => {
        // Change text
        setCurrentPlaceholderIndex((prev) => (prev + 1) % hebrewPlaceholders.length);
        // Fade in
        setPlaceholderOpacity(1);
      }, fadeDuration);
    }, showDuration + fadeDuration);
    
    return () => clearInterval(interval);
  }, [locale, searchQuery, hebrewPlaceholders.length]);

  const handleGetLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // You can use these coordinates to update the search or filter listings
        toast.success(`Location found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setIsGettingLocation(false);
        // Optionally update the search query or trigger a location-based search
        // You might want to reverse geocode to get an address
      },
      (error) => {
        let errorMessage = "Failed to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        toast.error(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="px-4">
      <div className="relative w-full">
        {/* Location icon */}
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={isGettingLocation}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-[#009999] opacity-70 hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Get current location"
          style={{ transition: 'opacity 120ms ease-out' }}
        >
          {isGettingLocation ? (
            <Loader2 className="animate-spin" style={{ width: '19px', height: '19px' }} />
          ) : (
            <MapPin style={{ width: '19px', height: '19px', strokeWidth: 1.75 }} />
          )}
        </button>
        {/* Search icon */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 z-10 text-[#009999] opacity-70 pointer-events-none">
          <Search style={{ width: '19px', height: '19px', strokeWidth: 1.75 }} />
        </div>
        <Input
          type="text"
          placeholder={locale === "he" ? "" : t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-[50px] pr-28 pl-4 rounded-[28px] bg-white border border-[#E6F3F3] shadow-[0_2px_8px_rgba(0,153,153,0.12)] placeholder:text-[#475569] text-[15px] focus:ring-2 focus:ring-[#009999] focus:ring-offset-0 focus:border-transparent focus:shadow-[0_4px_12px_rgba(0,153,153,0.2)] transition-all duration-200"
          style={{ 
            transition: 'all 200ms ease-out',
            borderRadius: '28px'
          }}
        />
        {/* Rotating placeholder overlay for Hebrew */}
        {locale === "he" && !searchQuery && (
          <div
            className="absolute right-28 top-1/2 -translate-y-1/2 pointer-events-none text-[#475569] text-[15px] z-0 text-right"
            dir="rtl"
            style={{
              opacity: placeholderOpacity,
              transition: `opacity 500ms ease-in-out`,
            }}
          >
            {hebrewPlaceholders[currentPlaceholderIndex]}...
          </div>
        )}
      </div>
    </div>
  );
}

