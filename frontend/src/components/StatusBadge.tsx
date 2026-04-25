import React from "react";
import type { AppStatus } from "../types";

interface StatusBadgeProps {
  status: AppStatus;
  size?: "sm" | "md";
}

const config: Record<AppStatus, { label: string; classes: string }> = {
  APPLIED: {
    label: "Applied",
    classes: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  INTERVIEW: {
    label: "Interview",
    classes: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  },
  OFFER: {
    label: "Offer",
    classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  REJECTED: {
    label: "Rejected",
    classes: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    classes: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  },
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const { label, classes } = config[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${classes} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      }`}
    >
      {label}
    </span>
  );
}
