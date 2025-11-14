"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PhotoUpload } from "@/components/photo-upload";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createListing } from "@/lib/actions/listings";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { DateRange } from "react-day-picker";
import { useTranslations } from "next-intl";
import { ListItemStepBasicInfo } from "@/components/list-item-step-basic-info";

export default function CreateListingPage() {
  const router = useRouter();
  const t = useTranslations("createListing");
  const tCommon = useTranslations("common");
  
  const categories = [
    { value: "Cameras", label: tCommon("cameras") },
    { value: "Drones", label: tCommon("drones") },
    { value: "Tools", label: tCommon("tools") },
    { value: "DJ gear", label: tCommon("djGear") },
    { value: "Camping", label: tCommon("camping") },
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: [] as string[],
    dailyRate: "",
    depositOverride: "",
    minDays: "1",
    photos: [] as string[],
    locationText: "",
    lat: null as number | null,
    lng: null as number | null,
    instantBook: false,
    blockedDates: [] as { from: Date; to: Date }[],
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.category || !formData.dailyRate || !formData.locationText) {
      toast.error(t("errors.fillRequiredFields"));
      return;
    }

    if (formData.photos.length === 0) {
      toast.error(t("errors.uploadPhoto"));
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, get from session
      const ownerId = "stub-user-id";

      await createListing({
        ownerId,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        dailyRate: parseFloat(formData.dailyRate),
        depositOverride: formData.depositOverride ? parseFloat(formData.depositOverride) : null,
        minDays: parseInt(formData.minDays),
        photos: formData.photos,
        locationText: formData.locationText,
        lat: formData.lat,
        lng: formData.lng,
        instantBook: formData.instantBook,
      });

      toast.success(t("success.created"));
      router.push("/listings");
    } catch (error) {
      toast.error(t("errors.createFailed"));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // If step 1, render the new modern component
  if (currentStep === 1) {
    return (
      <ListItemStepBasicInfo
        formData={{
          title: formData.title,
          description: formData.description,
          category: formData.category,
          tags: formData.tags,
        }}
        onUpdate={(data) => setFormData({ ...formData, ...data })}
        onNext={handleNext}
        onSaveDraft={() => {
          // Placeholder for save draft functionality
          toast.success("טיוטה נשמרה");
        }}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <Link href="/listings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-h1">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("step", { current: currentStep, total: totalSteps })}
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`
              flex-1 h-2 rounded-full transition-colors
              ${step <= currentStep ? "bg-primary" : "bg-muted"}
            `}
          />
        ))}
      </div>

      {/* Step 2: Photos */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("steps.photos.title")}</CardTitle>
            <CardDescription>{t("steps.photos.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <PhotoUpload
              photos={formData.photos}
              onChange={(photos) => setFormData({ ...formData, photos })}
            />
          </CardContent>
        </Card>
      )}

      {/* Step 3: Pricing & Location */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("steps.pricing.title")}</CardTitle>
            <CardDescription>{t("steps.pricing.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dailyRate">{t("steps.pricing.dailyRateLabel")}</Label>
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
                <Label htmlFor="minDays">{t("steps.pricing.minDaysLabel")}</Label>
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
              <Label htmlFor="depositOverride">{t("steps.pricing.depositOverrideLabel")}</Label>
              <Input
                id="depositOverride"
                type="number"
                min="0"
                step="0.01"
                value={formData.depositOverride}
                onChange={(e) =>
                  setFormData({ ...formData, depositOverride: e.target.value })
                }
                placeholder={t("steps.pricing.depositOverridePlaceholder")}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t("steps.pricing.depositOverrideHelper")}
              </p>
            </div>

            <div>
              <Label htmlFor="locationText">{t("steps.pricing.locationLabel")}</Label>
              <Textarea
                id="locationText"
                value={formData.locationText}
                onChange={(e) =>
                  setFormData({ ...formData, locationText: e.target.value })
                }
                placeholder={t("steps.pricing.locationPlaceholder")}
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
                {t("steps.pricing.instantBookLabel")}
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Availability */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("steps.availability.title")}</CardTitle>
            <CardDescription>{t("steps.availability.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="multiple"
              selected={formData.blockedDates.flatMap((range) => {
                const dates: Date[] = [];
                let current = new Date(range.from);
                while (current <= range.to) {
                  dates.push(new Date(current));
                  current.setDate(current.getDate() + 1);
                }
                return dates;
              })}
              onSelect={(dates) => {
                // Convert selected dates to ranges (simplified)
                // In production, you'd want a better date range picker
                if (dates && dates.length > 0) {
                  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
                  // For now, just store as individual dates
                  // This is a simplified version
                }
              }}
              className="rounded-md border"
            />
            <p className="text-sm text-muted-foreground mt-4">
              {t("steps.availability.note")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        {currentStep > 1 && (
          <Button variant="outline" onClick={handleBack} className="flex-1">
            {tCommon("previous")}
          </Button>
        )}
        {currentStep < totalSteps ? (
          <Button onClick={handleNext} className="flex-1">
            {tCommon("next")}
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("creating")}
              </>
            ) : (
              t("createButton")
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

