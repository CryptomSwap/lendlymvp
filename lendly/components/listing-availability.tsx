"use client";

import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

interface ListingAvailabilityProps {
  listingId: string;
  bookings: { startDate: Date | string; endDate: Date | string }[];
}

export function ListingAvailability({ listingId, bookings }: ListingAvailabilityProps) {
  // Convert booked dates to Date objects
  const bookedDates = bookings.map((booking) => ({
    from: booking.startDate instanceof Date ? booking.startDate : new Date(booking.startDate),
    to: booking.endDate instanceof Date ? booking.endDate : new Date(booking.endDate),
  }));

  // Get all booked dates as individual dates for calendar
  const disabledDates: Date[] = [];
  bookedDates.forEach((range) => {
    let current = new Date(range.from);
    while (current <= range.to) {
      disabledDates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  });

  const isDateDisabled = (date: Date) => {
    return disabledDates.some(
      (disabledDate) =>
        date.getDate() === disabledDate.getDate() &&
        date.getMonth() === disabledDate.getMonth() &&
        date.getFullYear() === disabledDate.getFullYear()
    );
  };

  return (
    <Calendar
      mode="multiple"
      disabled={isDateDisabled}
      className="rounded-md border"
      numberOfMonths={1}
    />
  );
}

