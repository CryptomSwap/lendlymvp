"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import {
  Edit,
  Pause,
  Play,
  MapPin,
  Star,
  Shield,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type ListingStatus =
  | "active"
  | "paused"
  | "pending"
  | "deleted";

export type ListingCategory =
  | "camera"
  | "drone"
  | "tools"
  | "dj"
  | "camping"
  | "other";

export interface Listing {
  id: string;
  title: string;
  category: ListingCategory;
  location: string;
  pricePerDay: number;
  rating?: { value: number; count: number };
  status: ListingStatus;
  includesInsurance: boolean;
  thumbnailUrl: string;
  nextBooking?: {
    from: string;
    to: string;
    renterName: string;
  };
}

interface ListingCardProps {
  listing: Listing;
  index?: number;
  onPauseToggle?: (id: string) => void;
}

const statusLabels: Record<ListingStatus, string> = {
  active: "פעיל",
  paused: "מושהה",
  pending: "ממתין לאישור",
  deleted: "נמחק (מוסתר)",
};

const statusColors: Record<ListingStatus, string> = {
  active: "bg-teal-100 text-teal-700",
  paused: "bg-gray-100 text-gray-700",
  pending: "bg-amber-100 text-amber-700",
  deleted: "bg-red-100 text-red-700",
};

export function ListingCard({
  listing,
  index = 0,
  onPauseToggle,
}: ListingCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("he-IL", {
      day: "numeric",
      month: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="bg-white rounded-2xl shadow-sm p-3 space-y-3"
    >
      {/* Top Row: Thumbnail + Title + Status */}
      <div className="flex gap-3">
        {/* Thumbnail */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          <Image
            src={listing.thumbnailUrl}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        {/* Title + Metadata */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900 line-clamp-1 flex-1">
              {listing.title}
            </h3>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap flex-shrink-0 ${statusColors[listing.status]}`}
            >
              {statusLabels[listing.status]}
            </span>
          </div>

          {/* Metadata Row */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{listing.location}</span>
            </div>
            <span>•</span>
            <span className="font-medium text-[#00A39A]">
              ₪{listing.pricePerDay} ליום
            </span>
            {listing.rating && (
              <>
                <span>•</span>
                <div className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{listing.rating.value}</span>
                </div>
              </>
            )}
          </div>

          {/* Insurance Tag */}
          {listing.includesInsurance && (
            <div className="flex items-center gap-1 text-[10px] text-blue-600">
              <Shield className="h-3 w-3" />
              <span>כולל ביטוח</span>
            </div>
          )}
        </div>
      </div>

      {/* Middle Row: Next Booking */}
      {listing.nextBooking && (
        <div className="flex items-center gap-2 px-2 py-1.5 bg-teal-50 rounded-lg text-xs text-teal-700">
          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
          <span>
            הזמנה קרובה: {formatDate(listing.nextBooking.from)}–
            {formatDate(listing.nextBooking.to)} · {listing.nextBooking.renterName}
          </span>
        </div>
      )}

      {/* Bottom Row: Actions */}
      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <Link
          href={`/listings/${listing.id}/edit`}
          className="flex-1"
        >
          <Button
            variant="ghost"
            className="w-full h-8 text-xs text-gray-600 hover:text-[#00A39A] hover:bg-[#F3FBFB]"
          >
            <Edit className="h-3.5 w-3.5 ml-1" />
            ערוך פריט
          </Button>
        </Link>
        <Link
          href={`/listings/${listing.id}/manage`}
          className="flex-1"
        >
          <Button
            variant="ghost"
            className="w-full h-8 text-xs text-gray-600 hover:text-[#00A39A] hover:bg-[#F3FBFB]"
          >
            נהל הזמנות
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="flex-1 h-8 text-xs text-gray-600 hover:text-[#00A39A] hover:bg-[#F3FBFB]"
          onClick={() => onPauseToggle?.(listing.id)}
        >
          {listing.status === "paused" ? (
            <>
              <Play className="h-3.5 w-3.5 ml-1" />
              הפעל
            </>
          ) : (
            <>
              <Pause className="h-3.5 w-3.5 ml-1" />
              השהה
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
