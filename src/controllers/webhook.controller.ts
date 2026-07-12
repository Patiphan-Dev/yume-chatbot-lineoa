import { WebhookEvent } from "@line/bot-sdk";
import { Request, Response } from "express";
import { logger } from "../lib/logger";
import { routeEvent } from "../services/conversationRouter.service";
import { notifyStaffProcessingError } from "../services/notifyStaff.service";
import { isFirstDelivery } from "../services/webhookDedup.service";

async function processEvent(event: WebhookEvent): Promise<void> {
  if (!(await isFirstDelivery(event.webhookEventId))) return;

  try {
    await routeEvent(event);
  } catch (error) {
    logger.error({ error, event }, "Failed to process LINE webhook event");
    const message = error instanceof Error ? error.message : String(error);
    await notifyStaffProcessingError(event.type, message);
  }
}

export async function handleWebhook(req: Request, res: Response): Promise<void> {
  const events = (req.body.events ?? []) as WebhookEvent[];

  // A single webhook call can carry multiple events; one failing must not sink the rest.
  await Promise.all(events.map(processEvent));

  res.status(200).end();
}
