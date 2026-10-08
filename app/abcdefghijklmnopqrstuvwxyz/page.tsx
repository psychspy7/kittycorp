import type { Metadata } from "next";
import { EmergencyControl } from "@/components/kitty/emergency-control";
import "../emergency.css";
export const metadata: Metadata = {
  title: "Site control", robots: { index: false, follow: false },
};
export default function EmergencyPage() { return <EmergencyControl />; }
