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
    dotColor: "bg-blue-400",
    classes: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  INTERVIEW: {
    label: "Interview",
    dotColor: "bg-yellow-400",
    classes: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  OFFER: {
    label: "Offer",
    dotColor: "bg-emerald-400",
    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  REJECTED: {
    label: "Rejected",
    dotColor: "bg-red-400",
    classes: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    dotColor: "bg-slate-400",
    classes: "bg-slate-500/10 text-slate-400 border-slate-500/20",
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
