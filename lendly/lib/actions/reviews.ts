"use server";

import { prisma } from "@/lib/db";

export async function createReview(
  bookingId: string,
  fromUserId: string,
  toUserId: string,
  rating: number,
  text?: string
) {
  try {
    // Verify booking exists and is completed
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: true,
        renter: true,
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status !== "COMPLETED") {
      throw new Error("Can only review completed bookings");
    }

    // Verify user is part of the booking
    if (fromUserId !== booking.renterId && fromUserId !== booking.listing.ownerId) {
      throw new Error("Unauthorized");
    }

    // Verify toUserId is the other party
    const otherPartyId = fromUserId === booking.renterId 
      ? booking.listing.ownerId 
      : booking.renterId;
    
    if (toUserId !== otherPartyId) {
      throw new Error("Invalid review recipient");
    }

    // Check if review already exists (by listingId and fromUserId)
    const existingReview = await prisma.review.findFirst({
      where: {
        listingId: booking.listingId,
        fromUserId,
        toUserId,
      },
    });

    if (existingReview) {
      throw new Error("Review already submitted");
    }

    // Create review (Note: Review model doesn't have bookingId in schema, but we'll use listingId)
    const review = await prisma.review.create({
      data: {
        listingId: booking.listingId,
        fromUserId,
        toUserId,
        rating,
        text: text || null,
      },
      include: {
        fromUser: {
          select: {
            name: true,
          },
        },
        toUser: {
          select: {
            name: true,
          },
        },
      },
    });

    // Update listing rating average and count
    await updateListingRating(booking.listingId);

    // Update user trust score
    await updateUserTrustScore(toUserId);

    return review;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}

async function updateListingRating(listingId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { listingId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      await prisma.listing.update({
        where: { id: listingId },
        data: {
          ratingAvg: 0,
          ratingCount: 0,
        },
      });
      return;
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;
    const count = reviews.length;

    await prisma.listing.update({
      where: { id: listingId },
      data: {
        ratingAvg: averageRating,
        ratingCount: count,
      },
    });
  } catch (error) {
    console.error("Error updating listing rating:", error);
  }
}

async function updateUserTrustScore(userId: string) {
  try {
    // Get user's booking history
    const userBookings = await prisma.booking.findMany({
      where: {
        OR: [
          { renterId: userId },
          { listing: { ownerId: userId } },
        ],
      },
      include: {
        checklists: {
          where: {
            phase: "RETURN",
          },
        },
      },
    });

    // Calculate trust score components
    const baseScore = 50; // Starting trust score
    const completedBookings = userBookings.filter(
      (b) => b.status === "COMPLETED"
    ).length;
    
    // Count late returns (bookings returned after endDate)
    const lateReturns = userBookings.filter((b) => {
      if (b.status !== "COMPLETED" && b.status !== "DISPUTED") return false;
      const returnChecklist = b.checklists.find((c) => c.phase === "RETURN");
      if (!returnChecklist || !returnChecklist.signedAt) return false;
      return new Date(returnChecklist.signedAt) > new Date(b.endDate);
    }).length;

    // Count damages (bookings with Major condition assessment)
    const damages = userBookings.filter((b) => {
      if (b.status !== "DISPUTED") return false;
      const returnChecklist = b.checklists.find((c) => c.phase === "RETURN");
      if (!returnChecklist) return false;
      // Check if condition notes indicate major damage
      return returnChecklist.conditionNotes?.toLowerCase().includes("major") ||
             b.status === "DISPUTED";
    }).length;

    // Trust score formula: base + completed*X - lateReturns*Y - damages*Z
    const X = 5; // Points per completed booking
    const Y = 10; // Penalty per late return
    const Z = 15; // Penalty per damage dispute

    const trustScore = Math.max(
      0,
      Math.min(
        100,
        baseScore + completedBookings * X - lateReturns * Y - damages * Z
      )
    );

    await prisma.user.update({
      where: { id: userId },
      data: { trustScore },
    });

    return trustScore;
  } catch (error) {
    console.error("Error updating trust score:", error);
    throw error;
  }
}

export async function getReviewForBooking(bookingId: string, userId: string) {
  try {
    // Get booking to find listingId
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { listingId: true },
    });

    if (!booking) {
      return null;
    }

    // Find review by listingId and userId (since Review model doesn't have bookingId)
    const review = await prisma.review.findFirst({
      where: {
        listingId: booking.listingId,
        fromUserId: userId,
      },
    });

    return review;
  } catch (error) {
    console.error("Error fetching review:", error);
    return null;
  }
}

export async function canUserReview(bookingId: string, userId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: true,
      },
    });

    if (!booking) {
      return false;
    }

    // Must be completed
    if (booking.status !== "COMPLETED") {
      return false;
    }

    // User must be part of the booking
    if (userId !== booking.renterId && userId !== booking.listing.ownerId) {
      return false;
    }

    // Check if review already exists (by listingId and fromUserId)
    const existingReview = await prisma.review.findFirst({
      where: {
        listingId: booking.listingId,
        fromUserId: userId,
      },
    });

    return !existingReview;
  } catch (error) {
    console.error("Error checking review eligibility:", error);
    return false;
  }
}

