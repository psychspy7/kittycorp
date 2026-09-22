import type { Metadata } from "next";
import { adminSession } from "@/lib/kitty-server";
import { AdminDashboard, AdminLogin } from "@/components/kitty/admin";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Studio access",
  robots: { index: false, follow: false },
};
export default async function AdminPage() {
  try {
    const session = await adminSession();
    return session ? <AdminDashboard /> : <AdminLogin />;
  } catch {
    return <AdminLogin unavailable />;
  }
}
