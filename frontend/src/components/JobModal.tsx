import React, { useEffect, useRef } from "react";
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
  "w-full px-3 py-2.5 rounded-lg bg-black border border-white/20 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/60 transition-all duration-200";

const labelClass = "block text-sm font-medium text-gray-300 mb-1.5";

const errorClass = "text-xs text-white/80 mt-1";

export default function JobModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: JobModalProps) {
  const firstInputRef = useRef<HTMLInputElement>(null);

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
      // Focus first input after a short delay for animation
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen, initialData, reset]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleFormSubmit = async (data: FormData) => {
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
      <div className="relative w-full max-w-lg glass rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-modal-enter">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">
              {initialData ? "Edit Application" : "New Application"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {initialData
                ? "Update the details below"
                : "Fill in the details to track a new application"}
            </p>
          </div>
          <button
            onClick={onClose}
            id="close-modal-btn"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-300/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Company + Position */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Company <span className="text-white/70">*</span>
              </label>
              <input
                {...register("company")}
                ref={(e) => {
                  register("company").ref(e);
                  (
                    firstInputRef as React.MutableRefObject<HTMLInputElement | null>
                  ).current = e;
                }}
                id="company-input"
                placeholder="e.g. Google"
                className={inputClass}
              />
              {errors.company && (
                <p className={errorClass}>{errors.company.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>
                Position <span className="text-white/70">*</span>
              </label>
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
                    className="bg-black text-white"
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
                placeholder="e.g. ₹5,00,000"
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
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-job-btn"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-300 hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed text-black text-sm font-semibold transition-all"
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
