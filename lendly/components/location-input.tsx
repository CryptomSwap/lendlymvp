"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { toast } from "sonner";

export function LocationInput() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const t = useTranslations("common");

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
    <div className="flex gap-2 px-4">
      <div className="flex-1 relative">
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={isGettingLocation}
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Get current location"
        >
          {isGettingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </button>
        <Input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 placeholder:text-muted-foreground/60"
        />
      </div>
      <Link href="/search">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full shrink-0"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">{t("search")}</span>
        </Button>
      </Link>
    </div>
  );
}

