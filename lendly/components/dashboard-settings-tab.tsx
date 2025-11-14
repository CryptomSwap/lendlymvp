"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, Upload, Bell, Globe } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

export function SettingsTab() {
  const t = useTranslations("dashboard.settings");
  const locale = useLocale();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    bookingUpdates: true,
    messages: true,
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

  const handleLanguageChange = (newLocale: string) => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const handleSave = async () => {
    // TODO: Implement save
    toast.success(t("saved"));
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6" dir={locale === "he" ? "rtl" : "ltr"}>
      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>{t("profile.title")}</CardTitle>
          <CardDescription>{t("profile.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || "/person.png"} />
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                {t("profile.uploadPhoto")}
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="name">{t("profile.name")}</Label>
            <Input id="name" defaultValue={user.name} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="phone">{t("profile.phone")}</Label>
            <Input id="phone" defaultValue={user.phone || ""} className="mt-2" />
          </div>
          <Button onClick={handleSave}>{t("save")}</Button>
        </CardContent>
      </Card>

      {/* Verification */}
      <Card>
        <CardHeader>
          <CardTitle>{t("verification.title")}</CardTitle>
          <CardDescription>{t("verification.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user.isVerified ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">{t("verification.verified")}</p>
                    <p className="text-sm text-muted-foreground">{t("verification.verifiedDescription")}</p>
                  </div>
                </>
              ) : (
                <>
                  <Badge variant="outline">{t("verification.notVerified")}</Badge>
                  <div>
                    <p className="font-medium">{t("verification.notVerifiedTitle")}</p>
                    <p className="text-sm text-muted-foreground">{t("verification.notVerifiedDescription")}</p>
                  </div>
                </>
              )}
            </div>
            {!user.isVerified && (
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                {t("verification.uploadID")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t("notifications.title")}
          </CardTitle>
          <CardDescription>{t("notifications.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t("notifications.email")}</Label>
              <p className="text-sm text-muted-foreground">{t("notifications.emailDescription")}</p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>{t("notifications.push")}</Label>
              <p className="text-sm text-muted-foreground">{t("notifications.pushDescription")}</p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>{t("notifications.bookingUpdates")}</Label>
              <p className="text-sm text-muted-foreground">{t("notifications.bookingUpdatesDescription")}</p>
            </div>
            <Switch
              checked={notifications.bookingUpdates}
              onCheckedChange={(checked) => setNotifications({ ...notifications, bookingUpdates: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>{t("notifications.messages")}</Label>
              <p className="text-sm text-muted-foreground">{t("notifications.messagesDescription")}</p>
            </div>
            <Switch
              checked={notifications.messages}
              onCheckedChange={(checked) => setNotifications({ ...notifications, messages: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t("language.title")}
          </CardTitle>
          <CardDescription>{t("language.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={locale === "he" ? "default" : "outline"}
              onClick={() => handleLanguageChange("he")}
            >
              עברית
            </Button>
            <Button
              variant={locale === "en" ? "default" : "outline"}
              onClick={() => handleLanguageChange("en")}
            >
              English
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

