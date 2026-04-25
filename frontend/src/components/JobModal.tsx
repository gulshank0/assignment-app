import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import type { JobApplication, CreateApplicationInput } from "../types";

const schema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  status: z
    .enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN"])
    .optional(),
  location: z.string().optional(),
  salary: z.string().optional(),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateApplicationInput) => Promise<void>;
  initialData?: JobApplication | null;
  isLoading?: boolean;
}

const STATUS_OPTIONS = [
  { value: "APPLIED", label: "Applied" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
  { value: "WITHDRAWN", label: "Withdrawn" },
] as const;

const inputClass =
  "w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";

const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

const errorClass = "text-xs text-red-400 mt-1";

export default function JobModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: JobModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          company: initialData.company,
          position: initialData.position,
          status: initialData.status,
          location: initialData.location ?? "",
          salary: initialData.salary ?? "",
          url: initialData.url ?? "",
          notes: initialData.notes ?? "",
        }
      : { status: "APPLIED" },
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      reset(
        initialData
          ? {
              company: initialData.company,
              position: initialData.position,
              status: initialData.status,
              location: initialData.location ?? "",
              salary: initialData.salary ?? "",
              url: initialData.url ?? "",
              notes: initialData.notes ?? "",
            }
          : { status: "APPLIED" },
      );
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: FormData) => {
    // Remove empty optional fields
    const cleaned: CreateApplicationInput = {
      company: data.company,
      position: data.position,
      status: data.status,
      ...(data.location && { location: data.location }),
      ...(data.salary && { salary: data.salary }),
      ...(data.url && { url: data.url }),
      ...(data.notes && { notes: data.notes }),
    };
    await onSubmit(cleaned);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold gradient-text">
            {initialData ? "Edit Application" : "Add New Application"}
          </h2>
          <button
            onClick={onClose}
            id="close-modal-btn"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Company + Position */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Company *</label>
              <input
                {...register("company")}
                id="company-input"
                placeholder="e.g. Google"
                className={inputClass}
              />
              {errors.company && (
                <p className={errorClass}>{errors.company.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Position *</label>
              <input
                {...register("position")}
                id="position-input"
                placeholder="e.g. Software Engineer"
                className={inputClass}
              />
              {errors.position && (
                <p className={errorClass}>{errors.position.message}</p>
              )}
            </div>
          </div>

          {/* Status + Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Status</label>
              <select
                {...register("status")}
                id="status-select"
                className={inputClass}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option
                    key={s.value}
                    value={s.value}
                    className="bg-slate-900"
                  >
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                {...register("location")}
                id="location-input"
                placeholder="e.g. Remote / San Francisco"
                className={inputClass}
              />
            </div>
          </div>

          {/* Salary + URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Salary Range</label>
              <input
                {...register("salary")}
                id="salary-input"
                placeholder="e.g. $120k - $160k"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Job URL</label>
              <input
                {...register("url")}
                id="url-input"
                placeholder="https://..."
                className={inputClass}
              />
              {errors.url && <p className={errorClass}>{errors.url.message}</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              {...register("notes")}
              id="notes-input"
              rows={3}
              placeholder="Any notes about this application..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-job-btn"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : null}
              {initialData ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
