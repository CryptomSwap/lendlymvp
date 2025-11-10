"use client";

import { LanguageToggle } from "@/components/language-toggle";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { useLocale } from "next-intl";
import { AuthButton } from "@/components/auth-button";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const locale = useLocale();
  const t = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Reserved space at top for animated element */}
      <div className="h-4" />
      <div className="container mx-auto flex h-24 items-center justify-center px-4 relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
          <img
            src="/logo.png"
            alt="לנדלי"
            className="h-24 w-auto"
            onError={(e) => {
              // Fallback to SVG if PNG doesn't exist
              const target = e.target as HTMLImageElement;
              if (target.src.endsWith('.png')) {
                target.src = '/logo.svg';
              }
            }}
          />
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <motion.div
              className="absolute top-4 right-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <Button variant="outline" size="icon" className="h-9 w-9 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="sr-only">Open menu</span>
              </Button>
            </motion.div>
          </SheetTrigger>
          <SheetContent 
            side={locale === "he" ? "left" : "right"}
            disableAnimation={true}
            className="overflow-hidden"
          >
            <motion.div
              key="menu-content"
              initial={{ 
                opacity: 0,
                x: locale === "he" ? -100 : 100
              }}
              animate={{ 
                opacity: 1,
                x: 0
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3
              }}
            >
              <SheetHeader>
                <SheetTitle>{t("menu")}</SheetTitle>
              </SheetHeader>
              <motion.div 
                className="flex flex-col gap-4 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t("language")}</span>
                    <LanguageToggle />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t("theme")}</span>
                    <DarkModeToggle />
                  </div>
                </div>
                <div className="border-t pt-4">
                  <AuthButton />
                </div>
              </motion.div>
            </motion.div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

