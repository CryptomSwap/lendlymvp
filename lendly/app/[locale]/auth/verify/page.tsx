"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const t = useTranslations("auth");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setErrorMessage(t("invalidLink"));
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to verify magic link");
        }

        setStatus("success");
        toast.success(t("signedInSuccessfully"));
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } catch (error: any) {
        setStatus("error");
        setErrorMessage(error.message || t("linkExpired"));
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
            {status === "success" && <CheckCircle2 className="h-5 w-5 text-success" />}
            {status === "error" && <XCircle className="h-5 w-5 text-destructive" />}
            {status === "loading" && t("verifying")}
            {status === "success" && t("verificationSuccess")}
            {status === "error" && t("verificationFailed")}
          </CardTitle>
          <CardDescription>
            {status === "loading" && t("verifying")}
            {status === "success" && t("signedInSuccessfully")}
            {status === "error" && errorMessage}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

