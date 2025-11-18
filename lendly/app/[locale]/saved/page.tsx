import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { ListingCard } from "@/components/listing-card";
import { Heart } from "lucide-react";

export default async function SavedPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth/signin");
  }

  // TODO: Implement saved listings fetch from database
  const savedListings: any[] = [];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
      <h1 className="text-h1">Saved</h1>

      {savedListings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-2">No saved items yet</p>
            <p className="text-sm text-muted-foreground">
              Items you save will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {savedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} fullWidth />
          ))}
        </div>
      )}
    </div>
  );
}

