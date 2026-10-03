export const journalCategories = ["AI", "Robotics", "Engineering", "Research", "Company"] as const;
export type JournalEntry = { id: string; slug: string; title: string; summary: string; body: string; category: typeof journalCategories[number]; kind: "article" | "update"; status: string; cover_url: string; cover_alt: string; entry_date: string; published: boolean; created_at: string; updated_at: string };
export type EarlyAccessEntry = { id: string; email: string; interests: string[]; created_at: string };
export function entryDate(value: string) { return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value)); }
