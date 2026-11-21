import { NextResponse, type NextRequest } from "next/server";
import { recoveryPath } from "@/lib/maintenance";
import { maintenanceState } from "@/lib/maintenance-state";
import { maintenanceResponse } from "@/lib/maintenance-screen";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedOrApi =
    pathname.startsWith("/account") || pathname.startsWith("/admins") || pathname.startsWith("/api");

  // Early-return immediately for public marketing routes (zero DB or async work)
  if (!isProtectedOrApi) {
    const host = request.nextUrl.hostname.toLowerCase();
    const isVercelPreview = host.endsWith(".vercel.app") && host !== "kittycorp.vercel.app";
    const response = NextResponse.next();
    if (isVercelPreview) response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return response;
  }

  // Work only on /account, /admins, and /api/*
  if (recoveryPath(pathname)) return NextResponse.next();
  const host = request.nextUrl.hostname.toLowerCase();
  const isVercelPreview = host.endsWith(".vercel.app") && host !== "kittycorp.vercel.app";
  let offline = true;
  try {
    offline = (await maintenanceState()).enabled;
  } catch {
    // A missing status must not silently reopen a site taken offline.
  }
  if (!offline) {
    const response = NextResponse.next();
    if (isVercelPreview) response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return response;
  }
  if (pathname.startsWith("/api/"))
    return NextResponse.json(
      { error: "Site in maintenance. Please try again shortly." },
      {
        status: 503,
        headers: { "Cache-Control": "no-store", "Retry-After": "60" },
      }
    );
  return maintenanceResponse();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|brand/|fonts/|ecosystem/|favicon.ico).*)"],
};
