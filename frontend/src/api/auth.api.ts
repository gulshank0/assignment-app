import api, { setAccessToken } from "./axiosInstance";
import type { AuthResponse, User } from "../types";

/**
 * Sign up a new user. Returns the user object and an access token.
 */
export async function signup(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/signup", data);
  setAccessToken(res.data.accessToken);
  return res.data;
}

/**
 * Log in an existing user.
 */
export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/login", data);
  setAccessToken(res.data.accessToken);
  return res.data;
}

/**
 * Silently refresh the access token using the httpOnly refresh cookie.
 * Call on app initialization.
 */
export async function refreshToken(): Promise<string> {
  const res = await api.post<{ accessToken: string }>("/auth/refresh");
  setAccessToken(res.data.accessToken);
  return res.data.accessToken;
}

/**
 * Log out — clears the refresh token cookie server-side.
 */
export async function logout(): Promise<void> {
  await api.post("/auth/logout");
  setAccessToken(null);
}

/**
 * Get the currently authenticated user.
 */
export async function getMe(): Promise<User> {
  const res = await api.get<{ user: User }>("/auth/me");
  return res.data.user;
}
