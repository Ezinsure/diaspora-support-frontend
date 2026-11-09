import axios from "axios";

/**
 * Axios for the PUBLIC website (no login).
 * Separate from lib/admin/httpRequest: no tokens, no cookies, and a 401 never
 * redirects a visitor to the admin login page.
 */
const PublicHttp = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/v1").replace(/\/+$/, ""),
  timeout: 30_000,
});

export default PublicHttp;