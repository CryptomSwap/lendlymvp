"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { requireAdmin } from "@/lib/utils/auth";

// Overview metrics
export async function getAdminMetrics() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  await requireAdmin(user.id);

  try {
    const [
      activeListings,
      pendingApprovals,
      openDisputes,
      totalDisputes,
      bookings,
      completedBookings,
    ] = await Promise.all([
      prisma.listing.count({ where: { status: "APPROVED" } }),
      prisma.listing.count({ where: { status: "PENDING" } }),
      prisma.dispute.count({ where: { status: "OPEN" } }),
      prisma.dispute.count(),
      prisma.booking.findMany({
        where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
        include: { listing: true },
      }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
    ]);

    // Calculate GMV (Gross Merchandise Value)
    const gmv = bookings.reduce((sum, booking) => {
      const days = Math.ceil(
        (booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return sum + booking.listing.pricePerDay * days;
    }, 0);

    // Calculate conversion rate
    const totalBookings = await prisma.booking.count();
    const conversionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

    return {
      activeListings,
      pendingApprovals,
      openDisputes,
      totalDisputes,
      gmv,
      conversionRate: conversionRate.toFixed(1),
      totalBookings,
      completedBookings,
    };
  } catch (error) {
    console.error("Error fetching admin metrics:", error);
    throw error;
  }
}

// Listings management
export async function getAdminListings(filters?: {
  status?: string;
  category?: string;
  ownerEmail?: string;
  page?: number;
  pageSize?: number;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  await requireAdmin(user.id);

  try {
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.category) where.category = filters.category;
    if (filters?.ownerEmail) {
      where.owner = { email: { contains: filters.ownerEmail, mode: "insensitive" } };
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
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
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.listing.count({ where }),
    ]);

    return { listings, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
}

export async function updateListingStatus(
  listingId: string,
  status: "APPROVED" | "REJECTED" | "PAUSED"
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  await requireAdmin(user.id);

  try {
    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: { status },
    });
    return { success: true, listing };
  } catch (error) {
    console.error("Error updating listing status:", error);
    throw error;
  }
}

// Disputes management
export async function getAdminDisputes() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  await requireAdmin(user.id);

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
                photos: true,
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
      orderBy: { createdAt: "desc" },
    });

    return disputes;
  } catch (error) {
    console.error("Error fetching disputes:", error);
    throw error;
  }
}

export async function updateDisputeStatus(
  disputeId: string,
  status: "OPEN" | "IN_REVIEW" | "RESOLVED_OWNER" | "RESOLVED_RENTER" | "REFUND_PARTIAL",
  notes?: string
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  await requireAdmin(user.id);

  try {
    const dispute = await prisma.dispute.update({
      where: { id: disputeId },
      data: { status, notes },
    });

    // Create system message
    await prisma.message.create({
      data: {
        bookingId: dispute.bookingId,
        fromUserId: user.id,
        body: `[SYSTEM] Dispute status updated to ${status}. ${notes || ""}`,
      },
    });

    return { success: true, dispute };
  } catch (error) {
    console.error("Error updating dispute status:", error);
    throw error;
  }
}

// Users management
export async function getAdminUsers(filters?: {
  role?: string;
  isVerified?: boolean;
  page?: number;
  pageSize?: number;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  await requireAdmin(user.id);

  try {
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    // Note: Role filtering would need to search within JSON string
    // For now, we'll fetch all and filter in memory if needed
    // In production, consider using a full-text search or separate role table
    if (filters?.isVerified !== undefined) where.isVerified = filters.isVerified;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          roles: true,
          trustScore: true,
          isVerified: true,
          createdAt: true,
          _count: {
            select: {
              disputesOpened: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users: users.map((u) => ({
        ...u,
        incidentsCount: u._count.disputesOpened,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function updateUserVerification(userId: string, isVerified: boolean) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  await requireAdmin(user.id);

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isVerified },
    });
    return { success: true, user: updated };
  } catch (error) {
    console.error("Error updating user verification:", error);
    throw error;
  }
}

export async function updateUserTrustScore(userId: string, trustScore: number) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  await requireAdmin(user.id);

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { trustScore },
    });
    return { success: true, user: updated };
  } catch (error) {
    console.error("Error updating user trust score:", error);
    throw error;
  }
}

export async function banUser(userId: string, banned: boolean) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  await requireAdmin(user.id);

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: banned ? "BANNED" : "USER" },
    });
    return { success: true, user: updated };
  } catch (error) {
    console.error("Error banning user:", error);
    throw error;
  }
}

