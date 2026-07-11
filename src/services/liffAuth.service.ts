import { env } from "../config/env";
import { logger } from "../lib/logger";

export interface LiffIdentity {
  lineUserId: string;
  displayName?: string;
}

interface VerifyResponseBody {
  sub: string;
  name?: string;
}

/** Verifies a LIFF id_token server-side so the submitting user can't be spoofed by the client. */
export async function verifyLiffIdToken(idToken: string): Promise<LiffIdentity | null> {
  try {
    const response = await fetch("https://api.line.me/oauth2/v2.1/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ id_token: idToken, client_id: env.LINE_LOGIN_CHANNEL_ID }),
    });

    if (!response.ok) {
      logger.warn({ status: response.status }, "LIFF id_token verification rejected");
      return null;
    }

    const payload = (await response.json()) as VerifyResponseBody;
    return { lineUserId: payload.sub, displayName: payload.name };
  } catch (error) {
    logger.error({ error }, "Failed to reach LINE id_token verification endpoint");
    return null;
  }
}
