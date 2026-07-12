"use server";

import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activityLog";
import { requireAdminSession } from "@/lib/auth";
import { CompanyProfile, InsuranceInfo, PROFILE_FIELDS, SETTING_KEYS } from "@/lib/companyInfo";
import { prisma } from "@/lib/db";

export type SaveResult = { ok: true } | { ok: false; message: string };

function linesToList(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function saveCompanyProfileAction(formData: FormData): Promise<SaveResult> {
  const session = await requireAdminSession();

  const profile = {} as Record<string, string | string[]>;
  for (const field of PROFILE_FIELDS) {
    const value = String(formData.get(field.key) ?? "").trim();
    if (!value) {
      return { ok: false, message: `กรุณากรอก${field.label}` };
    }
    profile[field.key] = value;
  }
  profile.highlights = linesToList(String(formData.get("highlights") ?? ""));

  await prisma.companySetting.upsert({
    where: { key: SETTING_KEYS.PROFILE },
    update: { value: profile },
    create: { key: SETTING_KEYS.PROFILE, value: profile },
  });

  await logActivity({ actor: session, action: "COMPANY_INFO_UPDATED", detail: "ข้อมูลบริษัท" });

  revalidatePath("/company");
  return { ok: true };
}

export async function saveInsuranceInfoAction(
  insuranceType: string,
  formData: FormData,
): Promise<SaveResult> {
  const session = await requireAdminSession();

  const summary = String(formData.get("summary") ?? "").trim();
  const suitableFor = String(formData.get("suitableFor") ?? "").trim();
  const coverage = linesToList(String(formData.get("coverage") ?? ""));

  if (!summary || !suitableFor || coverage.length === 0) {
    return { ok: false, message: "กรุณากรอกให้ครบทุกช่อง" };
  }

  const row = await prisma.companySetting.findUnique({ where: { key: SETTING_KEYS.INSURANCE_INFO } });
  const existing = (row?.value ?? {}) as unknown as Record<string, InsuranceInfo>;
  // Serialized through JSON to satisfy Prisma's InputJsonValue type.
  const updated = JSON.parse(
    JSON.stringify({ ...existing, [insuranceType]: { summary, coverage, suitableFor } }),
  );

  await prisma.companySetting.upsert({
    where: { key: SETTING_KEYS.INSURANCE_INFO },
    update: { value: updated },
    create: { key: SETTING_KEYS.INSURANCE_INFO, value: updated },
  });

  await logActivity({
    actor: session,
    action: "COMPANY_INFO_UPDATED",
    detail: `ข้อมูลประกัน: ${insuranceType}`,
  });

  revalidatePath("/company");
  return { ok: true };
}

export type { CompanyProfile };
