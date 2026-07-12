import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE_NAME = "yume_staff_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

export type SessionRole = "admin" | "staff";

export interface SessionPayload {
  role: SessionRole;
  name: string;
  iat: number;
}

function sign(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function createSessionToken(secret: string, role: SessionRole, name: string): string {
  const payload: SessionPayload = { role, name, iat: Date.now() };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data, secret)}`;
}

/** Returns the decoded payload when the token is authentic and unexpired, else null. */
export function readSessionToken(token: string | undefined, secret: string): SessionPayload | null {
  if (!token) return null;

  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  const expectedSignature = sign(data, secret);
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as SessionPayload;
    if (!payload.role || Date.now() - payload.iat >= SESSION_TTL_MS) return null;
    return payload;
  } catch {
    return null;
  }
}
