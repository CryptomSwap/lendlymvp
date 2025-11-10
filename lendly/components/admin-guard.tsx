"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { checkAdminRole } from "@/lib/utils/auth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // In a real app, get userId from session
    const userId = "stub-user-id"; // TODO: Get from session
    
    // For MVP, allow access if user exists
    // In production, check actual admin role
    checkAdminRole(userId)
      .then((isAdmin) => {
        if (!isAdmin) {
          toast.error("Unauthorized: Admin access required");
          router.push("/");
        }
        setIsAuthorized(isAdmin);
      })
      .catch(() => {
        toast.error("Unauthorized: Admin access required");
        router.push("/");
        setIsAuthorized(false);
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

