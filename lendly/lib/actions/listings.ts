"use server";

import { prisma } from "@/lib/db";

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getFeaturedListings() {
  try {
    const listings = await prisma.listings.findMany({
      take: 20, // Get more to sort by combined score
      include: {
        owner: {
          select: {
            name: true,
            avatar: true,
            trustScore: true,
          },
        },
      },
    });

    // Sort by combined score: rating + trust score boost
    listings.sort((a, b) => {
      const scoreA = a.ratingAvg + (a.owner.trustScore / 100);
      const scoreB = b.ratingAvg + (b.owner.trustScore / 100);
      return scoreB - scoreA;
    });

    return listings.slice(0, 6); // Return top 6
  } catch (error) {
    console.error("Error fetching featured listings:", error);
    return [];
  }
}

export async function getListingsNearLocation(userLat?: number, userLng?: number) {
  try {
    // Default to Tel Aviv if no location provided
    const defaultLat = 32.0853;
    const defaultLng = 34.7818;
    const lat = userLat ?? defaultLat;
    const lng = userLng ?? defaultLng;

    // First, try to get listings with coordinates
    const listingsWithCoords = await prisma.listings.findMany({
      take: 50, // Get more to filter and sort
      where: {
        lat: { not: null },
        lng: { not: null },
      },
      include: {
        owner: {
          select: {
            name: true,
            avatar: true,
            trustScore: true,
          },
        },
      },
    });

    // Calculate distance for each listing and add it
    const listingsWithDistance = listingsWithCoords
      .map((listing) => {
        if (listing.lat && listing.lng) {
          const distance = calculateDistance(lat, lng, listing.lat, listing.lng);
          return { ...listing, distance };
        }
        return null;
      })
      .filter((listing): listing is NonNullable<typeof listing> => listing !== null);

    // Sort by distance first (closest first), then by rating + trust score
    listingsWithDistance.sort((a, b) => {
      // Prioritize listings within 50km
      const aIsNearby = a.distance <= 50;
      const bIsNearby = b.distance <= 50;
      
      if (aIsNearby && !bIsNearby) return -1;
      if (!aIsNearby && bIsNearby) return 1;
      
      // If both nearby or both far, sort by distance
      if (aIsNearby && bIsNearby) {
        return a.distance - b.distance;
      }
      
      // For far listings, consider rating + trust score
      const scoreA = a.ratingAvg + (a.owner.trustScore / 100);
      const scoreB = b.ratingAvg + (b.owner.trustScore / 100);
      return scoreB - scoreA;
    });

    // If we don't have enough listings with coordinates, add some without coordinates
    if (listingsWithDistance.length < 6) {
      const listingsWithoutCoords = await prisma.listings.findMany({
        where: {
          OR: [
            { lat: null },
            { lng: null },
          ],
        },
        take: 6 - listingsWithDistance.length,
        include: {
          owner: {
            select: {
              name: true,
              avatar: true,
              trustScore: true,
            },
          },
        },
      });

      // Sort by rating + trust score
      listingsWithoutCoords.sort((a, b) => {
        const scoreA = a.ratingAvg + (a.owner.trustScore / 100);
        const scoreB = b.ratingAvg + (b.owner.trustScore / 100);
        return scoreB - scoreA;
      });

      listingsWithDistance.push(...listingsWithoutCoords.map(l => ({ ...l, distance: null })));
    }

    // If still no listings, get any listings available (fallback)
    if (listingsWithDistance.length === 0) {
      const allListings = await prisma.listings.findMany({
        take: 6,
        include: {
          owner: {
            select: {
              name: true,
              avatar: true,
              trustScore: true,
            },
          },
        },
        orderBy: {
          ratingAvg: "desc",
        },
      });
      return allListings.map(l => ({ ...l, distance: null }));
    }

    return listingsWithDistance.slice(0, 6);
  } catch (error) {
    console.error("Error fetching listings near location:", error);
    // Fallback to featured listings
    return getFeaturedListings();
  }
}

