import type { CommerceSettings } from "@/lib/commerce";

// Product memberships were removed from the public site. Keep this component
// as a compatibility no-op for any legacy imports while callers are cleaned up.
export function ProductPlans(_props: { settings: CommerceSettings; only?: "kitty" }) {
  return null;
}
