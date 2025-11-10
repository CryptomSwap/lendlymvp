import { NextResponse } from "next/server";
import { expireBookings } from "@/lib/actions/bookings";

export async function GET(request: Request) {
  try {
    // In production, add authentication/authorization check here
    // For example, check for a secret token in headers
    
    const result = await expireBookings();
    
    return NextResponse.json({
      success: true,
      expiredCount: result.count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in expire-bookings cron:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to expire bookings",
      },
      { status: 500 }
    );
  }
}

// Also support POST for flexibility
export async function POST(request: Request) {
  return GET(request);
}

