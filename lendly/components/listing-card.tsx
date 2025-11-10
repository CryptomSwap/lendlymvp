"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useState } from "react";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    dailyRate: number;
    ratingAvg: number;
    ratingCount: number;
    photos: string;
    locationText: string;
  };
}

export function ListingCard({ listing }: ListingCardProps) {
  const photos = JSON.parse(listing.photos || "[]");
  const mainPhoto = photos[0] || "/drill.png";
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/listing/${listing.id}`}>
      <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
        <div className="relative aspect-square bg-muted">
          {!imageError ? (
            <Image
              src={mainPhoto}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xs">
              No Image
            </div>
          )}
        </div>
        <div className="p-3 space-y-1">
          <h3 className="text-sm font-semibold line-clamp-1">{listing.title}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span className="text-xs font-medium">{listing.ratingAvg.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">
              ({listing.ratingCount})
            </span>
          </div>
          <p className="text-sm font-bold text-primary">
            ₪{listing.dailyRate}/day
          </p>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {listing.locationText}
          </p>
        </div>
      </Card>
    </Link>
  );
}

