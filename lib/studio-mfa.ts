import "server-only";
import { database, HttpError, setting, setStudioSession } from "./kitty-server";
import { recordAuditEvent } from "./audit-logger";

export interface MfaFactorSummary {
  id: string;
  friendlyName: string;
  factorType: string;
  status: "verified" | "unverified";
  createdAt: string;
}

export interface StudioMfaStatus {
  enrolled: boolean;
  verified: boolean;
  currentLevel: "aal1" | "aal2";
  factors: MfaFactorSummary[];
}

export interface EnrollMfaResult {
  id: string;
  type: "totp";
  totp: {
    secret: string;
    qrCode: string;
    uri: string;
  };
}

export async function getStudioMfaStatus(token: string): Promise<StudioMfaStatus> {
  const db = database(token);
  const { data: userData, error: userError } = await db.auth.getUser(token);
  if (userError || !userData.user) {
    throw new HttpError("Please sign in to continue.", 401);
  }

  const user = userData.user;
  const factors: MfaFactorSummary[] = (user.factors || []).map((factor) => ({
    id: factor.id,
    friendlyName: factor.friendly_name || "Authenticator",
    factorType: factor.factor_type,
    status: factor.status as "verified" | "unverified",
    createdAt: factor.created_at,
  }));

  const verifiedFactors = factors.filter((f) => f.status === "verified");
  const enrolled = factors.length > 0;
  const verified = verifiedFactors.length > 0;

  // Determine current assurance level from user token claims or app_metadata
  let currentLevel: "aal1" | "aal2" = "aal1";
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const claims = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
      if (claims.aal === "aal2") {
        currentLevel = "aal2";
      }
    }
  } catch {
    currentLevel = "aal1";
  }

  return {
    enrolled,
    verified,
    currentLevel,
    factors,
  };
}

export async function enrollStudioMfa(
  token: string,
  friendlyName = "KITTY Studio Authenticator",
): Promise<EnrollMfaResult> {
  const url = `${setting("SUPABASE_URL")}/auth/v1/factors`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey: setting("SUPABASE_PUBLISHABLE_KEY"),
    },
    body: JSON.stringify({
      friendly_name: friendlyName.slice(0, 64),
      factor_type: "totp",
      issuer: "KITTY CORP",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new HttpError(
      `MFA enrollment failed: ${errText || response.statusText}`,
      response.status === 401 ? 401 : 502,
    );
  }

  const data = (await response.json()) as {
    id: string;
    totp?: { secret?: string; qr_code?: string; uri?: string };
  };

  recordAuditEvent({
    action: "admin.mfa_enroll",
    severity: "info",
    status: "success",
    resource: { type: "mfa_factor", id: data.id },
    details: { friendlyName, factorType: "totp" },
  });

  return {
    id: data.id,
    type: "totp",
    totp: {
      secret: data.totp?.secret || "",
      qrCode: data.totp?.qr_code || "",
      uri: data.totp?.uri || "",
    },
  };
}

export async function verifyStudioMfa(
  token: string,
  factorId: string,
  code: string,
): Promise<{ ok: boolean; aal: "aal2" }> {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(factorId)) {
    throw new HttpError("Invalid factor ID.", 400);
  }
  const cleanCode = code.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(cleanCode)) {
    throw new HttpError("Verification code must be exactly 6 digits.", 400);
  }

  const supabaseUrl = setting("SUPABASE_URL");
  const apikey = setting("SUPABASE_PUBLISHABLE_KEY");

  // Step 1: Challenge
  const challengeUrl = `${supabaseUrl}/auth/v1/factors/${factorId}/challenge`;
  const challengeRes = await fetch(challengeUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey,
    },
    body: JSON.stringify({}),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });

  if (!challengeRes.ok) {
    throw new HttpError("Unable to initiate verification challenge.", 502);
  }

  const challengeData = (await challengeRes.json()) as { id?: string };
  const challengeId = challengeData.id;
  if (!challengeId) {
    throw new HttpError("Invalid challenge received.", 502);
  }

  // Step 2: Verify
  const verifyUrl = `${supabaseUrl}/auth/v1/factors/${factorId}/verify`;
  const verifyRes = await fetch(verifyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey,
    },
    body: JSON.stringify({
      challenge_id: challengeId,
      code: cleanCode,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });

  if (!verifyRes.ok) {
    recordAuditEvent({
      action: "admin.mfa_verify",
      severity: "warn",
      status: "denied",
      resource: { type: "mfa_factor", id: factorId },
      details: { reason: "Code verification rejected" },
    });
    throw new HttpError("Invalid verification code. Please try again.", 400);
  }

  const verifyData = (await verifyRes.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (verifyData.access_token) {
    // Session elevated to aal2; update session cookie
    await setStudioSession(verifyData.access_token, verifyData.expires_in || 3600);
  }

  recordAuditEvent({
    action: "admin.mfa_verify",
    severity: "info",
    status: "success",
    resource: { type: "mfa_factor", id: factorId },
    details: { elevatedLevel: "aal2" },
  });

  return { ok: true, aal: "aal2" };
}

export async function unenrollStudioMfa(
  token: string,
  factorId: string,
): Promise<{ ok: boolean }> {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(factorId)) {
    throw new HttpError("Invalid factor ID.", 400);
  }

  const url = `${setting("SUPABASE_URL")}/auth/v1/factors/${factorId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: setting("SUPABASE_PUBLISHABLE_KEY"),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new HttpError("Failed to unenroll MFA factor.", response.status === 401 ? 401 : 502);
  }

  recordAuditEvent({
    action: "admin.mfa_unenroll",
    severity: "warn",
    status: "success",
    resource: { type: "mfa_factor", id: factorId },
  });

  return { ok: true };
}
