"use server";

import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logActivity } from "@/lib/activityLog";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { verifyPassword } from "@/lib/passwords";
import { createSessionToken, SESSION_COOKIE_NAME, SessionRole } from "@/lib/session";

const ADMIN_USERNAME = "admin";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;

/** Brute-force guard: too many recent failures for a username locks it out temporarily. */
async function isLockedOut(username: string): Promise<boolean> {
  const recentFailures = await prisma.activityLog.count({
    where: {
      action: "LOGIN_FAILED",
      detail: `username: ${username}`,
      createdAt: { gte: new Date(Date.now() - LOCKOUT_WINDOW_MS) },
    },
  });
  return recentFailures >= MAX_FAILED_ATTEMPTS;
}

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

  if (await isLockedOut(username)) {
    redirect("/login?error=locked");
  }

  const identity = await authenticate(username, password);
  if (!identity) {
    await logActivity({
      actor: { name: username, role: "staff" },
      action: "LOGIN_FAILED",
      detail: `username: ${username}`,
    });
    redirect("/login?error=1");
  }

  await logActivity({ actor: identity, action: "LOGIN", detail: `username: ${username}` });

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
