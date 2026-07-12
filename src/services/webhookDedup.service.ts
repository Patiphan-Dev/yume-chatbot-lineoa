import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { logger } from "../lib/logger";

const UNIQUE_VIOLATION = "P2002";

/**
 * Records the LINE webhookEventId and reports whether this delivery is the
 * first one. LINE retries deliveries on timeout, so a duplicate means the
 * event was already handled (or is being handled) and must be skipped.
 * Fails open: if the check itself errors, the event is processed anyway —
 * a rare duplicate beats silently dropping a customer action.
 */
export async function isFirstDelivery(webhookEventId: string | undefined): Promise<boolean> {
  if (!webhookEventId) return true;

  try {
    await prisma.processedWebhookEvent.create({ data: { id: webhookEventId } });
    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === UNIQUE_VIOLATION) {
      logger.info({ webhookEventId }, "Skipping duplicate LINE webhook delivery");
      return false;
    }
    logger.error({ error, webhookEventId }, "Webhook dedup check failed; processing event anyway");
    return true;
  }
}
