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

    // Get user's listings
    const listings = await prisma.listings.findMany({
      where: { ownerId: user.id },
      include: {
        bookings: {
          where: {
            status: { in: ["RESERVED", "CONFIRMED"] },
            startDate: { gte: new Date() },
          },
          orderBy: { startDate: "asc" },
          take: 1,
          include: {
            renter: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get pending booking requests
    const requests = await prisma.booking.findMany({
      where: {
        listing: { ownerId: user.id },
        status: "RESERVED",
      },
      include: {
        listing: {
          select: {
            title: true,
            photos: true,
          },
        },
        renter: {
          select: {
            name: true,
            trustScore: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      listings: listings.map((l) => ({
        id: l.id,
        title: l.title,
        dailyRate: l.pricePerDay,
        status: l.status,
        photos: l.photos,
        ratingAvg: l.ratingAvg,
        ratingCount: l.ratingCount,
        category: l.category,
        issueCount: 0, // TODO: Calculate from actual issues when issue tracking is implemented
        nextBooking: l.bookings[0]
          ? {
              id: l.bookings[0].id,
              startDate: l.bookings[0].startDate.toISOString(),
              renter: l.bookings[0].renter,
            }
          : undefined,
      })),
      requests: requests.map((r) => ({
        id: r.id,
        listing: r.listing,
        renter: r.renter,
        startDate: r.startDate.toISOString(),
        endDate: r.endDate.toISOString(),
        status: r.status,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching owner dashboard:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch data" },
      { status: 500 }
    );
  }
}

