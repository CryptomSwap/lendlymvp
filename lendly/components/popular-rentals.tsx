"use client";

import { useTranslations } from "next-intl";
import { getListingsNearLocation } from "@/lib/actions/listings";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Star } from "lucide-react";

interface Listing {
  id: string;
  title: string;
  dailyRate: number;
  ratingAvg: number;
  ratingCount: number;
  photos: string;
  locationText: string;
}

export function PopularRentals() {
  const t = useTranslations("common");
  const tListing = useTranslations("listing");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const data = await getListingsNearLocation();
        setListings(data.slice(0, 8)); // Get more listings for scroll
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="px-4 mt-4 mb-4">
        <div className="h-5 w-48 bg-[#13181B] rounded mb-3 ml-auto animate-pulse" />
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 scroll-smooth">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="flex-shrink-0 w-[150px] h-[190px] bg-[#13181B] rounded-[15px] animate-pulse border border-[#1D272C]" 
            />
          ))}
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return null;
  }

  return (
    <div className="px-4 mt-4 mb-4">
      {/* Section Title - Right-aligned (RTL) */}
      <h2 
        className="text-[19px] mb-3 text-white ml-auto w-fit"
        style={{ 
          fontWeight: 600,
          marginBottom: '10px',
          color: '#FFFFFF',
        }}
      >
        {t("popularRentals")}
      </h2>
      
      {/* Horizontal Scroll Container */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth -mx-4 px-4 pb-1">
        {listings.map((listing) => {
          const photos = JSON.parse(listing.photos || "[]");
          const mainPhoto = photos[0] || "/drill.png";
          const rating = listing.ratingAvg || 0;
          
          return (
            <Link
              key={listing.id}
              href={`/listing/${listing.id}`}
              className="flex-shrink-0 w-[150px] h-[190px]"
            >
              {/* Dark Mode Luxe Card */}
              <div
                className="w-full h-full rounded-[15px] overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] flex flex-col"
                style={{
                  background: '#13181B',
                  border: '1px solid #1D272C',
                  borderRadius: '15px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.35), 0 0 6px rgba(15, 165, 164, 0.15)',
                }}
              >
                {/* Image Container - Top 60% */}
                <div 
                  className="relative w-full overflow-hidden flex-shrink-0"
                  style={{ 
                    height: '60%',
                    minHeight: '114px',
                    borderRadius: '14px 14px 0 0',
                  }}
                >
                  <Image
                    src={mainPhoto}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                  {/* Dark overlay gradient */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 100%)',
                    }}
                  />
                </div>
                
                {/* Content Container - Bottom 40% */}
                <div 
                  className="flex flex-col justify-between flex-1"
                  style={{ padding: '12px' }}
                >
                  {/* Title */}
                  <h3 
                    className="text-white line-clamp-1 mb-1.5"
                    style={{
                      fontSize: '13.5px',
                      color: '#FFFFFF',
                      fontWeight: 500,
                    }}
                  >
                    {listing.title}
                  </h3>
                  
                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-3 h-3"
                        style={{
                          fill: star <= Math.round(rating) ? '#FACC15' : 'transparent',
                          color: star <= Math.round(rating) ? '#FACC15' : '#4A5568',
                          filter: star <= Math.round(rating) ? 'drop-shadow(0 0 4px rgba(250, 204, 21, 0.4))' : 'none',
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Price */}
                  <p 
                    className="text-white"
                    style={{
                      fontSize: '14.5px',
                      color: '#FFFFFF',
                      fontWeight: 700,
                    }}
                  >
                    ₪{listing.dailyRate} {tListing("perDay")}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

