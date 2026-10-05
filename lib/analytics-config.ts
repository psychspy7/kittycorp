// A GA4 measurement ID is public. It is not an API key or an administrator secret.
// Use GOOGLE_ANALYTICS_ID=disabled to switch off tracking for a deployment.
export function googleAnalyticsId() {
  const value = process.env.GOOGLE_ANALYTICS_ID?.trim() || "G-9V2T4Z9RJP";
  return /^G-[A-Z0-9]{6,20}$/.test(value) ? value : "";
}
