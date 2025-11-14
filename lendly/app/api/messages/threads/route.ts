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

    // Get all bookings where user is either owner or renter
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { renterId: user.id },
          { listing: { ownerId: user.id } },
        ],
      },
      include: {
        listing: {
          select: {
            title: true,
            photos: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            fromUser: {
              select: {
                name: true,
              },
            },
          },
        },
        thread: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    // Group by booking and create thread-like structure
    const threads = bookings.map((booking) => {
      const lastMessage = booking.messages[0];
      // Count unread messages (messages not from current user, simplified for MVP)
      const unreadCount = booking.messages.filter(
        (m) => m.fromUserId !== user.id
      ).length;

      return {
        id: booking.thread?.id || booking.id,
        booking: {
          id: booking.id,
          listing: booking.listing,
        },
        lastMessageAt: booking.thread?.lastMessageAt || booking.updatedAt,
        unreadCount,
        lastMessage: lastMessage
          ? {
              body: lastMessage.body,
              fromUser: lastMessage.fromUser,
            }
          : undefined,
      };
    });

    return NextResponse.json({ threads });
  } catch (error: any) {
    console.error("Error fetching threads:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch threads" },
      { status: 500 }
    );
  }
}

