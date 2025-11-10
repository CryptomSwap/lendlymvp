"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { differenceInDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { createReservedBooking } from "@/lib/actions/bookings";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { calculateDeposit } from "@/lib/utils/deposit";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils/i18n-client";
import { useEffect } from "react";

interface BookingDrawerProps {
  listingId: string;
  dailyRate: number;
  depositOverride?: number | null;
  minDays: number;
  category: string;
  ownerTrustScore: number;
  disabledDates?: { from: Date; to: Date }[];
  trigger: React.ReactNode;
}

export function BookingDrawer({
  listingId,
  dailyRate,
  depositOverride,
  minDays,
  category,
  ownerTrustScore,
  disabledDates = [],
  trigger,
}: BookingDrawerProps) {
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [insurance, setInsurance] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [depositCalc, setDepositCalc] = useState<{
    deposit: number;
    insuranceFee: number;
    itemValue: number;
  } | null>(null);
  const router = useRouter();
  const t = useTranslations("listing");

  // Stub renter trust score (in real app, get from session)
  const renterTrustScore = 50;

  // Calculate totals
  const days = dateRange?.from && dateRange?.to
    ? Math.max(differenceInDays(dateRange.to, dateRange.from), minDays)
    : 0;
  const subtotal = days * dailyRate;

  // Calculate deposit and insurance when dates change
  useEffect(() => {
    if (dateRange?.from && dateRange?.to && days > 0) {
      calculateDeposit({
        dailyRate,
        days,
        category,
        ownerTrustScore,
        renterTrustScore,
        depositOverride,
      }).then(setDepositCalc).catch(console.error);
    } else {
      setDepositCalc(null);
    }
  }, [dateRange, days, dailyRate, category, ownerTrustScore, renterTrustScore, depositOverride]);

  const insuranceCost = insurance && depositCalc ? depositCalc.insuranceFee : 0;
  const total = subtotal + insuranceCost;
  const deposit = depositCalc?.deposit || 0;

  const handleReserve = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error(t("pleaseSelectDates"));
      return;
    }

    if (days < minDays) {
      toast.error(t("minimumDays", { count: minDays }));
      return;
    }

    setIsLoading(true);
    try {
      // Get current user from session
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      
      if (!data.user) {
        toast.error("Please sign in to make a booking");
        router.push("/auth/signin");
        return;
      }
      
      const booking = await createReservedBooking(
        listingId,
        data.user.id,
        dateRange.from,
        dateRange.to,
        insurance
      );

      toast.success(t("ownerApproval"));
      setOpen(false);
      setDateRange(undefined);
      setInsurance(false);
      
      // Navigate to booking page
      router.push(`/bookings/${booking.id}`);
    } catch (error) {
      toast.error("Failed to create booking. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Disable dates that are already booked
  const isDateDisabled = (date: Date) => {
    return disabledDates.some(
      (range) => date >= range.from && date <= range.to
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("reserve")}</SheetTitle>
          <SheetDescription>
            {t("selectDates")}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Date Picker */}
          <div>
            <Label>{t("selectDates")}</Label>
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              disabled={isDateDisabled}
              numberOfMonths={1}
              className="rounded-md border mt-2"
            />
            {dateRange?.from && dateRange?.to && (
              <p className="text-sm text-muted-foreground mt-2">
                {days} {days === 1 ? t("day") : t("days")}
              </p>
            )}
          </div>

          {/* Insurance Toggle */}
          {depositCalc && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="insurance"
                checked={insurance}
                onCheckedChange={(checked) => setInsurance(checked === true)}
              />
              <Label htmlFor="insurance" className="cursor-pointer">
                {t("addInsurance")} ({formatCurrency(depositCalc.insuranceFee)})
              </Label>
            </div>
          )}

          {/* Pricing Breakdown */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("dailyRate")}</span>
              <span>{formatCurrency(dailyRate)}{t("perDay")}</span>
            </div>
            {days > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {days} {days === 1 ? t("day") : t("days")}
                  </span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {depositCalc && (
                  <>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{t("itemValue")}</span>
                      <span>{formatCurrency(depositCalc.itemValue)}</span>
                    </div>
                    {insurance && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("insurance")}</span>
                        <span>{formatCurrency(insuranceCost)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-semibold border-t pt-2">
                      <span>{t("total")}</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground border-t pt-2">
                      <span>{t("securityDeposit")}</span>
                      <span>{formatCurrency(deposit)}</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Reserve Button */}
          <Button
            onClick={handleReserve}
            disabled={!dateRange?.from || !dateRange?.to || isLoading || days < minDays}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              t("reserveNow")
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            {t("ownerApproval")}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

