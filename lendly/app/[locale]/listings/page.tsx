"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Plus, Package } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { ListingCard, Listing } from "@/components/lender/ListingCard";
import { StatusTabs, FilterType } from "@/components/lender/StatusTabs";
import { MetricsPanel } from "@/components/lender/MetricsPanel";
import { EmptyState } from "@/components/common/EmptyState";
import { FloatingActionButton } from "@/components/my-listings/FloatingActionButton";

// Mock data
const mockListings: Listing[] = [
  {
    id: "1",
    title: "Canon EOS R6",
    category: "מצלמות",
    location: "תל אביב",
    pricePerDay: 350,
    rating: { value: 4.8, count: 32 },
    status: "active",
    includesInsurance: true,
    isFeatured: true,
    views: 312,
    bookings: 12,
    revenue: 2340,
    thumbnailUrl: "/Cam.png",
  },
  {
    id: "2",
    title: "רחפן DJI Mini 3 Pro",
    category: "רחפנים",
    location: "תל אביב",
    pricePerDay: 280,
    rating: { value: 4.9, count: 18 },
    status: "active",
    includesInsurance: true,
    views: 245,
    bookings: 8,
    revenue: 1680,
    thumbnailUrl: "/drone.png",
  },
  {
    id: "3",
    title: "מקדחה אלחוטית Bosch",
    category: "כלים",
    location: "רמת גן",
    pricePerDay: 80,
    rating: { value: 4.6, count: 15 },
    status: "active",
    includesInsurance: false,
    views: 189,
    bookings: 15,
    revenue: 960,
    thumbnailUrl: "/drill.png",
  },
  {
    id: "4",
    title: "מיקסר DJ Pioneer DDJ-1000",
    category: "ציוד DJ",
    location: "תל אביב",
    pricePerDay: 320,
    status: "pending",
    includesInsurance: true,
    views: 98,
    bookings: 0,
    revenue: 0,
    thumbnailUrl: "/drone.png",
  },
  {
    id: "5",
    title: "סולם אלומיניום 3 מטר",
    category: "כלים",
    location: "חולון",
    pricePerDay: 45,
    rating: { value: 4.7, count: 8 },
    status: "paused",
    includesInsurance: false,
    views: 67,
    bookings: 5,
    revenue: 225,
    thumbnailUrl: "/ladder.png",
  },
  {
    id: "6",
    title: "מצלמת GoPro Hero 12",
    category: "מצלמות",
    location: "תל אביב",
    pricePerDay: 150,
    rating: { value: 4.5, count: 22 },
    status: "issues",
    includesInsurance: true,
    hasIssue: true,
    views: 203,
    bookings: 10,
    revenue: 1200,
    thumbnailUrl: "/Cam.png",
  },
];

// Mock analytics data
const mockRevenueData = [
  { month: "נוב'", revenue: 3200 },
  { month: "דצמ'", revenue: 4100 },
  { month: "ינו'", revenue: 3800 },
  { month: "פבר'", revenue: 4500 },
  { month: "מרץ", revenue: 5200 },
  { month: "אפר'", revenue: 4980 },
];

const mockBookingsData = [
  { week: "שבוע 1", bookings: 8 },
  { week: "שבוע 2", bookings: 12 },
  { week: "שבוע 3", bookings: 15 },
  { week: "שבוע 4", bookings: 10 },
  { week: "שבוע 5", bookings: 18 },
  { week: "שבוע 6", bookings: 14 },
];

