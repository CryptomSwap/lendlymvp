"use client";

import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface IssuesSectionProps {
  issueCount: number;
  className?: string;
  onLearnMore?: () => void;
}

export function IssuesSection({ issueCount, className, onLearnMore }: IssuesSectionProps) {
  const t = useTranslations("listing");
  
  if (issueCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className={cn(
        "rounded-md bg-[#FFF4CC] p-3 flex items-start gap-2",
        className
      )}
    >
      <AlertTriangle className="h-4 w-4 text-[#F59E0B] mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-[#0F172A]">
          {issueCount === 1
            ? "לפריט זה יש הערה אחת"
            : `לפריט זה יש ${issueCount} הערות`}
        </p>
        {onLearnMore && (
          <button
            onClick={onLearnMore}
            className="text-xs text-[#009999] hover:text-[#0C7C7B] mt-1 font-medium"
          >
            למידע נוסף
          </button>
        )}
      </div>
    </motion.div>
  );
}

