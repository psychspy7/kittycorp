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
    pathname === "/ecosystem/google-v1.svg" ||
    pathname === "/api/admin" || pathname.startsWith("/api/admin/") ||
    pathname === "/maintenance" ||
    pathname.startsWith("/_next/static/") || pathname === "/_next/image" ||
    pathname.startsWith("/brand/") || pathname.startsWith("/fonts/") ||
    pathname === "/favicon.ico" || pathname === "/robots.txt";
}
