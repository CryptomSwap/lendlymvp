"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface OwnerSectionProps {
  owner: {
    id: string;
    name: string;
    avatar?: string | null;
    trustScore?: number;
    verified?: boolean;
  };
  className?: string;
}

export function OwnerSection({ owner, className }: OwnerSectionProps) {
  const router = useRouter();
  const t = useTranslations("listing");
  const initials = owner.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className={cn("space-y-4 pb-4 border-b border-[#E6F3F3]", className)}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={owner.avatar || undefined} alt={owner.name} />
          <AvatarFallback className="bg-[#E6F3F3] text-[#0F172A] font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-[#0F172A]">{owner.name}</h3>
            {owner.verified && (
              <Badge
                variant="secondary"
                className="bg-[#2ECC71]/10 text-[#2ECC71] border-[#2ECC71]/20 px-2 py-0.5 text-xs"
              >
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {t("verified")}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => router.push(`/profile/${owner.id}`)}
        className="text-sm text-[#009999] hover:text-[#0C7C7B] transition-colors font-medium"
      >
        {t("showMoreFromOwner")}
      </button>
    </motion.div>
  );
}

