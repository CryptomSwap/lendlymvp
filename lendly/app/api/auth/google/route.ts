import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const state = searchParams.get("state"); // Contains locale

    // Handle OAuth callback
    if (code) {
      // Exchange code for token
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID || "",
          client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google`,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to exchange code for token");
      }

      const tokens = await tokenResponse.json();

      // Get user info from Google
      const userResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user info");
      }

      const googleUser = await userResponse.json();

      // Import Prisma client
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      try {
        // Find or create user
        let user = await prisma.user.findUnique({
          where: { email: googleUser.email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: googleUser.email,
              name: googleUser.name || googleUser.email.split("@")[0],
              avatar: googleUser.picture || null,
            },
          });
        } else {
          // Update avatar if available
          if (googleUser.picture && !user.avatar) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { avatar: googleUser.picture },
            });
          }
        }

        // Create or update account
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: "google",
              providerAccountId: googleUser.id,
            },
          },
          update: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: tokens.expires_in
              ? Math.floor(Date.now() / 1000) + tokens.expires_in
              : null,
            token_type: tokens.token_type,
            id_token: tokens.id_token,
          },
          create: {
            userId: user.id,
            type: "oauth",
            provider: "google",
            providerAccountId: googleUser.id,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: tokens.expires_in
              ? Math.floor(Date.now() / 1000) + tokens.expires_in
              : null,
            token_type: tokens.token_type,
            id_token: tokens.id_token,
          },
        });

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

        // Get locale from state parameter or default to 'he'
        const locale = state || "he";
        
        // Redirect to home with locale
        return NextResponse.redirect(
          new URL(`/${locale}`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
        );
      } finally {
        await prisma.$disconnect();
      }
    }

    // Handle error
    if (error) {
      const errorLocale = state || "he";
      
      return NextResponse.redirect(
        new URL(
          `/${errorLocale}/auth/signin?error=${encodeURIComponent(error)}`,
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        )
      );
    }

    // Initiate OAuth flow - get locale from query param
    const locale = searchParams.get("locale") || "he";
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google`;
    const scope = "openid email profile";
    const responseType = "code";
    const clientId = process.env.GOOGLE_CLIENT_ID || "";

    if (!clientId) {
      return NextResponse.json(
        { error: "Google OAuth not configured" },
        { status: 500 }
      );
    }

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", responseType);
    authUrl.searchParams.set("scope", scope);
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");
    authUrl.searchParams.set("state", locale); // Store locale in state

    return NextResponse.redirect(authUrl.toString());
  } catch (error: any) {
    console.error("Google OAuth error:", error);
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || searchParams.get("state") || "he";
    
    return NextResponse.redirect(
      new URL(
        `/${locale}/auth/signin?error=${encodeURIComponent(error.message || "Authentication failed")}`,
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      )
    );
  }
}

