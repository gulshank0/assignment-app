import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  onClick?: () => void;
  active?: boolean;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor,
  bgColor,
  onClick,
  active,
}: StatsCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        glass rounded-xl p-5 text-left w-full transition-all duration-200
        ${onClick ? "cursor-pointer hover:bg-white/[0.08] hover:scale-[1.02]" : "cursor-default"}
        ${active ? "ring-1 ring-indigo-500/50 bg-white/[0.08] border-indigo-500/30" : ""}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-100 tracking-tight tabular-nums">
            {value}
          </p>
        </div>
        <div className={`p-2.5 rounded-xl ${bgColor}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </button>
  );
}
