import { redirect, RedirectType } from "next/navigation";

export default function UrjaanLegacyRedirect() {
  redirect("/urjayaan", RedirectType.replace);
}
