"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { Plus, Edit, Package, Box, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useIsRTL } from "@/lib/utils/rtl";

interface Listing {
  id: string;
  title: string;
  dailyRate: number;
  status: string;
  photos: string;
  ratingAvg: number;
  ratingCount: number;
  category?: string;
  locationText?: string;
  issueCount?: number;
  nextBooking?: {
    id: string;
    startDate: string;
    renter: { name: string };
  };
}

type FilterType = "all" | "active" | "pending" | "completed";

export default function ListingsPage() {
  const t = useTranslations("listings");
  const locale = useLocale();
  const isRTL = useIsRTL();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/dashboard/owner");
      const data = await res.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error("Failed to load listings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate filter counts
  const filterCounts = {
    active: listings.filter((l) => l.status === "APPROVED").length,
    pending: listings.filter((l) => l.status === "PENDING").length,
    completed: 0, // TODO: Calculate based on completed bookings
  };

  // Filter listings based on active filter
  const filteredListings = listings.filter((listing) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "active") return listing.status === "APPROVED";
    if (activeFilter === "pending") return listing.status === "PENDING";
    if (activeFilter === "completed") return false; // TODO: Implement completed logic
    return true;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "APPROVED":
        return t("status.active");
      case "PENDING":
        return t("status.pending");
      case "PAUSED":
        return t("status.paused");
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PAUSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 pt-5 pb-4 space-y-6 pb-24" dir={isRTL ? "rtl" : "ltr"}>
        <div className="space-y-4">
          <div className="h-20 bg-muted rounded-2xl animate-pulse" />
          <div className="h-12 bg-muted rounded-2xl animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 flex flex-col min-h-screen" dir={isRTL ? "rtl" : "ltr"} style={{ background: '#F7FBFB' }}>
      {/* Header Block */}
      <section className="px-4 pt-5 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-4 text-center"
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#0F172A]">
              {t("title")}
            </h1>
            <p className="text-[15px] text-[#475569]">
              {t("subtitle")}
            </p>
          </div>

          {/* Primary CTA Button */}
          <Link href="/listings/new" className="block">
            <Button
              className="w-full h-12 rounded-full bg-[#009999] hover:bg-[#036A6A] text-white font-medium shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              style={{
                borderRadius: '9999px',
                height: '48px',
              }}
            >
              <Plus className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
              {t("addListing")}
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Filter / Stats Row */}
      {listings.length > 0 && (
        <section className="px-4 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-4 px-4"
          >
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap snap-start transition-all ${
                activeFilter === "all"
                  ? "bg-[#E0F6F6] text-[#007C7C] border border-[#009999]"
                  : "bg-white text-[#475569] border border-[#E6F3F3] hover:text-[#009999]"
              }`}
              style={{
                borderRadius: '9999px',
              }}
            >
              הכל ({listings.length})
            </button>
            <button
              onClick={() => setActiveFilter("active")}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap snap-start transition-all ${
                activeFilter === "active"
                  ? "bg-[#E0F6F6] text-[#007C7C] border border-[#009999]"
                  : "bg-white text-[#475569] border border-[#E6F3F3] hover:text-[#009999]"
              }`}
              style={{
                borderRadius: '9999px',
              }}
            >
              {t("filters.active")} ({filterCounts.active})
            </button>
            <button
              onClick={() => setActiveFilter("pending")}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap snap-start transition-all ${
                activeFilter === "pending"
                  ? "bg-[#E0F6F6] text-[#007C7C] border border-[#009999]"
                  : "bg-white text-[#475569] border border-[#E6F3F3] hover:text-[#009999]"
              }`}
              style={{
                borderRadius: '9999px',
              }}
            >
              {t("filters.pending")} ({filterCounts.pending})
            </button>
            <button
              onClick={() => setActiveFilter("completed")}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap snap-start transition-all ${
                activeFilter === "completed"
                  ? "bg-[#E0F6F6] text-[#007C7C] border border-[#009999]"
                  : "bg-white text-[#475569] border border-[#E6F3F3] hover:text-[#009999]"
              }`}
              style={{
                borderRadius: '9999px',
              }}
            >
              {t("filters.completed")} ({filterCounts.completed})
            </button>
          </motion.div>
        </section>
      )}

      {/* Content Section */}
      <section className="px-4 pb-4 flex-1">
        {filteredListings.length === 0 && listings.length === 0 ? (
          /* Empty State Card */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card
              className="w-full rounded-2xl p-6 flex flex-col items-center justify-center text-center"
              style={{
                background: 'linear-gradient(135deg, #F5FCFC 0%, #E6F4F4 100%)',
                border: '1px solid #E6F3F3',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                borderRadius: '16px',
              }}
            >
              {/* Circular Icon Container */}
              <div
                className="w-12 h-12 rounded-full bg-[#009999] flex items-center justify-center mb-4"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '9999px',
                }}
              >
                <Box className="h-6 w-6 text-white" strokeWidth={1.75} />
              </div>

              {/* Title */}
              <h2 className="text-[17px] font-bold text-[#0F172A] mb-2">
                {t("empty.title")}
              </h2>

              {/* Body Text */}
              <p className="text-[14px] text-[#475569] mb-6 leading-relaxed max-w-sm">
                {t("empty.subtitle")}
              </p>

              {/* Secondary CTA Button */}
              <Link href="/listings/new" className="w-full">
                <Button
                  className="w-full h-11 rounded-full bg-white text-[#009999] border-2 border-[#009999] hover:bg-[#F7FBFB] font-medium shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                  style={{
                    borderRadius: '9999px',
                    height: '44px',
                  }}
                >
                  {t("empty.cta")}
                </Button>
              </Link>
            </Card>
          </motion.div>
        ) : filteredListings.length === 0 ? (
          /* No listings for active filter */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <p className="text-[15px] text-[#475569]">
              אין השכרות בקטגוריה זו
            </p>
          </motion.div>
        ) : (
          /* Listing Cards */
          <div className="space-y-3">
            {filteredListings.map((listing, index) => {
              const photos = JSON.parse(listing.photos || "[]");
              const mainPhoto = photos[0] || "/placeholder-listing.jpg";

              return (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                >
                  <Card
                    className="overflow-hidden rounded-2xl border shadow-sm hover:shadow-md transition-all active:scale-[0.98] bg-white"
                    style={{
                      border: '1px solid #E6F3F3',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      borderRadius: '16px',
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {/* Thumbnail Image */}
                        <div
                          className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-muted"
                          style={{
                            borderRadius: '12px',
                            width: '96px',
                            height: '96px',
                          }}
                        >
                          <Image
                            src={mainPhoto}
                            alt={listing.title}
                            fill
                            className="object-cover"
                            sizes="96px"
                            loading="lazy"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-2">
                          {/* Title */}
                          <h3 className="text-[15px] font-semibold text-[#0F172A] line-clamp-1">
                            {listing.title}
                          </h3>

                          {/* Price and Status */}
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[16px] font-bold text-[#009999]">
                              ₪{listing.dailyRate}
                              <span className="text-[13px] font-normal text-[#475569]">
                                {" "}ליום
                              </span>
                            </p>
                            <Badge
                              className={`text-[11px] px-2 py-0.5 ${getStatusColor(listing.status)}`}
                              style={{
                                borderRadius: '8px',
                              }}
                            >
                              {getStatusLabel(listing.status)}
                            </Badge>
                          </div>

                          {/* Optional: Location and Rating */}
                          {(listing.locationText || listing.ratingCount > 0) && (
                            <div className="flex items-center gap-3 text-[12px] text-[#475569]">
                              {listing.locationText && (
                                <span className="truncate">{listing.locationText}</span>
                              )}
                              {listing.ratingCount > 0 && (
                                <span className="flex items-center gap-1 whitespace-nowrap">
                                  ⭐ {listing.ratingAvg.toFixed(1)} ({listing.ratingCount})
                                </span>
                              )}
                            </div>
                          )}

                          {/* Manage/Edit Link */}
                          <div className="flex justify-end pt-1">
                            <Link href={`/listings/${listing.id}/edit`}>
                              <button className="text-[13px] font-medium text-[#009999] hover:text-[#036A6A] transition-colors flex items-center gap-1">
                                {t("actions.manage")}
                                {isRTL ? (
                                  <ChevronLeft className="h-3.5 w-3.5" />
                                ) : (
                                  <ChevronRight className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
