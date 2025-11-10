"use client";

import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

interface AvailabilityCalendarProps {
  bookedDates: { from: Date; to: Date }[];
  minDays: number;
}

export function AvailabilityCalendar({ bookedDates, minDays }: AvailabilityCalendarProps) {
  // Convert booked dates to Date objects if they're strings
  const disabledDates = bookedDates.map((range) => ({
    from: range.from instanceof Date ? range.from : new Date(range.from),
    to: range.to instanceof Date ? range.to : new Date(range.to),
  }));

  const isDateDisabled = (date: Date) => {
    return disabledDates.some(
      (range) => date >= range.from && date <= range.to
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

