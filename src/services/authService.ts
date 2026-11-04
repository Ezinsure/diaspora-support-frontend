import HttpRequest from "@/lib/admin/httpRequest";

const BASE = "/auth";

export const AuthService = {
  login: (data: { email: string; password: string; rememberMe?: boolean }) =>
    HttpRequest.post(`${BASE}/login`, data),

  logout: () => HttpRequest.post(`${BASE}/logout`),

  forgotPassword: (email: string) =>
    HttpRequest.post(`${BASE}/forgot-password`, { email }),

  checkToken: (token: string) =>
    HttpRequest.post(`${BASE}/password-token/check`, { token }),

  resetPassword: (data: { token: string; password: string }) =>
    HttpRequest.post(`${BASE}/reset-password`, data),

  getMe: () => HttpRequest.get(`${BASE}/me`),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    HttpRequest.post(`${BASE}/change-password`, data),

  logoutAll: () => HttpRequest.post(`${BASE}/logout-all`),

  //Admin / dev
  adminSetPassword: (
    userId: string,
    data: { password: string; notifyUser?: boolean },
  ) => HttpRequest.patch(`${BASE}/users/${userId}/password`, data),

  sendPasswordLink: (userId: string) =>
    HttpRequest.post(`${BASE}/users/${userId}/send-password-link`),
};
