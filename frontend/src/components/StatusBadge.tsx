import React from "react";
import type { AppStatus } from "../types";

interface StatusBadgeProps {
  status: AppStatus;
  size?: "sm" | "md";
}

const config: Record<
  AppStatus,
  { label: string; dotColor: string; classes: string }
> = {
  APPLIED: {
    label: "Applied",
    dotColor: "bg-gray-400",
    classes: "bg-gray-300/5 text-gray-400 border-white/10",
  },
  INTERVIEW: {
    label: "Interview",
    dotColor: "bg-gray-200",
    classes: "bg-gray-300/10 text-gray-200 border-white/20",
  },
  OFFER: {
    label: "Offer",
    dotColor: "bg-gray-300",
    classes: "bg-gray-300/20 text-white border-white/40",
  },
  REJECTED: {
    label: "Rejected",
    dotColor: "bg-gray-600",
    classes: "bg-gray-300/5 text-gray-500 border-white/5",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    dotColor: "bg-gray-700",
    classes: "bg-gray-300/5 text-gray-600 border-white/5",
  },
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const { label, dotColor, classes } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${classes} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
}
