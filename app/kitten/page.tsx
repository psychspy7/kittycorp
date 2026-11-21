import type { Metadata } from "next";
import { AdminShell } from "@/components/kitty/admin-shell";

export const revalidate = 86400;
export const metadata: Metadata = { title: "Studio access", robots: { index: false, follow: false } };

export default function StudioPage() {
  return <AdminShell />;
}
