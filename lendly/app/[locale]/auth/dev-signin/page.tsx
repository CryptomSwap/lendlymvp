"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Shield, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { parseRoles } from "@/lib/auth/roles";

const TEST_USERS = [
  {
    email: "admin@lendly.com",
    name: "Admin User",
    role: "ADMIN",
    verified: true,
    trustScore: 100,
  },
  {
    email: "alon@example.com",
    name: "אלון כהן (Alon Cohen)",
    role: "USER",
    verified: true,
    trustScore: 85,
    description: "Active owner with multiple listings",
  },
  {
    email: "sara@example.com",
    name: "שרה לוי (Sara Levi)",
    role: "USER",
    verified: true,
    trustScore: 92,
    description: "High trust score user",
  },
  {
    email: "maya@example.com",
    name: "מאיה אברהם (Maya Avraham)",
    role: "USER",
    verified: true,
    trustScore: 95,
    description: "Highest trust score",
  },
  {
    email: "david@example.com",
    name: "דוד ישראלי (David Israeli)",
    role: "USER",
    verified: false,
    trustScore: 78,
    description: "Not verified user",
  },
  {
    email: "tom@example.com",
    name: "תום רוזן (Tom Rosen)",
    role: "USER",
    verified: true,
    trustScore: 88,
    description: "Regular verified user",
  },
  {
    email: "noa@example.com",
    name: "נועה דוד (Noa David)",
    role: "USER",
    verified: false,
    trustScore: 82,
    description: "Not verified user",
  },
];

export default function DevSignInPage() {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState<string | null>(null);

  const handleSignIn = async (email: string) => {
    setIsSigningIn(email);
    try {
      const response = await fetch("/api/auth/dev-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to sign in");
      }

      toast.success(`Signed in as ${result.user?.name || email}`);
      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      setIsSigningIn(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-h1 mb-2">Dev Sign In</h1>
        <p className="text-muted-foreground">
          Quick sign-in for testing (Development mode only)
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {TEST_USERS.map((user) => (
          <Card key={user.email} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{user.name}</CardTitle>
                  <CardDescription className="text-sm">{user.email}</CardDescription>
                </div>
                <Badge variant={user.role === "ADMIN" ? "default" : "outline"}>
                  {user.role === "ADMIN" ? (
                    <Shield className="h-3 w-3 mr-1" />
                  ) : (
                    <User className="h-3 w-3 mr-1" />
                  )}
                  {user.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    {user.verified ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={user.verified ? "text-green-700" : "text-gray-500"}>
                      {user.verified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    Trust: {user.trustScore}
                  </div>
                </div>
                {user.description && (
                  <p className="text-xs text-muted-foreground">{user.description}</p>
                )}
                <Button
                  onClick={() => handleSignIn(user.email)}
                  disabled={isSigningIn === user.email}
                  className="w-full"
                  variant={user.role === "ADMIN" ? "default" : "outline"}
                >
                  {isSigningIn === user.email ? (
                    "Signing in..."
                  ) : (
                    `Sign in as ${user.name.split(" ")[0]}`
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This page is for development/testing only. In production, users will sign in via magic link.
        </p>
      </div>
    </div>
  );
}

