"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

// Magic link token storage (in-memory for MVP, use Redis in production)
const magicLinkTokens = new Map<string, { email: string; expiresAt: Date }>();

export async function sendMagicLink(email: string): Promise<{ success: boolean; token?: string; email: string }> {
  try {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // Create user if doesn't exist
    if (!user) {
      const { serializeRoles } = await import("./auth/roles");
      user = await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0], // Default name from email
          roles: serializeRoles(["USER"]), // Default role
        },
      });
    }

    // Generate magic link token
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    
    // Store token (expires in 15 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    
    magicLinkTokens.set(token, { email, expiresAt });

    // In dev, return the token to show in toast
    // In production, send email with link
    return { success: true, token, email };
  } catch (error) {
    console.error("Error sending magic link:", error);
    throw new Error("Failed to send magic link");
  }
}

export async function verifyMagicLink(token: string) {
  try {
    const tokenData = magicLinkTokens.get(token);
    
    if (!tokenData) {
      throw new Error("Invalid or expired token");
    }

    // Check expiration
    if (new Date() > tokenData.expiresAt) {
      magicLinkTokens.delete(token);
      throw new Error("Token expired");
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email: tokenData.email },
    });

    if (!user) {
      const { serializeRoles } = await import("./auth/roles");
      user = await prisma.user.create({
        data: {
          email: tokenData.email,
          name: tokenData.email.split("@")[0],
          roles: serializeRoles(["USER"]), // Default role
        },
      });
    }

    // Create session
    const sessionToken = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15);
    
    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // 30 days

    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires,
      },
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires,
      path: "/",
    });

    // Clean up token
    magicLinkTokens.delete(token);

    return { success: true, user };
  } catch (error) {
    console.error("Error verifying magic link:", error);
    throw error;
  }
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      return null;
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: {
        user: true,
      },
    });

    if (!session || new Date() > session.expires) {
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function signOut() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (sessionToken) {
      await prisma.session.deleteMany({
        where: { sessionToken },
      });
    }

    cookieStore.delete("session_token");
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