export default function MyListingsPage() {
  const locale = useLocale();
  const isRTL = locale === "he";
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setListings(mockListings);
      setIsLoading(false);
    }, 800);
  }, []);

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    return {
      all: listings.length,
      active: listings.filter((l) => l.status === "active").length,
      pending: listings.filter((l) => l.status === "pending").length,
      paused: listings.filter((l) => l.status === "paused").length,
      issues: listings.filter((l) => l.status === "issues").length,
    };
  }, [listings]);

  // Filter listings based on active filter
  const filteredListings = useMemo(() => {
    switch (activeFilter) {
      case "all":
        return listings;
      case "active":
        return listings.filter((l) => l.status === "active");
      case "pending":
        return listings.filter((l) => l.status === "pending");
      case "paused":
        return listings.filter((l) => l.status === "paused");
      case "issues":
        return listings.filter((l) => l.status === "issues");
      default:
        return listings;
    }
  }, [listings, activeFilter]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const activeListings = listings.filter((l) => l.status === "active");
    const totalRevenue = activeListings.reduce((sum, l) => sum + l.revenue, 0);
    const totalBookings = activeListings.reduce((sum, l) => sum + l.bookings, 0);
    const avgOccupancy = activeListings.length > 0
      ? Math.round((totalBookings / (activeListings.length * 30)) * 100)
      : 0;
    const itemsNeedingAttention = listings.filter(
      (l) => l.status === "issues" || l.hasIssue
    ).length;

    return {
      monthlyRevenue: totalRevenue,
      monthlyBookings: totalBookings,
      averageOccupancy: avgOccupancy,
      itemsNeedingAttention,
    };
  }, [listings]);

  // Loading skeleton
  if (isLoading) {
    return (
      <main
        className="max-w-[600px] mx-auto px-4 pb-24 min-h-screen"
        dir={isRTL ? "rtl" : "ltr"}
        style={{ background: "#F4FBFB" }}
      >
        <div className="pt-6 space-y-6">
          {/* Header skeleton */}
          <div className="space-y-4">
            <div className="h-7 bg-gray-200 rounded-lg w-40 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded-full w-full animate-pulse" />
          </div>
          {/* Cards skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm p-4 space-y-3"
              >
                <div className="flex gap-3">
                  <div className="w-[90px] h-[90px] bg-gray-200 rounded-xl animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
                <div className="h-9 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="max-w-[600px] mx-auto px-4 pb-24 min-h-screen"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ background: "#F4FBFB" }}
    >
      {/* Sticky Header */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-[#F4FBFB] pt-6 pb-4 space-y-4"
        style={{ paddingTop: "24px", paddingBottom: "16px" }}
      >
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">ההשכרות שלי</h1>
          <p className="text-sm text-gray-600">נהל את הפריטים שאתה משכיר</p>
        </div>

        <Link href="/listings/new" className="block">
          <Button
            className="w-full bg-[#00A39A] hover:bg-[#008B83] text-white rounded-full h-11 text-sm font-semibold shadow-sm active:scale-95 transition-transform"
          >
            <Plus className="h-4 w-4 ml-2" />
            השכר פריט חדש
          </Button>
        </Link>
      </motion.section>

      {/* Metrics Panel */}
      <section className="mb-6">
        <MetricsPanel
          monthlyRevenue={metrics.monthlyRevenue}
          monthlyBookings={metrics.monthlyBookings}
          averageOccupancy={metrics.averageOccupancy}
          itemsNeedingAttention={metrics.itemsNeedingAttention}
          revenueData={mockRevenueData}
          bookingsData={mockBookingsData}
        />
      </section>

      {/* Status Filter Tabs */}
      <section className="mb-4">
        <StatusTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={filterCounts}
        />
      </section>

      {/* Listings List */}
      <section>
        {listings.length === 0 ? (
          <EmptyState
            title="אין לך עדיין השכרות פעילות."
            subtitle="התחל להעלות פריטים ולהרוויח מהם."
            ctaLabel="צור את ההשכרה הראשונה שלך"
            ctaHref="/listings/new"
          />
        ) : filteredListings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <Package className="h-10 w-10 mx-auto mb-3 text-gray-400" />
            <p className="text-sm text-gray-500">
              אין פריטים בקטגוריה זו כרגע.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredListings.map((listing, index) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </main>
  );
}
