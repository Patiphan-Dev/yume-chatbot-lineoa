"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { logActivity } from "@/lib/activityLog";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/passwords";

export type StaffActionResult = { ok: true } | { ok: false; message: string };

const createStaffSchema = z.object({
  name: z.string().trim().min(1, "กรุณากรอกชื่อ"),
  username: z
    .string()
    .trim()
    .min(3, "ชื่อผู้ใช้ต้องยาวอย่างน้อย 3 ตัวอักษร")
    .regex(/^[a-z0-9._-]+$/i, "ชื่อผู้ใช้ใช้ได้เฉพาะตัวอักษรอังกฤษ ตัวเลข . _ -")
    .refine((value) => value.toLowerCase() !== "admin", "ชื่อผู้ใช้ admin ถูกสงวนไว้"),
  password: z.string().min(8, "รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร"),
});

export async function createStaffAction(formData: FormData): Promise<StaffActionResult> {
  const session = await requireAdminSession();

  const parsed = createStaffSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" };
  }

  const username = parsed.data.username.toLowerCase();
  const existing = await prisma.staffMember.findUnique({ where: { username } });
  if (existing) {
    return { ok: false, message: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" };
  }

  await prisma.staffMember.create({
    data: { name: parsed.data.name, username, passwordHash: hashPassword(parsed.data.password) },
  });

  await logActivity({
    actor: session,
    action: "STAFF_CREATED",
    detail: `${parsed.data.name} (${username})`,
  });

  revalidatePath("/staff");
  return { ok: true };
}

export async function setStaffActiveAction(staffId: string, active: boolean): Promise<StaffActionResult> {
  const session = await requireAdminSession();

  const staff = await prisma.staffMember.update({ where: { id: staffId }, data: { active } });

  await logActivity({
    actor: session,
    action: active ? "STAFF_REACTIVATED" : "STAFF_SUSPENDED",
    detail: `${staff.name} (${staff.username})`,
  });

  revalidatePath("/staff");
  return { ok: true };
}

const resetPasswordSchema = z.string().min(8, "รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร");

export async function resetStaffPasswordAction(staffId: string, formData: FormData): Promise<StaffActionResult> {
  const session = await requireAdminSession();

  const parsed = resetPasswordSchema.safeParse(formData.get("password"));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "รหัสผ่านไม่ถูกต้อง" };
  }

  const staff = await prisma.staffMember.update({
    where: { id: staffId },
    data: { passwordHash: hashPassword(parsed.data) },
  });

  await logActivity({
    actor: session,
    action: "STAFF_PASSWORD_RESET",
    detail: `${staff.name} (${staff.username})`,
  });

  revalidatePath("/staff");
  return { ok: true };
}
