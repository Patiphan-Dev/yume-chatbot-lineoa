"use server";

import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { verifyPassword } from "@/lib/passwords";
import { createSessionToken, SESSION_COOKIE_NAME, SessionRole } from "@/lib/session";

const ADMIN_USERNAME = "admin";

function passwordsMatch(input: string, expected: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function authenticate(username: string, password: string): Promise<{ role: SessionRole; name: string } | null> {
  if (username === ADMIN_USERNAME) {
    return passwordsMatch(password, env.STAFF_DASHBOARD_PASSWORD) ? { role: "admin", name: "แอดมิน" } : null;
  }

  const staff = await prisma.staffMember.findUnique({ where: { username } });
  if (!staff || !staff.active || !verifyPassword(password, staff.passwordHash)) {
    return null;
  }
  return { role: "staff", name: staff.name };
}

export async function loginAction(formData: FormData): Promise<void> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const identity = await authenticate(username, password);
  if (!identity) {
    redirect("/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(env.SESSION_SECRET, identity.role, identity.name), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect("/");
}
