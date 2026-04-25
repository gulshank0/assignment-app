import api from "./axiosInstance";
import type {
  JobApplication,
  CreateApplicationInput,
  UpdateApplicationInput,
} from "../types";

/**
 * Fetch all job applications for the current user.
 */
export async function getApplications(params?: {
  status?: string;
  search?: string;
}): Promise<JobApplication[]> {
  const res = await api.get<JobApplication[]>("/applications", { params });
  return res.data;
}

/**
 * Fetch a single job application by ID.
 */
export async function getApplication(id: string): Promise<JobApplication> {
  const res = await api.get<JobApplication>(`/applications/${id}`);
  return res.data;
}

/**
 * Create a new job application.
 */
export async function createApplication(
  data: CreateApplicationInput,
): Promise<JobApplication> {
  const res = await api.post<JobApplication>("/applications", data);
  return res.data;
}

/**
 * Update an existing job application.
 */
export async function updateApplication(
  id: string,
  data: UpdateApplicationInput,
): Promise<JobApplication> {
  const res = await api.patch<JobApplication>(`/applications/${id}`, data);
  return res.data;
}

/**
 * Delete a job application.
 */
export async function deleteApplication(id: string): Promise<void> {
  await api.delete(`/applications/${id}`);
}
