import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serializeRoles } from "@/lib/auth/roles";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Dev sign-in is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0],
          roles: serializeRoles(["USER"]),
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
      secure: false, // Allow in dev
      sameSite: "lax",
      expires,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    });
  } catch (error: any) {
    console.error("Error in dev sign-in:", error);
    return NextResponse.json(
      { error: error.message || "Failed to sign in" },
      { status: 500 }
    );
  }
}

