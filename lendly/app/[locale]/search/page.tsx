"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { ListingCard } from "@/components/listing-card";
import { searchListings } from "@/lib/actions/listings";
import { CalendarIcon, MapPin, Filter, Search as SearchIcon, ChevronDown, Star } from "lucide-react";
import { format } from "date-fns";
import { he, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function SearchPage() {
  const t = useTranslations("common");
  const tSearch = useTranslations("search");
  const locale = useLocale();
  const isRTL = locale === "he";
  const [isPending, startTransition] = useTransition();
  const [listings, setListings] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    locationText: "",
    preciseLocation: "",
    priceRange: [0, 1000] as [number, number],
    minRating: 0,
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
    insurance: false,
  });
  const filterCardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSearch = () => {
    startTransition(async () => {
      const results = await searchListings({
        locationText: filters.locationText || filters.preciseLocation || undefined,
        category: undefined,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        minRating: filters.minRating,
        startDate: filters.dateRange.from,
        endDate: filters.dateRange.to,
        insurance: filters.insurance,
      });
      setListings(results);
    });
  };

  const clearFilters = () => {
    setFilters({
      locationText: "",
      preciseLocation: "",
      priceRange: [0, 1000],
      minRating: 0,
      dateRange: {
        from: undefined,
        to: undefined,
      },
      insurance: false,
    });
    setListings([]);
  };

  const scrollToFilters = () => {
    filterCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleStarClick = (rating: number) => {
    setFilters({ ...filters, minRating: rating });
  };

  return (
    <div className="pb-24 flex flex-col" dir={isRTL ? "rtl" : "ltr"} style={{ gap: '16px' }}>
      {/* Header Row */}
      <motion.div
        className="px-4 pt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-[#0F172A]">
            {t("search")}
          </h1>
          <button
            onClick={clearFilters}
            className="text-[#00A0A0] text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ transition: 'opacity 120ms ease-out' }}
          >
            {tSearch("clearFilters")}
          </button>
        </div>
      </motion.div>

      {/* Main Search Bar */}
      <motion.div
        className="px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="relative w-full">
          {/* Filter icon button on the left */}
          <button
            type="button"
            onClick={scrollToFilters}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-[#00A0A0] opacity-70 hover:opacity-100 transition-opacity"
            style={{ transition: 'opacity 120ms ease-out' }}
            aria-label={tSearch("advancedFilters")}
          >
            <Filter style={{ width: '18px', height: '18px', strokeWidth: 1.75 }} />
          </button>
          
          {/* Location pin icon on the right side (RTL) */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-[#00A0A0] opacity-70 pointer-events-none">
            <MapPin style={{ width: '19px', height: '19px', strokeWidth: 1.75 }} />
          </div>
          
          <Input
            type="text"
            value={filters.locationText}
            onChange={(e) => setFilters({ ...filters, locationText: e.target.value })}
            placeholder={tSearch("whereAreYouLooking")}
            className="w-full h-[50px] pr-12 pl-12 rounded-[28px] bg-white border border-[#E6F3F3] shadow-[0_2px_8px_rgba(0,0,0,0.08)] placeholder:text-[#475569] text-[15px] focus:ring-2 focus:ring-[#00A0A0] focus:ring-offset-0 focus:border-[#00A0A0] focus:shadow-[0_4px_12px_rgba(0,160,160,0.2)] transition-all duration-200"
            style={{ 
              transition: 'all 200ms ease-out',
              borderRadius: '28px'
            }}
          />
        </div>
      </motion.div>

      {/* Filter Card */}
      <motion.div
        ref={filterCardRef}
        className="px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Card
          className="rounded-2xl p-5"
          style={{
            background: 'linear-gradient(to bottom, #F7FBFB 0%, #E6F3F3 100%)',
            border: '1px solid #E6F3F3',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Filter Card Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-[#0F172A]">
              {tSearch("advancedFilters")}
            </h2>
            <ChevronDown className={cn("h-4 w-4 text-[#475569] opacity-60", isRTL && "rotate-180")} />
          </div>

          <div className="space-y-5">
            {/* Precise Location (optional) */}
            <div>
              <Label htmlFor="preciseLocation" className="text-sm font-medium text-[#0F172A] mb-2 block">
                {t("location")}
              </Label>
              <Input
                id="preciseLocation"
                value={filters.preciseLocation}
                onChange={(e) => setFilters({ ...filters, preciseLocation: e.target.value })}
                placeholder={tSearch("locationPlaceholder")}
                className="h-10 rounded-xl bg-white border border-[#E6F3F3] text-sm focus:ring-2 focus:ring-[#00A0A0] focus:border-[#00A0A0]"
              />
            </div>

            {/* Price Range */}
            <div>
              <Label className="text-sm font-medium text-[#0F172A] mb-3 block">
                {tSearch("priceRange")}
              </Label>
              <div className="space-y-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    setFilters({ ...filters, priceRange: value as [number, number] })
                  }
                  max={1000}
                  step={10}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs text-[#64748B]" dir="ltr">
                  <span>{isRTL ? `₪${filters.priceRange[0]}` : `₪${filters.priceRange[1]}`}</span>
                  <span>{isRTL ? `₪${filters.priceRange[1]}` : `₪${filters.priceRange[0]}`}</span>
                </div>
                <p className="text-xs text-[#64748B] text-center mt-1" dir="ltr">
                  ₪{filters.priceRange[0]} – ₪{filters.priceRange[1]}
                </p>
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <Label className="text-sm font-medium text-[#0F172A] mb-3 block">
                {tSearch("minimumRating")}
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="focus:outline-none transition-transform active:scale-90"
                      aria-label={`${star} stars`}
                    >
                      <Star
                        className={cn(
                          "h-5 w-5 transition-colors",
                          star <= filters.minRating
                            ? "fill-[#00A0A0] text-[#00A0A0]"
                            : "fill-[#E2E8F0] text-[#E2E8F0]"
                        )}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                </div>
                {filters.minRating > 0 && (
                  <span className="text-sm text-[#64748B]">
                    {filters.minRating.toFixed(1)}+
                  </span>
                )}
              </div>
            </div>

            {/* Availability */}
            <div>
              <Label className="text-sm font-medium text-[#0F172A] mb-2 block">
                {tSearch("availability")}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full font-normal h-10 rounded-xl bg-white border border-[#E6F3F3] hover:bg-[#F7FBFB]",
                      isRTL ? "justify-end text-right" : "justify-start text-left",
                      !filters.dateRange.from && "text-[#64748B]"
                    )}
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    <CalendarIcon className={cn("h-4 w-4", isRTL ? "mr-2" : "ml-2")} />
                    {filters.dateRange.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, isRTL ? "dd/MM/yyyy" : "MM/dd/yyyy", { locale: isRTL ? he : enUS })} -{" "}
                          {format(filters.dateRange.to, isRTL ? "dd/MM/yyyy" : "MM/dd/yyyy", { locale: isRTL ? he : enUS })}
                        </>
                      ) : (
                        format(filters.dateRange.from, isRTL ? "dd/MM/yyyy" : "MM/dd/yyyy", { locale: isRTL ? he : enUS })
                      )
                    ) : (
                      <span>{tSearch("selectDateRange")}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-auto p-0" 
                  align={isRTL ? "end" : "start"}
                  side={isRTL ? "left" : "right"}
                >
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={filters.dateRange.from || new Date()}
                    selected={{
                      from: filters.dateRange.from,
                      to: filters.dateRange.to,
                    }}
                    onSelect={(range) =>
                      setFilters({
                        ...filters,
                        dateRange: {
                          from: range?.from,
                          to: range?.to,
                        },
                      })
                    }
                    numberOfMonths={isMobile ? 1 : 2}
                    locale={isRTL ? he : enUS}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Include Insurance */}
            <div className="flex items-center justify-between">
              <Label htmlFor="insurance" className="text-sm font-medium text-[#0F172A] cursor-pointer">
                {tSearch("onlyWithInsurance")}
              </Label>
              <Switch
                id="insurance"
                checked={filters.insurance}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, insurance: checked })
                }
                className="data-[state=checked]:bg-[#00A0A0]"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Primary CTA Button */}
      <motion.div
        className="px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="space-y-2">
          <Button
            onClick={handleSearch}
            disabled={isPending}
            className="w-full h-12 rounded-[28px] bg-[#00A0A0] hover:bg-[#0C7C7B] text-white font-medium text-base shadow-md transition-all duration-200 active:scale-[0.98]"
            style={{
              borderRadius: '28px',
              boxShadow: '0 4px 12px rgba(0, 160, 160, 0.3)',
            }}
          >
            <SearchIcon className="ml-2 h-4 w-4" />
            {isPending ? tSearch("searching") : tSearch("showResults")}
          </Button>
          <p className="text-xs text-[#64748B] text-center font-light">
            {tSearch("filterHelperText")}
          </p>
        </div>
      </motion.div>

      {/* Results Section */}
      <motion.div
        className="px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h2 className="text-[19px] font-semibold text-[#0F172A] mb-4 text-right">
          {tSearch("results")}
        </h2>
        
        {listings.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-4 px-4">
            {listings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.012,
                }}
                className="flex-shrink-0 snap-start"
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-center text-[#64748B] text-sm py-8 font-light">
              {isPending ? tSearch("searching") : tSearch("noResults")}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
