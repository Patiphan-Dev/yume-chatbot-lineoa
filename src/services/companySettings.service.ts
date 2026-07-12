import { prisma } from "../lib/prisma";
import { logger } from "../lib/logger";
import {
  CompanyProfile,
  DEFAULT_COMPANY_PROFILE,
  DEFAULT_INSURANCE_INFO,
  InsuranceInfo,
} from "../config/companyKnowledge";
import { InsuranceType } from "../types/conversation";

export const SETTING_KEYS = {
  PROFILE: "profile",
  INSURANCE_INFO: "insurance_info",
} as const;

const CACHE_TTL_MS = 60 * 1000;

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

/** DB-backed setting with per-instance cache; falls back to defaults so the bot never breaks. */
async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value as T;
  }

  try {
    const row = await prisma.companySetting.findUnique({ where: { key } });
    const value = row ? ({ ...fallback, ...(row.value as object) } as T) : fallback;
    cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
    return value;
  } catch (error) {
    logger.error({ error, key }, "Failed to load company setting; using default");
    return fallback;
  }
}

export function getCompanyProfile(): Promise<CompanyProfile> {
  return getSetting(SETTING_KEYS.PROFILE, DEFAULT_COMPANY_PROFILE);
}

export function getInsuranceInfo(): Promise<Record<InsuranceType, InsuranceInfo>> {
  return getSetting(SETTING_KEYS.INSURANCE_INFO, DEFAULT_INSURANCE_INFO);
}
