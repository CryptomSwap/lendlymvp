"use server";

import { PrismaClient, ChecklistPhase, BookingStatus } from "@prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

export async function createPickupChecklist(
  bookingId: string,
  ownerId: string,
  data: {
    photos: string[];
    serial?: string;
    conditionNotes?: string;
    depositCollected: boolean;
  }
) {
  try {
    // Verify booking exists and user is owner
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

    if (booking.status !== "CONFIRMED" && booking.status !== "COMPLETED" && booking.status !== "DISPUTED") {
      throw new Error("Booking must be CONFIRMED to create pickup checklist");
    }
    
    // Check if pickup checklist already exists
    const existingPickup = await prisma.checklist.findFirst({
      where: {
        bookingId,
        phase: ChecklistPhase.PICKUP,
      },
    });
    
    if (existingPickup) {
      throw new Error("Pickup checklist already exists");
    }

    // Create pickup checklist
    const checklist = await prisma.checklist.create({
      data: {
        bookingId,
        phase: ChecklistPhase.PICKUP,
        photos: JSON.stringify(data.photos),
        serial: data.serial,
        conditionNotes: data.conditionNotes,
        signedAt: new Date(),
      },
      include: {
        booking: true,
      },
    });

    // Create system message
    await prisma.message.create({
      data: {
        bookingId: bookingId,
        fromUserId: ownerId,
        body: "[SYSTEM] Item picked up. Deposit collected.",
      },
    });

    return checklist;
  } catch (error) {
    console.error("Error creating pickup checklist:", error);
    throw error;
  }
}

export async function createReturnChecklist(
  bookingId: string,
  ownerId: string,
  data: {
    photos: string[];
    conditionAssessment: "Same" | "Minor" | "Major";
    conditionNotes?: string;
  }
) {
  try {
    // Verify booking exists and user is owner
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

    if (booking.status !== "CONFIRMED" && booking.status !== "COMPLETED" && booking.status !== "DISPUTED") {
      throw new Error("Booking must be CONFIRMED to create return checklist");
    }
    
    // Check if return checklist already exists
    const existingReturn = await prisma.checklist.findFirst({
      where: {
        bookingId,
        phase: ChecklistPhase.RETURN,
      },
    });
    
    if (existingReturn) {
      throw new Error("Return checklist already exists");
    }
    
    // Check if pickup checklist exists
    const pickupChecklist = await prisma.checklist.findFirst({
      where: {
        bookingId,
        phase: ChecklistPhase.PICKUP,
      },
    });
    
    if (!pickupChecklist) {
      throw new Error("Pickup checklist must be completed before return");
    }

    // Determine final status based on condition
    const finalStatus = data.conditionAssessment === "Major" 
      ? BookingStatus.DISPUTED 
      : BookingStatus.COMPLETED;

    // Create return checklist
    const checklist = await prisma.checklist.create({
      data: {
        bookingId,
        phase: ChecklistPhase.RETURN,
        photos: JSON.stringify(data.photos),
        conditionNotes: data.conditionNotes,
        signedAt: new Date(),
      },
      include: {
        booking: true,
      },
    });

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: finalStatus,
      },
    });

    // Create system message
    await prisma.message.create({
      data: {
        bookingId: bookingId,
        fromUserId: ownerId,
        body: `[SYSTEM] Item returned. Condition: ${data.conditionAssessment}. Status: ${finalStatus}`,
      },
    });

    return { checklist, status: finalStatus };
  } catch (error) {
    console.error("Error creating return checklist:", error);
    throw error;
  }
}

export async function getChecklistsForBooking(bookingId: string) {
  try {
    const checklists = await prisma.checklist.findMany({
      where: { bookingId },
      orderBy: {
        createdAt: "asc",
      },
    });

    return checklists;
  } catch (error) {
    console.error("Error fetching checklists:", error);
    return [];
  }
}

