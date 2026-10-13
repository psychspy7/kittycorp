export type MaintenanceState = {
  enabled: boolean;
  revision: number;
  updated_at: string;
};
export type MaintenanceReply = {
  state?: MaintenanceState;
  error?: string;
  status?: number;
};
export function recoveryPath(pathname: string) {
  return pathname === "/abcdefghijklmnopqrstuvwxyz" ||
    pathname === "/admins" || pathname.startsWith("/admins/") ||
    pathname === "/kitten" || pathname.startsWith("/kitten/") ||
    pathname === "/api/emergency" || pathname === "/api/site-status" ||
    pathname === "/api/security/turnstile" ||
    // Finish verification for an in-flight payment even if maintenance starts.
    pathname === "/account" || /^\/account\/(projects|preorders)\/[a-f0-9-]{36}$/.test(pathname) || pathname === "/api/account" || /^\/api\/account\/(projects|preorders)\/[a-f0-9-]{36}$/.test(pathname) ||
    pathname === "/api/verify-payment" || pathname === "/api/lisa-preorders/status" ||
    ["/api/memberships/verify", "/api/memberships/status", "/api/memberships/webhook", "/api/memberships/cancel"].includes(pathname) ||
    pathname.startsWith("/api/payments/webhooks/") ||
    /^\/api\/payments\/(paypal|cashfree)\/verify$/.test(pathname) ||
    pathname.startsWith("/ecosystem/") ||
    pathname === "/api/admin" || pathname.startsWith("/api/admin/") ||
    pathname === "/maintenance" ||
    pathname.startsWith("/_next/static/") || pathname === "/_next/image" ||
    pathname.startsWith("/brand/") || pathname.startsWith("/fonts/") ||
    pathname === "/favicon.ico" || pathname === "/robots.txt";
}
