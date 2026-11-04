export const SUPPORT_EMAIL = "support@thekittycorp.com";
export const SOCIAL_EMAIL = "social@thekittycorp.com";
export const PRIMARY_ADMIN_EMAIL = "kittycorp.info@gmail.com";
export const CONTACT_EMAIL = SUPPORT_EMAIL;
export const INTERNAL_NOTIFICATION_EMAILS = [
  PRIMARY_ADMIN_EMAIL,
  SOCIAL_EMAIL,
] as const;
export const GOOGLE_CALENDAR_ACCOUNT = PRIMARY_ADMIN_EMAIL;
export const FOUNDER_LINKEDIN = "https://www.linkedin.com/in/virat-anand-928460442/";
export const isFounderLinkedIn = (url?: string) => {
  if (!url) return false;
  const normalize = (value: string) => value.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/+$/, "").toLowerCase();
  return normalize(url) === normalize(FOUNDER_LINKEDIN);
};
