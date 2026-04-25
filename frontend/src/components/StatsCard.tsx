import React from "react";
import { LucideIcon } from "lucide-react";

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
        ${onClick ? "cursor-pointer glass-hover" : "cursor-default"}
        ${active ? "ring-1 ring-indigo-500/50 bg-white/10" : ""}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-100">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${bgColor}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </button>
  );
}
