import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "./env";
import { isValidSessionToken, SESSION_COOKIE_NAME } from "./session";

/** Call at the top of any protected Server Component; redirects to /login when the session is missing or expired. */
export async function requireStaffSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!isValidSessionToken(token, env.SESSION_SECRET)) {
    redirect("/login");
  }
}
