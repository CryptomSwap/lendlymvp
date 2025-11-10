import { notFound } from "next/navigation";
import { getListingById } from "@/lib/actions/listings";
import { PhotosCarousel } from "@/components/photos-carousel";
import { OwnerCard } from "@/components/owner-card";
import { BookingDrawer } from "@/components/booking-drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar } from "lucide-react";
import { ChatButton } from "@/components/chat-button";
import { AvailabilityCalendar } from "@/components/availability-calendar";

interface ListingPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  const photos = JSON.parse(listing.photos || "[]");
  
  // Get booked date ranges for calendar
  const bookedDates = listing.bookings.map((booking) => ({
    from: booking.startDate instanceof Date ? booking.startDate : new Date(booking.startDate),
    to: booking.endDate instanceof Date ? booking.endDate : new Date(booking.endDate),
  }));

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
      {/* Photos Carousel */}
      <PhotosCarousel photos={photos} title={listing.title} />

      {/* Title and Basic Info */}
      <div>
        <h1 className="text-h1 mb-2">{listing.title}</h1>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="font-medium">{listing.ratingAvg.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({listing.ratingCount} reviews)
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{listing.locationText}</span>
          </div>
          <Badge variant="secondary">{listing.category}</Badge>
        </div>
      </div>

      {/* Price and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold text-primary">
                ₪{listing.dailyRate}
                <span className="text-base font-normal text-muted-foreground">/day</span>
              </p>
              {listing.depositOverride && (
                <p className="text-sm text-muted-foreground">
                  Deposit: ₪{listing.depositOverride}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
                <BookingDrawer
                  listingId={listing.id}
                  dailyRate={listing.dailyRate}
                  depositOverride={listing.depositOverride}
                  minDays={listing.minDays}
                  category={listing.category}
                  ownerTrustScore={listing.owner.trustScore}
                  disabledDates={bookedDates}
                  trigger={
                    <Button className="flex-1" size="lg">
                      Reserve
                    </Button>
                  }
                />
            <ChatButton
              listingId={listing.id}
              ownerId={listing.ownerId}
              ownerName={listing.owner.name}
            />
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body whitespace-pre-line">{listing.description}</p>
        </CardContent>
      </Card>

      {/* Owner Card */}
      <OwnerCard owner={listing.owner} />

      {/* Availability Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AvailabilityCalendar
            bookedDates={bookedDates}
            minDays={listing.minDays}
          />
        </CardContent>
      </Card>

      {/* Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-64 bg-muted rounded-lg flex items-center justify-center">
            {listing.lat && listing.lng ? (
              <p className="text-muted-foreground">
                Map placeholder - Coordinates: {listing.lat.toFixed(4)}, {listing.lng.toFixed(4)}
              </p>
            ) : (
              <p className="text-muted-foreground">{listing.locationText}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

