import { NextResponse, type NextRequest } from "next/server";
import { recoveryPath } from "@/lib/maintenance";
import { maintenanceState } from "@/lib/maintenance-state";
import { maintenanceResponse } from "@/lib/maintenance-screen";

export async function proxy(request: NextRequest) {
  if (recoveryPath(request.nextUrl.pathname)) return NextResponse.next();
  let offline = true;
  try { offline = (await maintenanceState()).enabled; } catch {
    // A missing status must not silently reopen a site taken offline.
  }
  if (!offline) return NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/api/"))
    return NextResponse.json({ error: "Site in maintenance. Please try again shortly." }, {
      status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "60" },
    });
  return maintenanceResponse();
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|brand/|fonts/|favicon.ico).*)"],
};
