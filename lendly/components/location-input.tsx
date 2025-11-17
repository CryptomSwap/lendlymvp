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
    <div className="w-full relative">
      {/* Search bar - rounded-full card */}
      <div className="w-full bg-white rounded-full shadow-sm px-4 py-3 flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#00B3A0] transition-all duration-200 relative">
        {/* Location icon - left side (RTL) */}
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={isGettingLocation}
          className="flex-shrink-0 text-[#009C8D] opacity-70 hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed z-10"
          aria-label="Get current location"
          style={{ transition: 'opacity 120ms ease-out' }}
        >
          {isGettingLocation ? (
            <Loader2 className="animate-spin" style={{ width: '18px', height: '18px' }} />
          ) : (
            <MapPin style={{ width: '18px', height: '18px', strokeWidth: 1.75 }} />
          )}
        </button>
        
        {/* Input field */}
        <Input
          type="text"
          placeholder={locale === "he" ? "" : t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 h-auto bg-transparent border-0 shadow-none placeholder:text-gray-500 text-[14px] text-center focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200 relative z-10"
          dir={locale === "he" ? "rtl" : "ltr"}
          style={{ 
            transition: 'all 200ms ease-out',
          }}
        />
        
        {/* Rotating placeholder overlay for Hebrew */}
        {locale === "he" && !searchQuery && (
          <div
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[14px] z-0 text-center"
            dir="rtl"
            style={{
              opacity: placeholderOpacity,
              transition: `opacity 500ms ease-in-out`,
            }}
          >
            {hebrewPlaceholders[currentPlaceholderIndex]}...
          </div>
        )}
        
        {/* Search icon - right side (RTL) */}
        <div className="flex-shrink-0 text-[#009C8D] opacity-70 pointer-events-none z-10">
          <Search style={{ width: '18px', height: '18px', strokeWidth: 1.75 }} />
        </div>
      </div>
    </div>
  );
}