// Rules management
export async function getRules() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  await requireAdmin(user.id);

  try {
    let rules = await prisma.rules.findUnique({ where: { id: 1 } });
    if (!rules) {
      // Create default rules if they don't exist
      rules = await prisma.rules.create({
        data: {
          id: 1,
          baseDepositPct: 0.1,
          minDeposit: 100,
          maxDeposit: 10000,
          insuranceDaily: 50,
          incidentMultiplier: 1.5,
          ownerTrustMultiplier: 1.0,
          renterTrustMultiplier: 1.0,
        },
      });
    }
    return rules;
  } catch (error) {
    console.error("Error fetching rules:", error);
    throw error;
  }
}

export async function updateRules(data: {
  baseDepositPct: number;
  minDeposit: number;
  maxDeposit: number;
  insuranceDaily: number;
  incidentMultiplier: number;
  ownerTrustMultiplier: number;
  renterTrustMultiplier: number;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  await requireAdmin(user.id);

  try {
    const rules = await prisma.rules.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        ...data,
      },
    });
    return { success: true, rules };
  } catch (error) {
    console.error("Error updating rules:", error);
    throw error;
  }
}

// Compatibility layer for old AdminSettings structure
export interface DepositSettings {
  baseMultiplier: number;
  ownerTrustWeight: number;
  renterTrustWeight: number;
  categoryRiskFactors: Record<string, number>;
}

export interface InsuranceSettings {
  percentage: number;
  minimum: number;
}

export interface AdminSettings {
  deposit: DepositSettings;
  insurance: InsuranceSettings;
}

export async function getAdminSettings(): Promise<AdminSettings> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  await requireAdmin(user.id);

  try {
    const rules = await getRules();
    
    // Map Rules to old AdminSettings format
    return {
      deposit: {
        baseMultiplier: rules.baseDepositPct * 10, // Convert 0.1 to 1.0
        ownerTrustWeight: Math.abs(rules.ownerTrustMultiplier - 1.0),
        renterTrustWeight: Math.abs(rules.renterTrustMultiplier - 1.0),
        categoryRiskFactors: {}, // Default empty, can be extended later
      },
      insurance: {
        percentage: 10, // Default percentage (can be calculated from daily rate if needed)
        minimum: rules.insuranceDaily,
      },
    };
  } catch (error) {
    console.error("Error fetching admin settings:", error);
    throw error;
  }
}

export async function updateAdminSettings(settings: AdminSettings) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  await requireAdmin(user.id);

  try {
    // Map old AdminSettings format to Rules
    const rulesData = {
      baseDepositPct: settings.deposit.baseMultiplier / 10, // Convert 1.0 to 0.1
      minDeposit: 100, // Keep default
      maxDeposit: 10000, // Keep default
      insuranceDaily: settings.insurance.minimum,
      incidentMultiplier: 1.5, // Keep default
      ownerTrustMultiplier: 1.0 + settings.deposit.ownerTrustWeight,
      renterTrustMultiplier: 1.0 + settings.deposit.renterTrustWeight,
    };

    await updateRules(rulesData);
    return { success: true };
  } catch (error) {
    console.error("Error updating admin settings:", error);
    throw error;
  }
}

// Metrics with time range
export async function getAdminMetricsWithRange(from: Date, to: Date) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  await requireAdmin(user.id);

  try {
    const [newUsers, bookings, completedBookings, disputes, avgTrustScore] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: { gte: from, lte: to },
        },
      }),
      prisma.booking.count({
        where: {
          createdAt: { gte: from, lte: to },
        },
      }),
      prisma.booking.count({
        where: {
          status: "COMPLETED",
          createdAt: { gte: from, lte: to },
        },
      }),
      prisma.dispute.count({
        where: {
          createdAt: { gte: from, lte: to },
        },
      }),
      prisma.user.aggregate({
        _avg: { trustScore: true },
      }),
    ]);

    const completionRate = bookings > 0 ? (completedBookings / bookings) * 100 : 0;
    const disputesRate = bookings > 0 ? (disputes / bookings) * 100 : 0;

    return {
      newUsers,
      bookings,
      completedBookings,
      disputes,
      completionRate: completionRate.toFixed(1),
      disputesRate: disputesRate.toFixed(1),
      avgTrustScore: avgTrustScore._avg.trustScore?.toFixed(1) || "0",
    };
  } catch (error) {
    console.error("Error fetching metrics with range:", error);
    throw error;
  }
}
