import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

/**
 * One axios instance for the whole admin.
 *
 * How sign-in works:
 *  - The ACCESS token (15 min) lives only in memory (this file). Never in localStorage,
 *    so a malicious script can't steal it from storage.
 *  - The REFRESH token is an httpOnly cookie set by the API (JavaScript can't read it).
 *    withCredentials: true lets the browser send it to /v1/auth/refresh.
 *  - On a 401, we refresh ONCE (shared by all requests that failed together) and retry.
 *    If refresh fails -> go to /login?next=<current page>.
 */

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/v1"
).replace(/\/+$/, "");

const HttpRequest = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30_000,
});

// ---------- Access token (memory only) ----------

let accessToken: string | null = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// ---------- Refresh (one at a time) ----------

// Routes that must never trigger a refresh / redirect loop
const AUTH_ROUTES = [
  "/auth/login",
  "/auth/refresh",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/password-token/check",
];
const isAuthRoute = (url?: string) =>
  !!url && AUTH_ROUTES.some((r) => url.includes(r));

let refreshing: Promise<string | null> | null = null;

// Plain axios (not HttpRequest) so the interceptors below don't run on it
export const refreshAccessToken = (): Promise<string | null> => {
  if (!refreshing) {
    refreshing = axios
      .post(`${API_URL}/auth/refresh`, null, {
        withCredentials: true,
        timeout: 15_000,
      })
      .then((res) => {
        setAccessToken(res.data?.accessToken ?? null);
        return accessToken;
      })
      .catch(() => {
        setAccessToken(null);
        return null;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
};

// Pages that don't need a signed-in user
export const PUBLIC_PAGES = ["/login", "/forgot-password", "/set-password"];

export const goToLogin = () => {
  if (typeof window === "undefined") return;
  const { pathname, search } = window.location;
  if (PUBLIC_PAGES.some((p) => pathname.startsWith(p))) return;
  const next = encodeURIComponent(pathname + search);
  window.location.replace(`/login?next=${next}`);
};

// ---------- Interceptors ----------

HttpRequest.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

HttpRequest.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;

    if (
      error.response?.status === 401 &&
      original &&
      !original._retried &&
      !isAuthRoute(original.url)
    ) {
      original._retried = true;
      const token = await refreshAccessToken();
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return HttpRequest(original);
      }
      goToLogin();
    }

    return Promise.reject(error);
  },
);

// ---------- Errors -> one readable sentence ----------

export const getErrorMessage = (
  error: any,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED")
      return "The server took too long to answer. Please try again.";
    if (!error.response)
      return "Can't reach the server. Check your connection.";

    const data: any = error.response.data;
    const message = data?.message ?? data?.error;
    if (Array.isArray(message)) return message[0] ?? fallback; // ValidationPipe -> list of messages
    if (typeof message === "string" && message) return message;

    if (error.response.status === 403)
      return "You don't have permission to do this.";
    if (error.response.status >= 500)
      return "Server error. Please try again in a moment.";
    return fallback;
  }
  return error?.message || fallback;
};

export default HttpRequest;
