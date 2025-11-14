"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  Home,
  Package,
  Plus,
  MessageSquare,
  Calendar,
  Heart,
  User,
  CheckCircle2,
  Settings,
  Moon,
  Sun,
  Monitor,
  Bell,
  Globe,
  DollarSign,
  Ruler,
  Shield,
  ShieldCheck,
  LifeBuoy,
  AlertTriangle,
  Camera,
  LogOut,
  ChevronRight,
  X,
  FileText,
  Lock,
  Users,
  Info,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "./MenuItem";
import { SettingsGroup } from "./SettingsGroup";
import { useLocaleDirection } from "./useLocaleDirection";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    trustScore?: number;
    verified?: boolean;
  } | null;
}

export function SideMenu({ isOpen, onClose, user }: SideMenuProps) {
  const { dir, isRTL, locale } = useLocaleDirection();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");
  const tMenu = useTranslations("menu");
  const { theme, setTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Settings state
  const [currency, setCurrency] = useState("ILS");
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency") || "ILS";
    const savedDistanceUnit = localStorage.getItem("distanceUnit") || "km";
    const savedNotifications = localStorage.getItem("notifications") !== "false";
    setCurrency(savedCurrency);
    setDistanceUnit(savedDistanceUnit);
    setNotifications(savedNotifications);
  }, []);

  // Focus trap
  useEffect(() => {
    if (isOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Swipe gesture handling
  const handleDragEnd = useCallback(
    (event: any, info: any) => {
      const threshold = 100;
      const velocity = isRTL ? info.velocity.x : -info.velocity.x;
      const offset = isRTL ? info.offset.x : -info.offset.x;

      if (velocity > 500 || offset > threshold) {
        onClose();
      }
    },
    [onClose, isRTL]
  );

  // Handle navigation
  const handleNavigate = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [router, onClose]
  );

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/");
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Handle language change
  const handleLanguageChange = (newLocale: "he" | "en") => {
    router.replace(pathname, { locale: newLocale });
    // Menu will re-render with new direction
  };

  // Save settings
  const saveSetting = (key: string, value: string | boolean) => {
    localStorage.setItem(key, String(value));
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  // Animation variants based on direction
  const slideVariants = {
    closed: {
      x: isRTL ? "100%" : "-100%",
      opacity: 0,
    },
    open: {
      x: 0,
      opacity: 1,
    },
  };

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const itemVariants = {
    closed: { opacity: 0, x: isRTL ? 20 : -20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.02 },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[45]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <motion.aside
            ref={menuRef}
            id="side-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={slideVariants}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            drag={isRTL ? "x" : "x"}
            dragConstraints={isRTL ? { right: 0, left: -100 } : { left: 0, right: 100 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={`
              fixed top-0 h-screen w-[80vw] max-w-[420px] z-[50]
              bg-gradient-to-b from-[#F9FBFB] to-[#E3F3F3]
              shadow-xl overflow-y-auto
              ${isRTL ? "right-0 rounded-l-2xl" : "left-0 rounded-r-2xl"}
              pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]
            `}
            onClick={(e) => e.stopPropagation()}
            dir={dir}
            role="navigation"
            aria-label={tMenu("navigation")}
          >
            <div className="p-4">
              {/* Header / Profile Block */}
              <motion.div
                custom={0}
                variants={itemVariants}
                initial="closed"
                animate="open"
                className="mb-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12 border-2 border-[#009999]">
                    <AvatarImage src={user?.avatar || undefined} />
                    <AvatarFallback className="bg-[#009999] text-white text-sm font-semibold">
                      {user ? initials : <User className="h-6 w-6" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    {user ? (
                      <>
                        <div className="flex items-center gap-2">
                          <h2 className="font-semibold text-lg truncate">{user.name}</h2>
                          {user.verified && (
                            <Badge variant="outline" className="bg-teal-50 text-[#0E7575] border-[#0E7575] text-xs px-1.5 py-0">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {tMenu("verified")}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </>
                    ) : (
                      <div>
                        <h2 className="font-semibold text-lg">{tMenu("hiSignIn")}</h2>
                        <p className="text-sm text-gray-500">{tMenu("signInPrompt")}</p>
                      </div>
                    )}
                  </div>
                </div>

                {user && (
                  <Button
                    ref={firstFocusableRef}
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => handleNavigate("/profile")}
                  >
                    <span>{tMenu("viewProfile")}</span>
                    {isRTL ? <ChevronRight className="h-4 w-4 rotate-180" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                )}

                {!user && (
                  <div className="flex gap-2">
                    <Button
                      ref={firstFocusableRef}
                      className="flex-1 bg-[#009999] hover:bg-[#0E7575]"
                      onClick={() => handleNavigate("/auth/signin")}
                    >
                      {t("signIn")}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleNavigate("/auth/signin")}
                    >
                      {tMenu("createAccount")}
                    </Button>
                  </div>
                )}

                <div className="border-t border-teal-100 mt-4 pt-4" />
              </motion.div>

              {/* Primary Navigation */}
              <motion.div
                custom={1}
                variants={itemVariants}
                initial="closed"
                animate="open"
                className="mb-6"
              >
                <MenuItem
                  icon={<Home className="h-5 w-5" />}
                  label={t("home")}
                  href="/"
                  onClick={onClose}
                  ariaLabel={t("home")}
                />
                {user && (
                  <>
                    <MenuItem
                      icon={<Package className="h-5 w-5" />}
                      label={tMenu("myRentals")}
                      href="/listings"
                      onClick={onClose}
                      ariaLabel={tMenu("myRentals")}
                    />
                    <MenuItem
                      icon={<Plus className="h-5 w-5" />}
                      label={tMenu("listYourGear")}
                      href="/listings/new"
                      onClick={onClose}
                      ariaLabel={tMenu("listYourGear")}
                    />
                    <MenuItem
                      icon={<MessageSquare className="h-5 w-5" />}
                      label={t("messages")}
                      href="/messages"
                      onClick={onClose}
                      ariaLabel={t("messages")}
                    />
                    <MenuItem
                      icon={<Calendar className="h-5 w-5" />}
                      label={t("bookings")}
                      href="/bookings"
                      onClick={onClose}
                      ariaLabel={t("bookings")}
                    />
                    <MenuItem
                      icon={<Heart className="h-5 w-5" />}
                      label={tMenu("saved")}
                      href="/saved"
                      onClick={onClose}
                      ariaLabel={tMenu("saved")}
                    />
                  </>
                )}
              </motion.div>

              {/* Shortcuts / Utilities */}
              {user && (
                <motion.div
                  custom={2}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  className="mb-6"
                >
                  <div className="flex flex-wrap gap-2 px-2" dir={dir}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 rounded-full border-teal-200 hover:bg-teal-50"
                      onClick={() => handleNavigate("/scan-id")}
                    >
                      <Camera className={`h-3 w-3 ${isRTL ? "ml-1.5" : "mr-1.5"}`} />
                      {tMenu("scanId")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 rounded-full border-teal-200 hover:bg-teal-50"
                      onClick={() => handleNavigate("/verify-account")}
                    >
                      <ShieldCheck className={`h-3 w-3 ${isRTL ? "ml-1.5" : "mr-1.5"}`} />
                      {tMenu("verifyAccount")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 rounded-full border-teal-200 hover:bg-teal-50"
                      onClick={() => handleNavigate("/help")}
                    >
                      <LifeBuoy className={`h-3 w-3 ${isRTL ? "ml-1.5" : "mr-1.5"}`} />
                      {tMenu("help")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 rounded-full border-teal-200 hover:bg-teal-50"
                      onClick={() => handleNavigate("/report-issue")}
                    >
                      <AlertTriangle className={`h-3 w-3 ${isRTL ? "ml-1.5" : "mr-1.5"}`} />
                      {tMenu("reportIssue")}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Settings */}
              <motion.div
                custom={3}
                variants={itemVariants}
                initial="closed"
                animate="open"
                className="space-y-6 mb-6"
              >
                <SettingsGroup title={tMenu("preferences")}>
                  {/* Theme */}
                  <div className="px-2 py-2">
                    <Label className="text-sm mb-2 block">{t("theme")}</Label>
                    <RadioGroup
                      value={theme || "system"}
                      onValueChange={(value) => {
                        setTheme(value as "light" | "dark" | "system");
                        saveSetting("theme", value);
                      }}
                      className="flex gap-2"
                    >
                      <label
                        htmlFor="theme-light"
                        className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                          theme === "light"
                            ? "bg-teal-50 border-[#009999] text-[#009999]"
                            : "hover:bg-teal-50 border-gray-200"
                        }`}
                      >
                        <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                        <Sun className="h-4 w-4" />
                        <span className="text-xs">{t("lightMode")}</span>
                      </label>
                      <label
                        htmlFor="theme-dark"
                        className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                          theme === "dark"
                            ? "bg-teal-50 border-[#009999] text-[#009999]"
                            : "hover:bg-teal-50 border-gray-200"
                        }`}
                      >
                        <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                        <Moon className="h-4 w-4" />
                        <span className="text-xs">{t("darkMode")}</span>
                      </label>
                      <label
                        htmlFor="theme-system"
                        className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                          theme === "system"
                            ? "bg-teal-50 border-[#009999] text-[#009999]"
                            : "hover:bg-teal-50 border-gray-200"
                        }`}
                      >
                        <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                        <Monitor className="h-4 w-4" />
                        <span className="text-xs">{tMenu("system")}</span>
                      </label>
                    </RadioGroup>
                  </div>

                  {/* Notifications */}
                  <div className="px-2 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="notifications" className="text-sm cursor-pointer">
                        {tMenu("notifications")}
                      </Label>
                    </div>
                    <Checkbox
                      id="notifications"
                      checked={notifications}
                      onCheckedChange={(checked) => {
                        setNotifications(checked as boolean);
                        saveSetting("notifications", checked);
                      }}
                    />
                  </div>

                  {/* Language */}
                  <div className="px-2 py-2">
                    <Label className="text-sm mb-2 block">{t("language")}</Label>
                    <Select
                      value={locale}
                      onValueChange={(value) => handleLanguageChange(value as "he" | "en")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="he">עברית</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Currency */}
                  <div className="px-2 py-2">
                    <Label className="text-sm mb-2 block">{tMenu("currency")}</Label>
                    <Select
                      value={currency}
                      onValueChange={(value) => {
                        setCurrency(value);
                        saveSetting("currency", value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ILS">₪ ILS</SelectItem>
                        <SelectItem value="USD">$ USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Distance Units */}
                  <div className="px-2 py-2">
                    <Label className="text-sm mb-2 block">{tMenu("distanceUnits")}</Label>
                    <Select
                      value={distanceUnit}
                      onValueChange={(value) => {
                        setDistanceUnit(value);
                        saveSetting("distanceUnit", value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="km">{tMenu("kilometers")}</SelectItem>
                        <SelectItem value="mi">{tMenu("miles")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </SettingsGroup>

                {user && (
                  <SettingsGroup title={tMenu("privacySecurity")}>
                    <div className="px-2 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{tMenu("idVerification")}</span>
                        </div>
                        {user.verified ? (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {tMenu("verified")}
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            {tMenu("startVerification")}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="px-2 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-gray-500" />
                        <Label htmlFor="twoFactor" className="text-sm cursor-pointer">
                          {tMenu("twoFactorAuth")}
                        </Label>
                      </div>
                      <Checkbox
                        id="twoFactor"
                        checked={twoFactor}
                        onCheckedChange={(checked) => setTwoFactor(checked as boolean)}
                      />
                    </div>

                    <MenuItem
                      icon={<Users className="h-4 w-4" />}
                      label={tMenu("blockedUsers")}
                      href="/blocked-users"
                      onClick={onClose}
                      showChevron={true}
                    />
                  </SettingsGroup>
                )}

                <SettingsGroup title={tMenu("about")}>
                  <MenuItem
                    icon={<FileText className="h-4 w-4" />}
                    label={tMenu("termsOfService")}
                    href="/terms-of-service"
                    onClick={onClose}
                    showChevron={true}
                  />
                  <MenuItem
                    icon={<Shield className="h-4 w-4" />}
                    label={tMenu("privacyPolicy")}
                    href="/privacy-policy"
                    onClick={onClose}
                    showChevron={true}
                  />
                  <MenuItem
                    icon={<Info className="h-4 w-4" />}
                    label={tMenu("insuranceTerms")}
                    href="/insurance-terms"
                    onClick={onClose}
                    showChevron={true}
                  />
                  <div className="px-2 py-2 text-xs text-gray-500">
                    {tMenu("appVersion")}: 1.0.0
                  </div>
                </SettingsGroup>
              </motion.div>

              {/* Account Actions */}
              {user && (
                <motion.div
                  custom={4}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  className="border-t border-teal-100 pt-4"
                >
                  <MenuItem
                    icon={<LogOut className="h-5 w-5" />}
                    label={t("signOut")}
                    onClick={handleSignOut}
                    variant="destructive"
                    showChevron={false}
                    ariaLabel={t("signOut")}
                  />
                </motion.div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

