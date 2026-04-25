import React from "react";
import {
  Building2,
  MapPin,
  IndianRupee,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { JobApplication, AppStatus } from "../types";

interface JobCardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
  onDelete: (job: JobApplication) => void;
}

const statusAccent: Record<AppStatus, string> = {
  APPLIED: "border-l-white/20",
  INTERVIEW: "border-l-white/40",
  OFFER: "border-l-white/100",
  REJECTED: "border-l-white/10",
  WITHDRAWN: "border-l-white/5",
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  const appliedDate = new Date(job.appliedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`glass rounded-xl p-5 hover:bg-white/[0.07] transition-all duration-200 group border-l-[3px] ${statusAccent[job.status]}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate text-[15px] leading-snug">
            {job.position}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <Building2 className="h-3.5 w-3.5 text-gray-500 shrink-0" />
            <span className="text-sm text-gray-400 truncate">
              {job.company}
            </span>
          </div>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
        {job.location && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            <span>{job.location}</span>
          </div>
        )}
        {job.salary && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <IndianRupee className="h-3 w-3" />
            <span>{job.salary}</span>
          </div>
        )}
        <div
          className="flex items-center gap-1 text-xs text-gray-500"
          title={appliedDate}
        >
          <Calendar className="h-3 w-3" />
          <span>{timeAgo(job.appliedAt)}</span>
        </div>
      </div>

      {/* Notes */}
      {job.notes && (
        <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
          {job.notes}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(job)}
            id={`edit-job-${job.id}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(job)}
            id={`delete-job-${job.id}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View
          </a>
        )}
      </div>
    </div>
  );
}
