"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MapPin, Phone, Shield } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { Loader2 } from "lucide-react";

export default function ProfileSetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    pickupLocation: "",
  });
  const router = useRouter();

  const handleVerifyId = async () => {
    setIsLoading(true);
    // Simulate ID verification
    setTimeout(() => {
      setIsVerified(true);
      setIsLoading(false);
      toast.success("ID verified successfully!");
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isVerified) {
      toast.error("Please verify your ID first");
      return;
    }

    if (!formData.phone || !formData.pickupLocation) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    
    // In a real app, save to database
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profile setup completed!");
      router.push("/profile");
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
      <div>
        <h1 className="text-h1 mb-2">Complete Your Profile</h1>
        <p className="text-muted-foreground">
          Set up your profile to start listing items
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ID Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Identity Verification
            </CardTitle>
            <CardDescription>
              Verify your identity to build trust with renters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isVerified ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Upload a photo of your government-issued ID (driver's license, passport, etc.)
                </p>
                <Button
                  type="button"
                  onClick={handleVerifyId}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify ID"
                  )}
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2 p-4 bg-success/10 rounded-lg border border-success/20">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium text-success">ID Verified</p>
                  <p className="text-sm text-muted-foreground">
                    Your identity has been verified
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Phone Number */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Phone Number
            </CardTitle>
            <CardDescription>
              Renters will use this to contact you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+972-50-123-4567"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="mt-2"
              required
            />
          </CardContent>
        </Card>

        {/* Pickup Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Pickup Location
            </CardTitle>
            <CardDescription>
              Where renters will pick up items (can be changed per listing)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="pickupLocation">Default Pickup Location *</Label>
            <Textarea
              id="pickupLocation"
              placeholder="Enter your address or pickup location details"
              value={formData.pickupLocation}
              onChange={(e) =>
                setFormData({ ...formData, pickupLocation: e.target.value })
              }
              className="mt-2 min-h-[100px]"
              required
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading || !isVerified}
            size="lg"
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Complete Setup"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

