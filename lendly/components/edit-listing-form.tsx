"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PhotoUpload } from "@/components/photo-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateListing } from "@/lib/actions/listings";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const categories = [
  "Cameras",
  "Drones",
  "Tools",
  "DJ gear",
  "Camping",
];

interface EditListingFormProps {
  listing: any;
}

export function EditListingForm({ listing }: EditListingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: listing.title,
    description: listing.description,
    category: listing.category,
    dailyRate: listing.dailyRate.toString(),
    depositOverride: listing.depositOverride?.toString() || "",
    minDays: listing.minDays.toString(),
    photos: JSON.parse(listing.photos || "[]") as string[],
    locationText: listing.locationText,
    instantBook: listing.instantBook,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      // In a real app, get from session
      const ownerId = "stub-user-id";

      await updateListing(listing.id, ownerId, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        dailyRate: parseFloat(formData.dailyRate),
        depositOverride: formData.depositOverride ? parseFloat(formData.depositOverride) : null,
        minDays: parseInt(formData.minDays),
        photos: formData.photos,
        locationText: formData.locationText,
        instantBook: formData.instantBook,
      });

      toast.success("Listing updated successfully!");
      router.push("/listings");
    } catch (error) {
      toast.error("Failed to update listing");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-2 min-h-[150px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <PhotoUpload
            photos={formData.photos}
            onChange={(photos) => setFormData({ ...formData, photos })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing & Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dailyRate">Daily Rate (₪) *</Label>
              <Input
                id="dailyRate"
                type="number"
                min="0"
                step="0.01"
                value={formData.dailyRate}
                onChange={(e) =>
                  setFormData({ ...formData, dailyRate: e.target.value })
                }
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="minDays">Minimum Days *</Label>
              <Input
                id="minDays"
                type="number"
                min="1"
                value={formData.minDays}
                onChange={(e) =>
                  setFormData({ ...formData, minDays: e.target.value })
                }
                className="mt-2"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="depositOverride">Deposit Override (₪)</Label>
            <Input
              id="depositOverride"
              type="number"
              min="0"
              step="0.01"
              value={formData.depositOverride}
              onChange={(e) =>
                setFormData({ ...formData, depositOverride: e.target.value })
              }
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="locationText">Pickup Location *</Label>
            <Textarea
              id="locationText"
              value={formData.locationText}
              onChange={(e) =>
                setFormData({ ...formData, locationText: e.target.value })
              }
              className="mt-2 min-h-[100px]"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="instantBook"
              checked={formData.instantBook}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, instantBook: checked === true })
              }
            />
            <Label htmlFor="instantBook" className="cursor-pointer">
              Enable instant booking
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/listings")}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1" size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}

