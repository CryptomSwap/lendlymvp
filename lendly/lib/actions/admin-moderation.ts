"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/utils/auth";

export async function getPendingListings(userId: string) {
  await requireAdmin(userId);
  
  try {
    // In a real app, you'd have a status field on listings
    // For now, we'll return all listings (you can add a status field later)
    const listings = await prisma.listing.findMany({
      where: {
        // Add status filter when you add status field
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            trustScore: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return listings;
  } catch (error) {
    console.error("Error fetching pending listings:", error);
    throw error;
  }
}

export async function approveListing(listingId: string, adminId: string) {
  await requireAdmin(adminId);
  
  try {
    // In a real app, you'd update a status field
    // For now, we'll just return success
    // You can add: await prisma.listings.update({ where: { id: listingId }, data: { status: "APPROVED" } })
    return { success: true };
  } catch (error) {
    console.error("Error approving listing:", error);
    throw error;
  }
}

export async function rejectListing(listingId: string, adminId: string, reason?: string) {
  await requireAdmin(adminId);
  
  try {
    // In a real app, you'd update status and store rejection reason
    // For now, we'll just return success
    return { success: true, reason };
  } catch (error) {
    console.error("Error rejecting listing:", error);
    throw error;
  }
}

export async function getDisputes(userId: string) {
  await requireAdmin(userId);
  
  try {
    const disputes = await prisma.dispute.findMany({
      include: {
        booking: {
          include: {
            listing: {
              select: {
                id: true,
                title: true,
                pricePerDay: true,
              },
            },
            renter: {
              select: {
                id: true,
                name: true,
                email: true,
                trustScore: true,
              },
            },
          },
        },
        openedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return disputes;
  } catch (error) {
    console.error("Error fetching disputes:", error);
    throw error;
  }
}

export async function resolveDispute(
  disputeId: string,
  adminId: string,
  decision: "REFUND_OWNER" | "PARTIAL_REFUND" | "REJECT",
  refundAmount?: number,
  notes?: string
) {
  await requireAdmin(adminId);
  
  try {
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        booking: true,
      },
    });

    if (!dispute) {
      throw new Error("Dispute not found");
    }

    // Update dispute status
    const updatedDispute = await prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: "RESOLVED",
      },
    });

    // Create system message in booking thread
    const decisionMessages: Record<string, string> = {
      REFUND_OWNER: `[SYSTEM] Dispute resolved: Full refund to owner. ${notes || ""}`,
      PARTIAL_REFUND: `[SYSTEM] Dispute resolved: Partial refund of ₪${refundAmount || 0} to owner. ${notes || ""}`,
      REJECT: `[SYSTEM] Dispute resolved: Claim rejected. ${notes || ""}`,
    };

    await prisma.message.create({
      data: {
        bookingId: dispute.bookingId,
        fromUserId: adminId,
        body: decisionMessages[decision] || "[SYSTEM] Dispute resolved.",
      },
    });

    return { success: true, dispute: updatedDispute };
  } catch (error) {
    console.error("Error resolving dispute:", error);
    throw error;
  }
}

export async function banUser(userId: string, adminId: string, banned: boolean) {
  await requireAdmin(adminId);
  
  try {
    // In a real app, you'd have a banned field or status
    // For now, we'll just return success
    // You can add: await prisma.user.update({ where: { id: userId }, data: { banned: true } })
    return { success: true, banned };
  } catch (error) {
    console.error("Error banning user:", error);
    throw error;
  }
}

export async function getAllUsers(userId: string) {
  await requireAdmin(userId);
  
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        trustScore: true,
        createdAt: true,
        // In a real app, add verification status field
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getAdminMetrics(userId: string) {
  await requireAdmin(userId);
  
  try {
    const [
      totalListings,
      activeListings,
      totalBookings,
      completedBookings,
      cancelledBookings,
      totalDisputes,
      openDisputes,
    ] = await Promise.all([
      prisma.listing.count(),
      prisma.listing.count({
        // In a real app, filter by status = ACTIVE
      }),
      prisma.booking.count(),
      prisma.booking.count({
        where: { status: "COMPLETED" },
      }),
      prisma.booking.count({
        where: { status: "CANCELLED" },
      }),
      prisma.dispute.count(),
      prisma.dispute.count({
        where: { status: "OPEN" },
      }),
    ]);

    // Calculate conversion rate
    const conversionRate =
      totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

    return {
      totalListings,
      activeListings,
      totalBookings,
      completedBookings,
      cancelledBookings,
      conversionRate: conversionRate.toFixed(1),
      totalDisputes,
      openDisputes,
    };
  } catch (error) {
    console.error("Error fetching admin metrics:", error);
    throw error;
  }
}

