"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendMagicLink } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { useRouter, useLocale } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error(t("email") + " - " + t("pleaseSignIn"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send magic link");
      }
      
      // In dev, show the magic link in a toast
      const magicLink = `${window.location.origin}/${locale}/auth/verify?token=${result.token}`;
      
      toast.success(
        <div className="space-y-2">
          <p>{t("magicLinkSent")}</p>
          <a
            href={magicLink}
            className="text-primary underline break-all text-xs block"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = magicLink;
            }}
          >
            {t("clickToSignIn")}
          </a>
        </div>,
        { duration: 10000 }
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to send magic link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{t("signIn")}</CardTitle>
          <CardDescription>
            {t("email")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("verifying")}
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {t("sendMagicLink")}
                </>
              )}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            In development mode, the link will appear in a toast notification
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

