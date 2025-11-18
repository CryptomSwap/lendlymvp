"use client";

import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  icon?: React.ReactNode;
  variant?: "full" | "inline";
}

export function EmptyState({
  title,
  subtitle,
  ctaLabel,
  ctaHref = "/listings/new",
  icon,
  variant = "full",
}: EmptyStateProps) {
  const IconComponent = icon || (
    <Package className="h-12 w-12 text-[#00A6A6]" />
  );

  if (variant === "inline") {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-slate-500">{title}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 text-center space-y-4">
      <div className="flex justify-center">{IconComponent}</div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {subtitle && (
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            {subtitle}
          </p>
        )}
      </div>
      {ctaLabel && (
        <Link href={ctaHref} className="block">
          <Button className="bg-[#00A6A6] hover:bg-[#008B8B] text-white rounded-full px-6 py-2 font-semibold shadow-sm">
            {ctaLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}

