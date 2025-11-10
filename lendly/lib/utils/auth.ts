"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function checkAdminRole(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return user?.role === "admin";
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
}

export async function requireAdmin(userId: string) {
  const isAdmin = await checkAdminRole(userId);
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }
  return true;
}

