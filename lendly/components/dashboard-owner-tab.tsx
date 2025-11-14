"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pause, Play, Edit, Share2, Check, X, Package } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "@/i18n/routing";
import { Skeleton } from "@/components/ui/skeleton";

interface Listing {
  id: string;
  title: string;
  dailyRate: number;
  status: string;
  photos: string;
  nextBooking?: {
    id: string;
    startDate: string;
    renter: { name: string };
  };
}

interface BookingRequest {
  id: string;
  listing: { title: string; photos: string };
  renter: { name: string; trustScore: number };
  startDate: string;
  endDate: string;
  status: string;
}

export function OwnerTab() {
  const t = useTranslations("dashboard.owner");
  const locale = useLocale();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/dashboard/owner");
      const data = await res.json();
      setListings(data.listings || []);
      setRequests(data.requests || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseResume = async (listingId: string, currentStatus: string) => {
    // TODO: Implement pause/resume
    console.log("Pause/Resume", listingId, currentStatus);
  };

  const handleApprove = async (bookingId: string) => {
    // TODO: Implement approve
    console.log("Approve", bookingId);
  };

  const handleDecline = async (bookingId: string) => {
    // TODO: Implement decline
    console.log("Decline", bookingId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8" dir={locale === "he" ? "rtl" : "ltr"}>
      {/* Header with CTA */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{t("myListings")}</h2>
        <Button onClick={() => router.push("/listings/new")}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addListing")}
        </Button>
      </div>

      {/* Listings */}
      <section>
        {listings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">{t("empty.listings")}</p>
              <Button onClick={() => router.push("/listings/new")}>
                <Plus className="h-4 w-4 mr-2" />
                {t("addListing")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => {
              const photos = JSON.parse(listing.photos || "[]");
              const statusColors: Record<string, string> = {
                APPROVED: "bg-green-100 text-green-800",
                PENDING: "bg-yellow-100 text-yellow-800",
                PAUSED: "bg-gray-100 text-gray-800",
                REJECTED: "bg-red-100 text-red-800",
              };
              return (
                <Card key={listing.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{listing.title}</CardTitle>
                        <CardDescription className="mt-1">
                          ₪{listing.dailyRate}/day
                        </CardDescription>
                      </div>
                      <Badge className={statusColors[listing.status] || ""}>
                        {listing.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {photos[0] && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden mb-4">
                        <Image
                          src={photos[0]}
                          alt={listing.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    {listing.nextBooking && (
                      <div className="text-sm text-muted-foreground mb-4">
                        {t("nextBooking")}: {format(new Date(listing.nextBooking.startDate), "PP")}
                      </div>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePauseResume(listing.id, listing.status)}
                      >
                        {listing.status === "PAUSED" ? (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            {t("actions.resume")}
                          </>
                        ) : (
                          <>
                            <Pause className="h-4 w-4 mr-1" />
                            {t("actions.pause")}
                          </>
                        )}
                      </Button>
                      <Link href={`/listings/${listing.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          {t("actions.edit")}
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        {t("actions.share")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Booking Requests */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{t("bookingRequests")}</h2>
        {requests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">{t("empty.requests")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const photos = JSON.parse(request.listing.photos || "[]");
              return (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {photos[0] && (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={photos[0]}
                            alt={request.listing.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{request.listing.title}</h3>
                        <div className="space-y-1 text-sm text-muted-foreground mb-4">
                          <p>
                            {t("from")}: {request.renter.name} (Trust: {request.renter.trustScore})
                          </p>
                          <p>
                            {format(new Date(request.startDate), "PP")} - {format(new Date(request.endDate), "PP")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            {t("actions.approve")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDecline(request.id)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            {t("actions.decline")}
                          </Button>
                          <Link href={`/messages?booking=${request.id}`}>
                            <Button variant="outline" size="sm">
                              {t("actions.reply")}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

