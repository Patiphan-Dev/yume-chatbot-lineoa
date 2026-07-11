import { WebhookEvent } from "@line/bot-sdk";
import { Request, Response } from "express";
import { logger } from "../lib/logger";
import { routeEvent } from "../services/conversationRouter.service";

export async function handleWebhook(req: Request, res: Response): Promise<void> {
  const events = (req.body.events ?? []) as WebhookEvent[];

  // A single webhook call can carry multiple events; one failing must not sink the rest.
  await Promise.all(
    events.map((event) =>
      routeEvent(event).catch((error) => {
        logger.error({ error, event }, "Failed to process LINE webhook event");
      }),
    ),
  );

  res.status(200).end();
}
