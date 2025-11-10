"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ListingCard } from "@/components/listing-card";
import { searchListings } from "@/lib/actions/listings";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const t = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const [listings, setListings] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    locationText: "",
    category: "",
    priceRange: [0, 1000] as [number, number],
    minRating: 0,
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
    insurance: false,
  });

  const handleSearch = () => {
    startTransition(async () => {
      const results = await searchListings({
        locationText: filters.locationText || undefined,
        category: filters.category || undefined,
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

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-h1">{t("search")}</h1>

      {/* Filters */}
      <Card className="p-4 space-y-4">
        <div>
          <Label htmlFor="location">{t("location")}</Label>
          <Input
            id="location"
            value={filters.locationText}
            onChange={(e) =>
              setFilters({ ...filters, locationText: e.target.value })
            }
            placeholder={t("location")}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Price Range: ₪{filters.priceRange[0]} - ₪{filters.priceRange[1]}</Label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) =>
              setFilters({ ...filters, priceRange: value as [number, number] })
            }
            max={1000}
            step={10}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Minimum Rating: {filters.minRating}</Label>
          <Slider
            value={[filters.minRating]}
            onValueChange={(value) =>
              setFilters({ ...filters, minRating: value[0] })
            }
            max={5}
            step={0.5}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Availability</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !filters.dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                      {format(filters.dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(filters.dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange.from}
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
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="insurance"
            checked={filters.insurance}
            onChange={(e) =>
              setFilters({ ...filters, insurance: e.target.checked })
            }
            className="h-4 w-4"
          />
          <Label htmlFor="insurance" className="cursor-pointer">
            Include Insurance
          </Label>
        </div>

        <Button
          onClick={handleSearch}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? "Searching..." : "Search"}
        </Button>
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h2">Results</h2>
          {listings.length > 0 && (
            <Badge variant="secondary">{listings.length} found</Badge>
          )}
        </div>
        {listings.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            {isPending ? "Searching..." : "No listings found. Try adjusting your filters."}
          </p>
        )}
      </div>
    </div>
  );
}