export async function getAllListings() {
  try {
    const listings = await prisma.listings.findMany({
      take: 20,
      include: {
        owner: {
          select: {
            name: true,
            avatar: true,
            trustScore: true,
          },
        },
      },
      orderBy: [
        { ratingAvg: "desc" },
        { ratingCount: "desc" },
        { createdAt: "desc" },
      ],
    });

    // Ensure we return a plain array that can be serialized
    return JSON.parse(JSON.stringify(listings));
  } catch (error) {
    console.error("Error fetching all listings:", error);
    return [];
  }
}

export async function getListingById(id: string) {
  try {
    const listing = await prisma.listings.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            trustScore: true,
          },
        },
        bookings: {
          where: {
            status: {
              in: ["RESERVED", "CONFIRMED"],
            },
          },
          select: {
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    return listing;
  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
}

export async function createListing(data: {
  ownerId: string;
  title: string;
  description: string;
  category: string;
  dailyRate: number;
  depositOverride?: number | null;
  minDays: number;
  photos: string[];
  locationText: string;
  lat?: number | null;
  lng?: number | null;
  instantBook: boolean;
}) {
  try {
    const listing = await prisma.listings.create({
      data: {
        ownerId: data.ownerId,
        title: data.title,
        description: data.description,
        category: data.category,
        dailyRate: data.dailyRate,
        depositOverride: data.depositOverride,
        minDays: data.minDays,
        photos: JSON.stringify(data.photos),
        locationText: data.locationText,
        lat: data.lat,
        lng: data.lng,
        instantBook: data.instantBook,
      },
      include: {
        owner: true,
      },
    });

    return listing;
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
}

export async function updateListing(
  listingId: string,
  ownerId: string,
  data: {
    title?: string;
    description?: string;
    category?: string;
    dailyRate?: number;
    depositOverride?: number | null;
    minDays?: number;
    photos?: string[];
    locationText?: string;
    lat?: number | null;
    lng?: number | null;
    instantBook?: boolean;
  }
) {
  try {
    // Verify ownership
    const listing = await prisma.listings.findUnique({
      where: { id: listingId },
      select: { ownerId: true },
    });

    if (!listing) {
      throw new Error("Listing not found");
    }

    if (listing.ownerId !== ownerId) {
      throw new Error("Unauthorized");
    }

    const updateData: any = { ...data };
    if (data.photos) {
      updateData.photos = JSON.stringify(data.photos);
    }

    const updatedListing = await prisma.listings.update({
      where: { id: listingId },
      data: updateData,
      include: {
        owner: true,
      },
    });

    return updatedListing;
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
}

export async function getListingsByOwner(ownerId: string) {
  try {
    const listings = await prisma.listings.findMany({
      where: { ownerId },
      include: {
        bookings: {
          where: {
            status: {
              in: ["RESERVED", "CONFIRMED"],
            },
          },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return listings;
  } catch (error) {
    console.error("Error fetching owner listings:", error);
    return [];
  }
}

export async function searchListings(filters: {
  locationText?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  startDate?: Date;
  endDate?: Date;
  insurance?: boolean;
}) {
  try {
    const where: any = {};

    if (filters.locationText) {
      // SQLite doesn't support case-insensitive mode, so we'll use contains
      where.locationText = {
        contains: filters.locationText,
      };
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.dailyRate = {};
      if (filters.minPrice !== undefined) {
        where.dailyRate.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.dailyRate.lte = filters.maxPrice;
      }
    }

    if (filters.minRating !== undefined) {
      where.ratingAvg = {
        gte: filters.minRating,
      };
    }

    // Basic availability check (simplified - in production, check against actual bookings)
    if (filters.startDate && filters.endDate) {
      // This is a stub - in production, you'd check against Booking table
      // For now, we'll just return all listings
    }

    const listings = await prisma.listings.findMany({
      where,
      include: {
        owner: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        ratingAvg: "desc",
      },
    });

    return listings;
  } catch (error) {
    console.error("Error searching listings:", error);
    return [];
  }
}
