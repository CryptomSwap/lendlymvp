"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, CheckCircle2, XCircle, Package, ArrowRight, Star } from "lucide-react";
import { format } from "date-fns";
import { approveBooking, declineBooking } from "@/lib/actions/bookings";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { Loader2 } from "lucide-react";
import { PickupChecklistModal } from "@/components/pickup-checklist-modal";
import { ReturnChecklistModal } from "@/components/return-checklist-modal";
import { BookingTimeline } from "@/components/booking-timeline";
import { ReviewModal } from "@/components/review-modal";
import { canUserReview, getReviewForBooking } from "@/lib/actions/reviews";

interface BookingDetailProps {
  booking: any;
  canReview?: boolean;
  otherPartyId?: string;
  otherPartyName?: string;
}

export function BookingDetail({ booking, canReview = false, otherPartyId, otherPartyName }: BookingDetailProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [pickupModalOpen, setPickupModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUserId(data.user.id);
        }
      })
      .catch(console.error);
  }, []);

  const isOwner = currentUserId ? booking.listing.ownerId === currentUserId : false;
  const isRenter = currentUserId ? booking.renterId === currentUserId : false;
  const canApprove = isOwner && booking.status === "RESERVED";
  
  // Check if pickup/return checklists exist
  const hasPickupChecklist = booking.checklists?.some((c: any) => c.phase === "PICKUP");
  const hasReturnChecklist = booking.checklists?.some((c: any) => c.phase === "RETURN");
  const canMarkPickup = isOwner && booking.status === "CONFIRMED" && !hasPickupChecklist;
  const canMarkReturn = isOwner && booking.status === "CONFIRMED" && hasPickupChecklist && !hasReturnChecklist;

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await approveBooking(booking.id, currentUserId);
      toast.success("Booking approved!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to approve booking");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    try {
      await declineBooking(booking.id, currentUserId);
      toast.success("Booking declined");
      router.refresh();
    } catch (error) {
      toast.error("Failed to decline booking");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      DRAFT: { label: "Draft", variant: "outline" },
      RESERVED: { label: "Reserved", variant: "secondary" },
      CONFIRMED: { label: "Confirmed", variant: "default" },
      COMPLETED: { label: "Completed", variant: "default" },
      CANCELLED: { label: "Cancelled", variant: "destructive" },
      DISPUTED: { label: "Disputed", variant: "destructive" },
    };

    const status = statusMap[booking.status] || statusMap.DRAFT;
    return <Badge variant={status.variant}>{status.label}</Badge>;
  };

  const days = Math.ceil(
    (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const subtotal = booking.listing.dailyRate * days;
  // Calculate insurance fee based on item value (dailyRate * 20)
  const itemValue = booking.listing.dailyRate * 20;
  // Insurance is 10% of item value with minimum 50 (default settings)
  // In production, this would come from admin settings
  const insurancePercentage = 10;
  const insuranceMinimum = 50;
  const insuranceFee = booking.insuranceAdded 
    ? Math.max((itemValue * insurancePercentage) / 100, insuranceMinimum)
    : 0;
  const total = subtotal + insuranceFee;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-h1">Booking Details</h1>
        {getStatusBadge()}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Rental Period
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Start:</span>
            <span className="font-medium">
              {format(new Date(booking.startDate), "PPP")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">End:</span>
            <span className="font-medium">
              {format(new Date(booking.endDate), "PPP")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Duration:</span>
            <span className="font-medium">{days} {days === 1 ? "day" : "days"}</span>
          </div>
          {booking.expiresAt && booking.status === "RESERVED" && (
            <div className="flex items-center gap-2 text-warning">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                Expires: {format(new Date(booking.expiresAt), "PPp")}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Item
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-1">{booking.listing.title}</h3>
          <p className="text-sm text-muted-foreground">{booking.listing.locationText}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {isOwner ? "Renter" : "Owner"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium">
            {isOwner ? booking.renter.name : booking.listing.owner.name}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Daily rate</span>
            <span>₪{booking.listing.dailyRate}/day</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {days} {days === 1 ? "day" : "days"}
            </span>
            <span>₪{subtotal.toFixed(2)}</span>
          </div>
          {booking.insuranceAdded && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Insurance</span>
              <span>₪{insuranceFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total</span>
            <span>₪{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground border-t pt-2">
            <span>Security deposit (refundable)</span>
            <span>₪{booking.depositRequired.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {canApprove && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                onClick={handleApprove}
                disabled={isLoading}
                className="flex-1"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve
                  </>
                )}
              </Button>
              <Button
                onClick={handleDecline}
                disabled={isLoading}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Decline
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pickup/Return Actions */}
      {canMarkPickup && (
        <Card>
          <CardHeader>
            <CardTitle>Pickup</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setPickupModalOpen(true)}
              className="w-full"
              size="lg"
            >
              <Package className="mr-2 h-4 w-4" />
              Mark as Picked Up
            </Button>
          </CardContent>
        </Card>
      )}

      {canMarkReturn && (
        <Card>
          <CardHeader>
            <CardTitle>Return</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setReturnModalOpen(true)}
              className="w-full"
              size="lg"
              variant="outline"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Mark as Returned
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Review Prompt */}
      {canReview && otherPartyId && otherPartyName && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              How was your experience with {otherPartyName}?
            </p>
            <Button
              onClick={() => setReviewModalOpen(true)}
              className="w-full"
              size="lg"
            >
              <Star className="mr-2 h-4 w-4" />
              Rate & Review
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Booking Timeline */}
      <BookingTimeline booking={booking} />

      {/* Modals */}
      {currentUserId && (
        <>
          <PickupChecklistModal
            open={pickupModalOpen}
            onOpenChange={setPickupModalOpen}
            bookingId={booking.id}
            ownerId={currentUserId}
            onSuccess={() => router.refresh()}
          />
          <ReturnChecklistModal
            open={returnModalOpen}
            onOpenChange={setReturnModalOpen}
            bookingId={booking.id}
            ownerId={currentUserId}
            onSuccess={() => router.refresh()}
          />
          {canReview && otherPartyId && otherPartyName && (
            <ReviewModal
              open={reviewModalOpen}
              onOpenChange={setReviewModalOpen}
              bookingId={booking.id}
              fromUserId={currentUserId}
              toUserId={otherPartyId}
              toUserName={otherPartyName}
              onSuccess={() => router.refresh()}
            />
          )}
        </>
      )}
    </div>
  );
}

