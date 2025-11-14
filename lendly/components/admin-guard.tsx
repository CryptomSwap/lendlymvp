"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Loader2 } from "lucide-react";
import { parseRoles } from "@/lib/auth/roles";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin via API
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        const roles = data.user?.roles 
          ? (typeof data.user.roles === "string" ? parseRoles(data.user.roles) : data.user.roles)
          : [];
        if (roles.includes("ADMIN")) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          router.push("/");
        }
      })
      .catch(() => {
        setIsAuthorized(false);
        router.push("/");
      });
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

