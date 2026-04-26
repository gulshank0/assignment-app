import axios from "axios";

let accessToken: string | null = null;

function resolveApiBaseUrl() {
  const configuredBase =
    import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "";

  if (!configuredBase) return "/api";

  const trimmed = configuredBase.replace(/\/+$/, "");
  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
}

// Axios instance with base URL and credentials
const api = axios.create({
  // Use explicit backend URL in production, fallback to /api proxy in dev.
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

// ─── Request interceptor: attach access token ─────────────────────────────────

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ─── Response interceptor: auto-refresh on 401 ────────────────────────────────

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh for auth endpoints to avoid loops
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      if (isRefreshing) {
        // Queue requests during refresh
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post<{ accessToken: string }>(
          "/auth/refresh",
        );
        accessToken = data.accessToken;
        refreshQueue.forEach((cb) => cb(data.accessToken));
        refreshQueue = [];
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch {
        accessToken = null;
        refreshQueue = [];
        // Redirect to login on refresh failure
        globalThis.location.href = "/login";
        throw error;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  },
);

export default api;
