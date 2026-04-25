import React, { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Search,
  Briefcase,
  CheckCircle,
  MessageSquare,
  XCircle,
  LayoutGrid,
  List,
  ChevronDown,
} from "lucide-react";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import * as applicationsApi from "../api/applications.api";
import type {
  JobApplication,
  AppStatus,
  CreateApplicationInput,
} from "../types";
import axios from "axios";

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "APPLIED", label: "Applied" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
  { value: "WITHDRAWN", label: "Withdrawn" },
];

export default function DashboardPage() {
  const { user } = useAuth();

  // Data state
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Delete confirmation
  const [deletingJob, setDeletingJob] = useState<JobApplication | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Fetch jobs ────────────────────────────────────────────────────────────

  const fetchJobs = useCallback(async () => {
    setIsLoadingJobs(true);
    setFetchError("");
    try {
      const data = await applicationsApi.getApplications({
        ...(statusFilter && { status: statusFilter }),
        ...(search.trim() && { search: search.trim() }),
      });
      setJobs(data);
    } catch {
      setFetchError("Failed to load applications. Please try again.");
    } finally {
      setIsLoadingJobs(false);
    }
  }, [statusFilter, search]);

  // Debounced fetch when search changes
  useEffect(() => {
    const timer = setTimeout(() => fetchJobs(), 400);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  // ─── Stats ─────────────────────────────────────────────────────────────────

  const stats = {
    total: jobs.length,
    interview: jobs.filter((j) => j.status === "INTERVIEW").length,
    offer: jobs.filter((j) => j.status === "OFFER").length,
    rejected: jobs.filter((j) => j.status === "REJECTED").length,
  };

  // ─── CRUD handlers ─────────────────────────────────────────────────────────

  const handleOpenAdd = () => {
    setEditingJob(null);
    setSaveError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (job: JobApplication) => {
    setEditingJob(job);
    setSaveError("");
    setModalOpen(true);
  };

  const handleSave = async (data: CreateApplicationInput) => {
    setIsSaving(true);
    setSaveError("");
    try {
      if (editingJob) {
        const updated = await applicationsApi.updateApplication(
          editingJob.id,
          data,
        );
        setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
      } else {
        const created = await applicationsApi.createApplication(data);
        setJobs((prev) => [created, ...prev]);
      }
      setModalOpen(false);
      setEditingJob(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setSaveError(
          err.response?.data?.message || "Failed to save. Please try again.",
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingJob) return;
    setIsDeleting(true);
    try {
      await applicationsApi.deleteApplication(deletingJob.id);
      setJobs((prev) => prev.filter((j) => j.id !== deletingJob.id));
      setDeletingJob(null);
    } catch {
      // Silently retry from user perspective
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">
              Good{" "}
              {new Date().getHours() < 12
                ? "morning"
                : new Date().getHours() < 17
                  ? "afternoon"
                  : "evening"}
              , {user?.name?.split(" ")[0]} 👋
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Track and manage all your job applications
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            id="add-job-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/20 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Add Application
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total"
            value={stats.total}
            icon={Briefcase}
            iconColor="text-indigo-400"
            bgColor="bg-indigo-500/15"
            onClick={() => setStatusFilter("")}
            active={statusFilter === ""}
          />
          <StatsCard
            title="Interview"
            value={stats.interview}
            icon={MessageSquare}
            iconColor="text-yellow-400"
            bgColor="bg-yellow-500/15"
            onClick={() => setStatusFilter("INTERVIEW")}
            active={statusFilter === "INTERVIEW"}
          />
          <StatsCard
            title="Offers"
            value={stats.offer}
            icon={CheckCircle}
            iconColor="text-emerald-400"
            bgColor="bg-emerald-500/15"
            onClick={() => setStatusFilter("OFFER")}
            active={statusFilter === "OFFER"}
          />
          <StatsCard
            title="Rejected"
            value={stats.rejected}
            icon={XCircle}
            iconColor="text-red-400"
            bgColor="bg-red-500/15"
            onClick={() => setStatusFilter("REJECTED")}
            active={statusFilter === "REJECTED"}
          />
        </div>

        {/* Filters + View toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              id="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company or position..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer"
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value} className="bg-slate-900">
                  {f.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* View toggle */}
          <div className="flex gap-1 p-1 rounded-lg bg-slate-900 border border-slate-700">
            <button
              onClick={() => setView("grid")}
              id="grid-view-btn"
              className={`p-1.5 rounded-md transition-colors ${
                view === "grid"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              id="list-view-btn"
              className={`p-1.5 rounded-md transition-colors ${
                view === "list"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Error state */}
        {fetchError && (
          <div className="glass rounded-xl p-4 text-center text-red-400 text-sm mb-6">
            {fetchError}
          </div>
        )}

        {/* Jobs grid/list */}
        {isLoadingJobs ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800 mb-4">
              <Briefcase className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              No applications yet
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {search || statusFilter
                ? "No applications match your filters."
                : "Start tracking your job search by adding your first application."}
            </p>
            {!search && !statusFilter && (
              <button
                onClick={handleOpenAdd}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all"
              >
                Add your first application
              </button>
            )}
          </div>
        ) : (
          <div
            className={`
              ${
                view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  : "flex flex-col gap-3"
              }
            `}
          >
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={handleOpenEdit}
                onDelete={setDeletingJob}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add / Edit Modal */}
      <JobModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingJob(null);
          setSaveError("");
        }}
        onSubmit={handleSave}
        initialData={editingJob}
        isLoading={isSaving}
      />
      {saveError && modalOpen && (
        <div className="fixed bottom-4 right-4 z-[60] glass rounded-lg px-4 py-3 text-red-400 text-sm border border-red-500/20">
          {saveError}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDeletingJob(null)}
          />
          <div className="relative glass rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-2">
              Delete Application
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to delete the{" "}
              <span className="font-medium text-slate-200">
                {deletingJob.position}
              </span>{" "}
              at{" "}
              <span className="font-medium text-slate-200">
                {deletingJob.company}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingJob(null)}
                id="cancel-delete-btn"
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                id="confirm-delete-btn"
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-semibold transition-all"
              >
                {isDeleting ? <LoadingSpinner size="sm" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
