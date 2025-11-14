"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function updateUserProfile(data: {
  name?: string;
  bio?: string;
  languages?: string[];
  avatar?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        bio: data.bio,
        // In a real app, you'd store languages in a separate table or JSON field
        // For now, we'll skip this field
        avatar: data.avatar,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        listingsAsOwner: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        reviewsReceived: {
          include: {
            fromUser: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            listing: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function getMyProfile() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }

    return getUserProfile(user.id);
  } catch (error) {
    console.error("Error fetching my profile:", error);
    return null;
  }
}

