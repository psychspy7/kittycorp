import "server-only";

export const GA4_PROPERTY_ID = "557240548";
export const GA4_MEASUREMENT_ID = "G-9V2T4Z9RJP";

export interface GA4AnalyticsSummary {
  configured: boolean;
  propertyId: string;
  measurementId: string;
  users: number | null;
  sessions: number | null;
  pageviews: number | null;
  topPages: Array<{ path: string; views: number }>;
  summary: string;
}

export function isGA4Configured(): boolean {
  const clientEmail = (
    process.env.GA4_CLIENT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  )?.trim();
  const privateKey = (
    process.env.GA4_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  )?.trim();
  return Boolean(clientEmail && privateKey);
}

// Minimal zero-dependency Google Service Account JWT signer
async function getGoogleServiceAccountToken(
  clientEmail: string,
  privateKeyPem: string,
  scope: string,
): Promise<string | null> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const claim = {
      iss: clientEmail,
      scope,
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    };

    const b64 = (obj: unknown) =>
      Buffer.from(JSON.stringify(obj))
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    const unsignedToken = `${b64(header)}.${b64(claim)}`;

    // Import PKCS8 private key
    const pemContents = privateKeyPem
      .replace(/-----BEGIN[A-Z\s]+-----/g, "")
      .replace(/-----END[A-Z\s]+-----/g, "")
      .replace(/\s+/g, "");
    const binaryDer = Buffer.from(pemContents, "base64");

    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    );

    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      new TextEncoder().encode(unsignedToken),
    );

    const b64Sig = Buffer.from(signature)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const jwt = `${unsignedToken}.${b64Sig}`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!tokenRes.ok) return null;
    const tokenData = (await tokenRes.json()) as { access_token?: string };
    return tokenData.access_token || null;
  } catch (error) {
    console.error(
      "[Kitty Corp] Google Service Account auth error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return null;
  }
}

export async function fetchGA4DailyMetrics(): Promise<GA4AnalyticsSummary> {
  const defaultUnconfigured: GA4AnalyticsSummary = {
    configured: false,
    propertyId: GA4_PROPERTY_ID,
    measurementId: GA4_MEASUREMENT_ID,
    users: null,
    sessions: null,
    pageviews: null,
    topPages: [],
    summary:
      "GA4 Data API service account not configured. Connect GA4 credentials to activate live metrics.",
  };

  const clientEmail = (
    process.env.GA4_CLIENT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  )?.trim();
  const privateKey = (
    process.env.GA4_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  )?.trim();

  if (!clientEmail || !privateKey) {
    return defaultUnconfigured;
  }

  const token = await getGoogleServiceAccountToken(
    clientEmail,
    privateKey,
    "https://www.googleapis.com/auth/analytics.readonly",
  );

  if (!token) {
    return {
      ...defaultUnconfigured,
      summary: "GA4 authentication failed. Check service account permissions.",
    };
  }

  try {
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: "yesterday", endDate: "today" }],
          metrics: [
            { name: "activeUsers" },
            { name: "sessions" },
            { name: "screenPageViews" },
          ],
          dimensions: [{ name: "pagePath" }],
          limit: 10,
        }),
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!response.ok) {
      console.error(
        `[Kitty Corp] GA4 report query returned HTTP ${response.status}`,
      );
      return {
        ...defaultUnconfigured,
        summary: `GA4 Data API returned HTTP ${response.status}.`,
      };
    }

    const data = (await response.json()) as {
      rows?: Array<{
        dimensionValues?: Array<{ value?: string }>;
        metricValues?: Array<{ value?: string }>;
      }>;
      totals?: Array<{
        metricValues?: Array<{ value?: string }>;
      }>;
    };

    let totalUsers = 0;
    let totalSessions = 0;
    let totalViews = 0;

    if (data.totals?.[0]?.metricValues) {
      totalUsers = Number(data.totals[0].metricValues[0]?.value || 0);
      totalSessions = Number(data.totals[0].metricValues[1]?.value || 0);
      totalViews = Number(data.totals[0].metricValues[2]?.value || 0);
    }

    const topPages: Array<{ path: string; views: number }> = [];
    if (Array.isArray(data.rows)) {
      for (const row of data.rows) {
        const path = row.dimensionValues?.[0]?.value || "/";
        const views = Number(row.metricValues?.[2]?.value || 0);
        topPages.push({ path, views });
      }
    }

    return {
      configured: true,
      propertyId: GA4_PROPERTY_ID,
      measurementId: GA4_MEASUREMENT_ID,
      users: totalUsers,
      sessions: totalSessions,
      pageviews: totalViews,
      topPages,
      summary: `Active users: ${totalUsers} | Sessions: ${totalSessions} | Pageviews: ${totalViews}`,
    };
  } catch (error) {
    console.error(
      "[Kitty Corp] GA4 fetch error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return {
      ...defaultUnconfigured,
      summary: "GA4 request failed due to a network timeout.",
    };
  }
}
