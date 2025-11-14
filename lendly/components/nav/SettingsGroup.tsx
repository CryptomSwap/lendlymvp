"use client";

import { ReactNode } from "react";

interface SettingsGroupProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function SettingsGroup({ title, children, className = "" }: SettingsGroupProps) {
  return (
    <div className={className}>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

