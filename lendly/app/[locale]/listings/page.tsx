import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { Plus, Edit, Calendar, Star } from "lucide-react";
import { getListingsByOwner } from "@/lib/actions/listings";
import Image from "next/image";
import { format } from "date-fns";
import { ListingAvailability } from "@/components/listing-availability";

export default async function ListingsPage() {
  // In a real app, get from session
  const userId = "stub-user-id";
  const listings = await getListingsByOwner(userId);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-h1">My Listings</h1>
        <Link href="/listings/new">
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Create Listing
          </Button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No listings yet</p>
            <Link href="/listings/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Listing
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {listings.map((listing: any) => {
            const photos = JSON.parse(listing.photos || "[]");
            const mainPhoto = photos[0] || "/placeholder-listing.jpg";

            return (
              <Card key={listing.id} className="overflow-hidden">
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Photo */}
                  <div className="relative aspect-square md:aspect-auto md:h-full">
                    <Image
                      src={mainPhoto}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  {/* Details */}
                  <div className="md:col-span-2 p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-h3 mb-2">{listing.title}</h2>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary">{listing.category}</Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span className="text-sm font-medium">
                              {listing.ratingAvg.toFixed(1)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({listing.ratingCount})
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link href={`/listings/${listing.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Daily Rate</p>
                        <p className="font-semibold">₪{listing.dailyRate}/day</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Min. Days</p>
                        <p className="font-semibold">{listing.minDays}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-semibold">{listing.locationText}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <Badge
                          variant={listing.instantBook ? "default" : "outline"}
                        >
                          {listing.instantBook ? "Instant Book" : "Approval Required"}
                        </Badge>
                      </div>
                    </div>

                    {/* Active Bookings */}
                    {listing.bookings.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Active Bookings</p>
                        <div className="space-y-1">
                          {listing.bookings.map((booking: any) => (
                            <div
                              key={booking.id}
                              className="text-sm text-muted-foreground"
                            >
                              {format(new Date(booking.startDate), "MMM d")} -{" "}
                              {format(new Date(booking.endDate), "MMM d")} (
                              {booking.status})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Availability Calendar */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4" />
                        <p className="text-sm font-medium">Availability</p>
                      </div>
                      <ListingAvailability
                        listingId={listing.id}
                        bookings={listing.bookings}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

