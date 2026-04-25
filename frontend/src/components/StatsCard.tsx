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
        ${onClick ? "cursor-pointer hover:bg-gray-300/[0.08] hover:scale-[1.02]" : "cursor-default"}
        ${active ? "ring-2 ring-white bg-gray-300/[0.1] border-white/40" : "border-white/10"}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1 font-medium">{title}</p>
          <p className="text-3xl font-bold text-white tracking-tight tabular-nums">
            {value}
          </p>
        </div>
        <div
          className={`p-2.5 rounded-xl ${bgColor.includes("bg") ? (active ? "bg-gray-300" : "bg-gray-300/10") : bgColor}`}
        >
          <Icon
            className={`h-5 w-5 ${iconColor.includes("text") ? (active ? "text-black" : "text-white") : iconColor}`}
          />
        </div>
      </div>
    </button>
  );
}
