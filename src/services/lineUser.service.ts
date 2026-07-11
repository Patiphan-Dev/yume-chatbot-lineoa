import { prisma } from "../lib/prisma";
import { lineClient } from "../lib/line/client";
import { logger } from "../lib/logger";
import type { LineUser } from "@prisma/client";

export async function ensureLineUser(lineUserId: string): Promise<LineUser> {
  const existing = await prisma.lineUser.findUnique({ where: { lineUserId } });
  if (existing) return existing;

  let displayName: string | undefined;
  let pictureUrl: string | undefined;

  try {
    const profile = await lineClient.getProfile(lineUserId);
    displayName = profile.displayName;
    pictureUrl = profile.pictureUrl;
  } catch (error) {
    logger.warn({ error, lineUserId }, "Failed to fetch LINE profile, creating user without it");
  }

  return prisma.lineUser.create({
    data: { lineUserId, displayName, pictureUrl },
  });
}
