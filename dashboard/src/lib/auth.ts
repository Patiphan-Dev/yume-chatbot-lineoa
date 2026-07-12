import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "./env";
import { readSessionToken, SESSION_COOKIE_NAME, SessionPayload } from "./session";

/** Call at the top of any protected Server Component; redirects to /login when the session is missing or expired. */
export async function requireStaffSession(): Promise<SessionPayload> {
  const cookieStore = await cookies();
  const session = readSessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value, env.SESSION_SECRET);
  if (!session) {
    redirect("/login");
  }
  return session;
}

/** Staff management is admin-only; regular staff get bounced to the request list. */
export async function requireAdminSession(): Promise<SessionPayload> {
  const session = await requireStaffSession();
  if (session.role !== "admin") {
    redirect("/");
  }
  return session;
}
