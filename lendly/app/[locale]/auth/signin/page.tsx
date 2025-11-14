"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Loader2, Mail, CheckCircle2, AlertCircle, Send, Clock } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

type AuthState = "idle" | "loading" | "success" | "error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Common email domains for validation hints
const COMMON_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com",
  "mail.com", "protonmail.com", "aol.com", "live.com", "msn.com",
  "walla.co.il", "gmail.co.il", "walla.com"
];

const isUnusualDomain = (email: string): boolean => {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return !COMMON_DOMAINS.some(common => domain.includes(common));
};

function SignInForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<AuthState>("idle");
  const [error, setError] = useState<string>("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [sentEmail, setSentEmail] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const isRTL = locale === "he";
  const emailInputRef = useRef<HTMLInputElement>(null);
  const ariaLiveRef = useRef<HTMLDivElement>(null);

  // Check for OAuth errors in URL
  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      setError(oauthError === "access_denied" ? t("serverError") : oauthError);
      setState("error");
      toast.error(oauthError === "access_denied" ? t("serverError") : oauthError);
    }
  }, [searchParams, t]);

  const isValidEmail = EMAIL_REGEX.test(email);
  const canSubmit = isValidEmail && state !== "loading" && state !== "success";

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Announce to screen readers
  const announceToScreenReader = (message: string) => {
    if (ariaLiveRef.current) {
      ariaLiveRef.current.textContent = message;
      setTimeout(() => {
        if (ariaLiveRef.current) {
          ariaLiveRef.current.textContent = "";
        }
      }, 1000);
    }
  };

  const validateEmail = (emailValue: string): string | null => {
    if (!emailValue.trim()) {
      return t("emailRequired");
    }
    if (!EMAIL_REGEX.test(emailValue)) {
      return t("invalidEmail");
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      setState("error");
      announceToScreenReader(validationError);
      emailInputRef.current?.focus();
      return;
    }

    setState("loading");
    setError("");
    announceToScreenReader(t("sending"));

    try {
      const response = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMessage = t("serverError");
        
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get("Retry-After") || "60");
          errorMessage = t("rateLimited", { seconds: retryAfter });
          setResendCountdown(retryAfter);
        } else if (result.error) {
          errorMessage = result.error;
        }
        
        setError(errorMessage);
        setState("error");
        toast.error(errorMessage);
        announceToScreenReader(errorMessage);
        return;
      }

      // Success
      setSentEmail(email);
      setState("success");
      setResendCountdown(30);
      announceToScreenReader(t("linkSentTitle"));
      
      // In dev, show the magic link in a toast
      if (process.env.NODE_ENV === "development" && result.token) {
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
      } else {
        toast.success(t("linkSentTitle"));
      }
    } catch (err: any) {
      const errorMessage = err.message?.includes("fetch") 
        ? t("networkError") 
        : t("serverError");
      setError(errorMessage);
      setState("error");
      toast.error(errorMessage);
      announceToScreenReader(errorMessage);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0 || !sentEmail) return;
    
    setState("loading");
    setError("");
    
    try {
      const response = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sentEmail }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get("Retry-After") || "60");
          setResendCountdown(retryAfter);
          setError(t("rateLimited", { seconds: retryAfter }));
        } else {
          setError(t("serverError"));
        }
        setState("error");
        toast.error(t("serverError"));
        return;
      }

      setResendCountdown(30);
      toast.success(t("linkSentTitle"));
      announceToScreenReader(t("linkSentTitle"));
    } catch (err) {
      setError(t("networkError"));
      setState("error");
      toast.error(t("networkError"));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear error when user starts typing
    if (error && value) {
      setError("");
      setState("idle");
    }
  };

  const handleEmailBlur = () => {
    if (email && !isValidEmail) {
      setError(t("invalidEmail"));
    } else if (email && isValidEmail && isUnusualDomain(email)) {
      // Show subtle hint for unusual domains but don't block submission
      // This is handled in the UI with a subtle message
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    // Pass locale in the state parameter
    window.location.href = `/api/auth/google?locale=${locale}`;
  };

  return (
    <div 
      className="h-screen flex items-start justify-center px-4 sm:px-6 pt-4 pb-4 overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #F7FAFA 0%, #E3F3F3 100%)",
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* ARIA Live Region for screen readers */}
      <div
        ref={ariaLiveRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-[420px]"
      >
        <Card className="shadow-lg border-0 rounded-2xl overflow-hidden max-h-[calc(100vh-2rem)] overflow-y-auto">
          <CardContent className="p-5 sm:p-6">
            <AnimatePresence mode="wait">
              {state === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="text-center space-y-3"
                >
                  {/* Success Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.1
                    }}
                    className="flex justify-center pb-1"
                  >
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-green-600" strokeWidth={2.5} />
                    </div>
                  </motion.div>

                  {/* Success Content */}
                  <div className="space-y-1.5">
                    <h1 className="text-xl font-semibold text-[#0F172A]">
                      {t("linkSentTitle")}
                    </h1>
                    <p className="text-[#475569] text-xs leading-relaxed">
                      {t("linkSentMessage")}
                    </p>
                    <div className="pt-0.5">
                      <p className="text-xs font-medium text-[#009999] break-all">
                        {sentEmail}
                      </p>
                    </div>
                  </div>

                  {/* Resend Button */}
                  <div className="pt-2">
                    {resendCountdown > 0 ? (
                      <Button
                        variant="outline"
                        disabled
                        className="w-full h-11 text-sm"
                      >
                        <Clock className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                        {t("resendAvailableIn", { seconds: resendCountdown })}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleResend}
                        className="w-full h-11 text-sm bg-[#009999] hover:bg-[#00A7A7]"
                        disabled={state === "loading"}
                      >
                        {state === "loading" ? (
                          <>
                            <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? "ml-2" : "mr-2"}`} />
                            {t("sending")}
                          </>
                        ) : (
                          <>
                            <Send className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                            {t("resendLink")}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {/* Header */}
                  <div className="space-y-1 text-center">
                    <h1 className="text-xl font-semibold text-[#0F172A]">
                      {t("signIn")}
                    </h1>
                    <p className="text-xs text-[#475569]">
                      {t("subtitle")}
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                    {/* Email Field */}
                    <div className="space-y-1">
                      <Label 
                        htmlFor="email" 
                        className="text-xs font-medium text-[#0F172A] block text-center"
                      >
                        {t("email")}
                      </Label>
                      <div className="relative">
                        <Input
                          ref={emailInputRef}
                          id="email"
                          type="email"
                          inputMode="email"
                          autoCapitalize="off"
                          autoCorrect="off"
                          autoComplete="email"
                          placeholder={t("emailPlaceholder")}
                          value={email}
                          onChange={handleEmailChange}
                          onBlur={handleEmailBlur}
                          disabled={state === "loading"}
                          dir="ltr"
                          className={`
                            h-11 text-sm
                            ${error 
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                              : "border-gray-200 focus:border-[#009999] focus:ring-[#009999]"
                            }
                            transition-all duration-200
                            ${state === "loading" ? "opacity-60" : ""}
                          `}
                          aria-invalid={!!error}
                          aria-describedby={error ? "email-error" : undefined}
                        />
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full mt-1 flex items-center gap-1 justify-center w-full"
                          >
                            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                            <span 
                              id="email-error"
                              className="text-xs text-red-600"
                              role="alert"
                            >
                              {error}
                            </span>
                          </motion.div>
                        )}
                        {!error && email && isValidEmail && isUnusualDomain(email) && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full mt-1 flex items-center gap-1 justify-center w-full"
                          >
                            <span 
                              className="text-xs text-[#94A3B8]"
                            >
                              {t("checkEmailHint")}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={!canSubmit}
                      className={`
                        w-full h-11 text-sm font-medium rounded-xl
                        bg-[#009999] hover:bg-[#00A7A7] 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-200
                        shadow-sm hover:shadow-md
                        active:scale-[0.98]
                      `}
                      aria-label={t("sendMagicLink")}
                    >
                      {state === "loading" ? (
                        <>
                          <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? "ml-2" : "mr-2"}`} />
                          {t("sending")}
                        </>
                      ) : (
                        <>
                          <Mail className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                          {t("sendMagicLink")}
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="relative py-1.5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-[#94A3B8]">
                        {isRTL ? "או" : "OR"}
                      </span>
                    </div>
                  </div>

                  {/* Google Sign In Button */}
                  <Button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading || state === "loading"}
                    variant="outline"
                    className={`
                      w-full h-11 text-sm font-medium rounded-xl
                      border-2 border-gray-200 hover:border-gray-300
                      bg-white hover:bg-gray-50
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200
                      shadow-sm hover:shadow-md
                      active:scale-[0.98]
                      text-[#0F172A]
                    `}
                    aria-label={t("signInWithGoogle")}
                  >
                    {isGoogleLoading ? (
                      <>
                        <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? "ml-2" : "mr-2"}`} />
                        {t("sending")}
                      </>
                    ) : (
                      <>
                        <svg
                          className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`}
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        {t("signInWithGoogle")}
                      </>
                    )}
                  </Button>

                  {/* Legal Text */}
                  <p className="text-[10px] text-[#94A3B8] text-center leading-tight pt-0.5">
                    {isRTL ? (
                      <>
                        בלחיצה אתה מאשר את{" "}
                        <Link 
                          href="/terms-of-service" 
                          className="text-[#009999] hover:underline"
                        >
                          {t("termsOfService")}
                        </Link>
                        {" ו-"}
                        <Link 
                          href="/privacy-policy" 
                          className="text-[#009999] hover:underline"
                        >
                          {t("privacyPolicy")}
                        </Link>
                        {"."}
                      </>
                    ) : (
                      <>
                        By clicking, you agree to our{" "}
                        <Link 
                          href="/terms-of-service" 
                          className="text-[#009999] hover:underline"
                        >
                          {t("termsOfService")}
                        </Link>
                        {" and "}
                        <Link 
                          href="/privacy-policy" 
                          className="text-[#009999] hover:underline"
                        >
                          {t("privacyPolicy")}
                        </Link>
                        {"."}
                      </>
                    )}
                  </p>

                  {/* Help Link */}
                  <div className="text-center pt-0.5">
                    <Link
                      href="/contact"
                      className="text-xs text-[#475569] hover:text-[#009999] transition-colors"
                    >
                      {t("needHelp")} {t("contactUs")}
                    </Link>
                  </div>

                  {/* Dev Mode Quick Sign In */}
                  {typeof window !== "undefined" && (
                    <div className="pt-4 border-t border-gray-200">
                      <Link href="/auth/dev-signin">
                        <Button
                          variant="ghost"
                          className="w-full text-xs text-muted-foreground"
                        >
                          🧪 Dev Mode: Quick Sign In
                        </Button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div 
        className="h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(to bottom, #F7FAFA 0%, #E3F3F3 100%)",
        }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-[#009999]" />
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
