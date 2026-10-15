export const CONTACT_EMAIL = "kittycorp.info@gmail.com";
export const FOUNDER_LINKEDIN = "https://www.linkedin.com/in/virat-anand-928460442/";
export const isFounderLinkedIn = (url?: string) =>
  !!url && url.replace(/\/+$/, "").toLowerCase() === FOUNDER_LINKEDIN.replace(/\/+$/, "").toLowerCase();
