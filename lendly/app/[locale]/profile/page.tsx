import { getMyProfile } from "@/lib/actions/users";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/i18n/routing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, CheckCircle2, XCircle } from "lucide-react";
import { ProfileForm } from "@/components/profile-form";
import { ListingCard } from "@/components/listing-card";
import { Link } from "@/i18n/routing";
import { format } from "date-fns";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth/signin");
  }

  const profile = await getMyProfile();

  if (!profile) {
    return <div>Error loading profile</div>;
  }

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
      <h1 className="text-h1">My Profile</h1>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar || undefined} alt={profile.name} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-h2">{profile.name}</h2>
                <Badge variant={profile.role === "admin" ? "default" : "outline"}>
                  {profile.role}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{profile.email}</p>
              {profile.bio && (
                <p className="text-body text-muted-foreground mb-3">{profile.bio}</p>
              )}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    Trust Score: {profile.trustScore}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {profile.role === "admin" ? (
                      <CheckCircle2 className="h-3 w-3 text-success" />
                    ) : (
                      <XCircle className="h-3 w-3 text-muted-foreground" />
                    )}
                    {profile.role === "admin" ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Form */}
      <ProfileForm user={profile} />

      {/* My Listings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Listings</CardTitle>
              <CardDescription>
                {profile.listingsAsOwner.length} listing(s)
              </CardDescription>
            </div>
            <Link href="/listings/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                List Your Gear
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {profile.listingsAsOwner.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                You haven't listed any items yet
              </p>
              <Link href="/listings/new">
                <Button size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  List Your First Item
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {profile.listingsAsOwner.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews Received</CardTitle>
          <CardDescription>
            {profile.reviewsReceived.length} review(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile.reviewsReceived.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {profile.reviewsReceived.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={review.fromUser.avatar || undefined}
                          alt={review.fromUser.name}
                        />
                        <AvatarFallback>
                          {review.fromUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{review.fromUser.name}</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "fill-warning text-warning"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.listing && (
                          <p className="text-sm text-muted-foreground mb-2">
                            For: {review.listing.title}
                          </p>
                        )}
                        {review.text && (
                          <p className="text-sm">{review.text}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(new Date(review.createdAt), "PP")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
