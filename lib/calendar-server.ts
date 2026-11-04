import "server-only";
import { GOOGLE_CALENDAR_ACCOUNT } from "./company-contact";

export interface AppointmentDetails {
  name: string;
  email: string;
  day: string; // YYYY-MM-DD
  time: string; // HH:mm
  zone?: string;
  topic: string;
  reference: string;
}

export interface CalendarStagingResult {
  ok: boolean;
  staged: boolean;
  reason?: string;
  eventId?: string;
}

export function isCalendarConfigured(): boolean {
  const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN?.trim();
  const clientId = (
    process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GOOGLE_CLIENT_ID
  )?.trim();
  const clientSecret = (
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET
  )?.trim();

  return Boolean(refreshToken && clientId && clientSecret);
}

async function getCalendarAccessToken(): Promise<string | null> {
  const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN?.trim();
  const clientId = (
    process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GOOGLE_CLIENT_ID
  )?.trim();
  const clientSecret = (
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET
  )?.trim();

  if (!refreshToken || !clientId || !clientSecret) return null;

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error(
        `[Kitty Corp] Google Calendar token exchange failed: HTTP ${response.status}`,
      );
      return null;
    }

    const data = (await response.json()) as { access_token?: string };
    return data.access_token || null;
  } catch (error) {
    console.error(
      "[Kitty Corp] Google Calendar token exchange error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return null;
  }
}

function sanitizeCalendarEventId(ref: string): string {
  // Google Calendar event ID must be between 5 and 1024 characters
  // and only contain characters from the base32hex alphabet (0-9, a-v)
  const clean = ref.toLowerCase().replace(/[^0-9a-v]/g, "");
  return `kc${clean}`.slice(0, 64);
}

export async function stageAppointmentCalendarEvent(
  details: AppointmentDetails,
): Promise<CalendarStagingResult> {
  if (!isCalendarConfigured()) {
    return {
      ok: true,
      staged: false,
      reason: "Google Calendar offline integration credentials pending in environment.",
    };
  }

  const token = await getCalendarAccessToken();
  if (!token) {
    return {
      ok: true,
      staged: false,
      reason: "Could not obtain Google Calendar authorization token.",
    };
  }

  try {
    const zone = details.zone || "Asia/Kolkata";
    // Build ISO timestamps for 45-minute tentative slot
    const startIso = `${details.day}T${details.time}:00`;
    const [hours, minutes] = details.time.split(":").map(Number);
    const endMinutesTotal = (hours || 0) * 60 + (minutes || 0) + 45;
    const endHours = Math.floor(endMinutesTotal / 60) % 24;
    const endMins = endMinutesTotal % 60;
    const endIso = `${details.day}T${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}:00`;

    const eventId = sanitizeCalendarEventId(details.reference);

    const payload = {
      id: eventId.length >= 5 ? eventId : undefined,
      summary: `[APPOINTMENT REQUEST] ${details.name} — KITTY CORP`,
      description: `Appointment Request Details\n\nClient Name: ${details.name}\nEmail: ${details.email}\nTopic: ${details.topic}\nReference: ${details.reference}\nPreferred Time: ${details.day} ${details.time} (${zone})\nGoogle Calendar Target Account: ${GOOGLE_CALENDAR_ACCOUNT}`,
      start: {
        dateTime: startIso.length === 19 ? `${startIso}+05:30` : startIso,
        timeZone: zone,
      },
      end: {
        dateTime: endIso.length === 19 ? `${endIso}+05:30` : endIso,
        timeZone: zone,
      },
      status: "tentative",
      transparency: "transparent", // Non-blocking
      attendees: [
        {
          email: details.email,
          displayName: details.name,
          responseStatus: "needsAction",
        },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 30 },
        ],
      },
    };

    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      },
    );

    if (response.status === 409) {
      // Event with this ID already staged (idempotent duplicate submission)
      return { ok: true, staged: true, eventId };
    }

    if (!response.ok) {
      console.error(
        `[Kitty Corp] Google Calendar event staging returned HTTP ${response.status}`,
      );
      return {
        ok: true,
        staged: false,
        reason: `Google Calendar returned HTTP ${response.status}`,
      };
    }

    const created = (await response.json()) as { id?: string };
    return { ok: true, staged: true, eventId: created.id || eventId };
  } catch (error) {
    console.error(
      "[Kitty Corp] Google Calendar staging non-fatal exception:",
      error instanceof Error ? error.message : "Unknown",
    );
    return {
      ok: true,
      staged: false,
      reason: error instanceof Error ? error.message : "Network error",
    };
  }
}
