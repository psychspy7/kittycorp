import type { Metadata } from "next";
import { adminSession } from "@/lib/kitty-server";
import { AdminDashboard, AdminLogin } from "@/components/kitty/admin";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Studio access", robots: { index: false, follow: false } };
export default async function StudioPage() {
  let session=null;
  let unavailable=false;
  try { session=await adminSession(); }
  catch { unavailable=true; }
  return session ? <AdminDashboard /> : <AdminLogin unavailable={unavailable} />;
}
