// Shared types for the frontend application

export type AppStatus =
  | "APPLIED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

export interface JobApplication {
  id: string;
  userId: string;
  company: string;
  position: string;
  status: AppStatus;
  location?: string;
  salary?: string;
  url?: string;
  notes?: string;
  appliedAt: string;
  updatedAt: string;
}

export interface CreateApplicationInput {
  company: string;
  position: string;
  status?: AppStatus;
  location?: string;
  salary?: string;
  url?: string;
  notes?: string;
}

export type UpdateApplicationInput = Partial<CreateApplicationInput>;

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface ApiError {
  message: string;
  errors?: { field: string; message: string }[];
}
