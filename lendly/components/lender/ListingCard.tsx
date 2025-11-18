"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import {
  Edit,
  MapPin,
  Star,
  Shield,
  Eye,
  Calendar,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type ListingStatus =
  | "active"
  | "paused"
  | "pending"
  | "issues";

export interface Listing {
  id: string;
  title: string;
  category: string;
  location: string;
  pricePerDay: number;
  rating?: { value: number; count: number };
  status: ListingStatus;
  includesInsurance: boolean;
  isFeatured?: boolean;
  hasIssue?: boolean;
  views: number;
  bookings: number;
  revenue: number;
  thumbnailUrl: string;
}

interface ListingCardProps {
  listing: Listing;
  index?: number;
}

const statusLabels: Record<ListingStatus, string> = {
  active: "פעיל",
  paused: "מושהה",
  pending: "ממתין לאישור",
  issues: "בעיות",
};

const statusColors: Record<ListingStatus, string> = {
  active: "bg-teal-100 text-teal-700",
  paused: "bg-gray-100 text-gray-700",
  pending: "bg-amber-100 text-amber-700",
  issues: "bg-red-100 text-red-700",
};

export function ListingCard({
  listing,
  index = 0,
}: ListingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="bg-white rounded-2xl shadow-sm p-4 space-y-3"
      style={{
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Top Row: Thumbnail + Title + Badges */}
      <div className="flex gap-3">
        {/* Thumbnail */}
        <div className="relative w-[90px] h-[90px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          <Image
            src={listing.thumbnailUrl}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="90px"
          />
        </div>

        {/* Title + Metadata */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900 line-clamp-1 flex-1">
              {listing.title}
            </h3>
            <div className="flex gap-1 flex-shrink-0">
              {listing.hasIssue && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700">
                  בעיה
                </span>
              )}
              {listing.isFeatured && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">
                  מומלץ
                </span>
              )}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[listing.status]}`}
              >
                {statusLabels[listing.status]}
              </span>
            </div>
          </div>

          {/* Category + Location */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>קטגוריה: {listing.category}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{listing.location}</span>
            </div>
          </div>

          {/* Price + Rating */}
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-[#00A39A]">
              ₪{listing.pricePerDay} ליום
            </span>
            {listing.rating && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{listing.rating.value}</span>
                <span className="text-gray-500">({listing.rating.count})</span>
              </div>
            )}
            {listing.includesInsurance && (
              <div className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                <Shield className="h-3 w-3" />
                <span>כולל ביטוח</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <Eye className="h-3.5 w-3.5" />
          <span>{listing.views}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <Calendar className="h-3.5 w-3.5" />
          <span>{listing.bookings} הזמנות</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <DollarSign className="h-3.5 w-3.5" />
          <span>₪{listing.revenue.toLocaleString()}</span>
        </div>
      </div>

      {/* Action Button */}
      <Link href={`/listings/${listing.id}/manage`} className="block">
        <Button className="w-full bg-[#00A39A] hover:bg-[#008B83] text-white rounded-xl h-9 text-sm font-medium">
          ניהול
        </Button>
      </Link>
    </motion.div>
  );
}

