import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseRoles } from "@/lib/auth/roles";

const prisma = new PrismaClient();

const intlMiddleware = createMiddleware(routing);

async function checkAdminAccess(request: NextRequest): Promise<boolean> {
  try {
    const sessionToken = request.cookies.get("session_token")?.value;
    if (!sessionToken) {
      return false;
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: { select: { roles: true } } },
    });

    if (!session || new Date() > session.expires) {
      return false;
    }

    const roles = parseRoles(session.user.roles);
    return roles.includes("ADMIN");
  } catch (error) {
    console.error("Error checking admin access:", error);
    return false;
  }
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if this is an admin route (only if it already has locale prefix)
  // Match paths like /he/admin/* or /en/admin/*
  if (pathname.match(/^\/(he|en)\/admin/)) {
    const isAdmin = await checkAdminAccess(request);
    if (!isAdmin) {
      const url = request.nextUrl.clone();
      // Extract locale from pathname
      const locale = pathname.split('/')[1] || routing.defaultLocale;
      url.pathname = `/${locale}/admin/unauthorized`;
      return NextResponse.redirect(url);
    }
  }

  // Apply internationalization middleware (handles locale prefixing/redirects)
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except:
  // - API routes
  // - Static files (_next/static)
  // - Image optimization files (_next/image)
  // - Favicon, etc.
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};

