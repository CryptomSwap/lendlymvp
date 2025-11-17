"use server";

import { BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { calculateDeposit as calculateDepositUtil } from "@/lib/utils/deposit";
import { getCurrentUser } from "@/lib/auth";

export async function createReservedBooking(
  listingId: string,
  renterId: string,
  startDate: Date,
  endDate: Date,
  insuranceAdded: boolean = false
) {
  try {
    // Calculate days
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Get listing and renter to calculate deposit
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { 
        pricePerDay: true, 
        deposit: true,
        ownerId: true,
        category: true,
        owner: {
          select: {
            trustScore: true,
          },
        },
      },
    });

    if (!listing) {
      throw new Error("Listing not found");
    }

    // Get renter's trust score
    const renter = await prisma.user.findUnique({
      where: { id: renterId },
      select: { trustScore: true },
    });

    // Calculate deposit using new algorithm
    const depositResult = await calculateDepositUtil({
      dailyRate: listing.pricePerDay,
      days,
      category: listing.category,
      ownerTrustScore: listing.owner.trustScore,
      renterTrustScore: renter?.trustScore || 50,
      depositOverride: listing.deposit,
    });

    const depositAmount = depositResult.deposit;

    // Set expiration to 12 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 12);

    const booking = await prisma.booking.create({
      data: {
        listingId,
        renterId,
        startDate,
        endDate,
        status: BookingStatus.RESERVED,
        deposit: depositAmount,
        insurance: insuranceAdded,
        expiresAt,
      },
      include: {
        listing: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        renter: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Notify owner (stub - in production would send email/push notification)
    await notifyOwner(booking.id);

    return booking;
  } catch (error) {
    console.error("Error creating reserved booking:", error);
    throw error;
  }
}

export async function createDraftBooking(
  listingId: string,
  renterId: string,
  startDate: Date,
  endDate: Date,
  insuranceAdded: boolean = false
) {
  try {
    // Calculate days
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Get listing and renter to calculate deposit
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { 
        pricePerDay: true, 
        deposit: true,
        category: true,
        owner: {
          select: {
            trustScore: true,
          },
        },
      },
    });

    if (!listing) {
      throw new Error("Listing not found");
    }

    // Get renter's trust score
    const renter = await prisma.user.findUnique({
      where: { id: renterId },
      select: { trustScore: true },
    });

    // Calculate deposit using new algorithm
    const depositResult = await calculateDepositUtil({
      dailyRate: listing.pricePerDay,
      days,
      category: listing.category,
      ownerTrustScore: listing.owner.trustScore,
      renterTrustScore: renter?.trustScore || 50,
      depositOverride: listing.deposit,
    });

    const depositAmount = depositResult.deposit;

    // Set expiration to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const booking = await prisma.booking.create({
      data: {
        listingId,
        renterId,
        startDate,
        endDate,
        status: BookingStatus.DRAFT,
        deposit: depositAmount,
        insurance: insuranceAdded,
        expiresAt,
      },
      include: {
        listing: true,
        renter: true,
      },
    });

    return booking;
  } catch (error) {
    console.error("Error creating draft booking:", error);
    throw error;
  }
}

export async function getBookingById(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        renter: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            fromUser: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        checklists: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return booking;
  } catch (error) {
    console.error("Error fetching booking:", error);
    return null;
  }
}

export async function approveBooking(bookingId: string, ownerId: string) {
  try {
    // Verify ownership
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.listing.ownerId !== ownerId) {
      throw new Error("Unauthorized");
    }

    if (booking.status !== BookingStatus.RESERVED) {
      throw new Error("Booking is not in RESERVED status");
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CONFIRMED,
      },
      include: {
        listing: true,
        renter: true,
      },
    });

    // Create system message
    await prisma.message.create({
      data: {
        bookingId: bookingId,
        fromUserId: ownerId,
        body: "[SYSTEM] Booking approved by owner",
      },
    });

    // Notify renter (stub - in production would send email/push notification)
    console.log(`Renter notification: Booking ${bookingId} has been approved`);
    
    return updatedBooking;
  } catch (error) {
    console.error("Error approving booking:", error);
    throw error;
  }
}

export async function declineBooking(bookingId: string, ownerId: string) {
  try {
    // Verify ownership
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.listing.ownerId !== ownerId) {
      throw new Error("Unauthorized");
    }

    if (booking.status !== BookingStatus.RESERVED) {
      throw new Error("Booking is not in RESERVED status");
    }

    // Update booking status to CANCELLED
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
      },
      include: {
        listing: true,
        renter: true,
      },
    });

    // Create system message
    await prisma.message.create({
      data: {
        bookingId: bookingId,
        fromUserId: ownerId,
        body: "[SYSTEM] Booking declined by owner",
      },
    });

    return updatedBooking;
  } catch (error) {
    console.error("Error declining booking:", error);
    throw error;
  }
}

export async function expireBookings() {
  try {
    const now = new Date();
    
    // Find bookings that should be expired
    const bookingsToExpire = await prisma.booking.findMany({
      where: {
        status: BookingStatus.RESERVED,
        expiresAt: {
          lte: now,
        },
      },
      include: {
        listing: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    // Update status and create system messages
    for (const booking of bookingsToExpire) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.CANCELLED,
        },
      });

      await prisma.message.create({
        data: {
          bookingId: booking.id,
          fromUserId: booking.listing.ownerId,
          body: "[SYSTEM] Booking expired - not approved within 12 hours",
        },
      });
    }

    return { count: bookingsToExpire.length };
  } catch (error) {
    console.error("Error expiring bookings:", error);
    throw error;
  }
}

export async function getBookingsForUser(userId: string) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { renterId: userId },
          { listing: { ownerId: userId } },
        ],
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            pricePerDay: true,
            ownerId: true,
            owner: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        renter: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

export async function notifyOwner(bookingId: string) {
  // This is a stub for notification system
  // In production, you would:
  // 1. Create a notification record
  // 2. Send email/push notification
  // 3. Update real-time notifications
  console.log(`Owner notification: New booking ${bookingId} requires approval`);
  return { success: true };
}
