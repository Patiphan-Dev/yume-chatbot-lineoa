import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE_NAME = "yume_staff_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

interface SessionPayload {
  role: "staff";
  iat: number;
}

function sign(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function createSessionToken(secret: string): string {
  const payload: SessionPayload = { role: "staff", iat: Date.now() };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data, secret)}`;
}

export function isValidSessionToken(token: string | undefined, secret: string): boolean {
  if (!token) return false;

  const [data, signature] = token.split(".");
  if (!data || !signature) return false;

  const expectedSignature = sign(data, secret);
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as SessionPayload;
    return Date.now() - payload.iat < SESSION_TTL_MS;
  } catch {
    return false;
  }
}
