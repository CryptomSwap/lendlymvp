"use server";

import { BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { calculateDeposit as calculateDepositUtil } from "@/lib/utils/deposit";

export async function createDraftBookingWithMessage(
  listingId: string,
  renterId: string,
  messageBody: string
) {
  try {
    // Create a draft booking first
    const listing = await prisma.listings.findUnique({
      where: { id: listingId },
      select: { ownerId: true, dailyRate: true, depositOverride: true },
    });

    if (!listing) {
      throw new Error("Listing not found");
    }

        // Create draft booking with default dates (today + 1 day)
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 1);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        const days = 1;
        
        // Get owner and renter trust scores
        const owner = await prisma.user.findUnique({
          where: { id: listing.ownerId },
          select: { trustScore: true },
        });
        
        const renter = await prisma.user.findUnique({
          where: { id: renterId },
          select: { trustScore: true },
        });

        // Calculate deposit using new algorithm
        const depositResult = await calculateDepositUtil({
          dailyRate: listing.dailyRate,
          days,
          category: listing.category || "Other",
          ownerTrustScore: owner?.trustScore || 50,
          renterTrustScore: renter?.trustScore || 50,
          depositOverride: listing.depositOverride,
        });

        const depositRequired = depositResult.deposit;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const booking = await prisma.booking.create({
      data: {
        listingId,
        renterId,
        startDate,
        endDate,
        status: BookingStatus.DRAFT,
        depositRequired,
        insuranceAdded: false,
        expiresAt,
      },
    });

    // Create initial message
    const message = await prisma.message.create({
      data: {
        bookingId: booking.id,
        fromUserId: renterId,
        body: messageBody,
      },
      include: {
        booking: {
          include: {
            listing: true,
          },
        },
        fromUser: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    return { booking, message };
  } catch (error) {
    console.error("Error creating draft booking with message:", error);
    throw error;
  }
}

export async function sendMessage(bookingId: string, fromUserId: string, body: string) {
  try {
    const message = await prisma.message.create({
      data: {
        bookingId,
        fromUserId,
        body,
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
    });

    return message;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function getBookingMessages(bookingId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: { bookingId },
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
    });

    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}
