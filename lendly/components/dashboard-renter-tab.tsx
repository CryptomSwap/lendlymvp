"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, Calendar, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface Booking {
  id: string;
  listing: {
    id: string;
    title: string;
    photos: string;
    dailyRate: number;
  };
  startDate: string;
  endDate: string;
  status: string;
}

export function RenterTab() {
  const t = useTranslations("dashboard.renter");
  const [bookings, setBookings] = useState<{
    upcoming: Booking[];
    active: Booking[];
    history: Booking[];
  }>({ upcoming: [], active: [], history: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/dashboard/renter");
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      RESERVED: { label: t("status.reserved"), variant: "secondary" },
      CONFIRMED: { label: t("status.confirmed"), variant: "default" },
      COMPLETED: { label: t("status.completed"), variant: "outline" },
      DISPUTED: { label: t("status.disputed"), variant: "destructive" },
      CANCELLED: { label: t("status.cancelled"), variant: "outline" },
    };
    const statusInfo = statusMap[status] || { label: status, variant: "outline" };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const photos = JSON.parse(booking.listing.photos || "[]");
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {photos[0] && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={photos[0]}
                  alt={booking.listing.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold truncate">{booking.listing.title}</h3>
                {getStatusBadge(booking.status)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(booking.startDate), "PP")} - {format(new Date(booking.endDate), "PP")}
                </span>
              </div>
              <div className="flex gap-2">
                <Link href={`/messages?booking=${booking.id}`}>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t("actions.chat")}
                  </Button>
                </Link>
                <Link href={`/bookings/${booking.id}`}>
                  <Button variant="outline" size="sm">
                    {t("actions.details")}
                  </Button>
                </Link>
                {(booking.status === "RESERVED" || booking.status === "CONFIRMED") && (
                  <Button variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    {t("actions.cancel")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Skeleton className="w-24 h-24 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Upcoming */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{t("sections.upcoming")}</h2>
        {bookings.upcoming.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">{t("empty.upcoming")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.upcoming.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>

      {/* Active */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{t("sections.active")}</h2>
        {bookings.active.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">{t("empty.active")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.active.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>

      {/* History */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{t("sections.history")}</h2>
        {bookings.history.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">{t("empty.history")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.history.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

