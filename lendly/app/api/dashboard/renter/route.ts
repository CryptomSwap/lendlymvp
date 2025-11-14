import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Get all bookings for this renter
    const allBookings = await prisma.booking.findMany({
      where: { renterId: user.id },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            photos: true,
            dailyRate: true,
          },
        },
      },
      orderBy: { startDate: "desc" },
    });

    // Categorize bookings
    const upcoming = allBookings.filter(
      (b) => (b.status === "RESERVED" || b.status === "CONFIRMED") && new Date(b.startDate) > now
    );
    const active = allBookings.filter(
      (b) =>
        b.status === "CONFIRMED" &&
        new Date(b.startDate) <= now &&
        new Date(b.endDate) >= now
    );
    const history = allBookings.filter(
      (b) => b.status === "COMPLETED" || b.status === "CANCELLED" || b.status === "DISPUTED"
    );

    return NextResponse.json({
      upcoming: upcoming.map((b) => ({
        id: b.id,
        listing: b.listing,
        startDate: b.startDate.toISOString(),
        endDate: b.endDate.toISOString(),
        status: b.status,
      })),
      active: active.map((b) => ({
        id: b.id,
        listing: b.listing,
        startDate: b.startDate.toISOString(),
        endDate: b.endDate.toISOString(),
        status: b.status,
      })),
      history: history.map((b) => ({
        id: b.id,
        listing: b.listing,
        startDate: b.startDate.toISOString(),
        endDate: b.endDate.toISOString(),
        status: b.status,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching renter dashboard:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch data" },
      { status: 500 }
    );
  }
}

