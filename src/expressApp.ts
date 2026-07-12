import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { liffRouter } from "./routes/liff.route";
import { webhookRouter } from "./routes/webhook.route";

export function createApp(): Express {
  const app = express();

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/webhook/line", webhookRouter);
  // The LIFF form runs on its own origin (separate deploy), so it needs explicit CORS —
  // scoped to just this router rather than the whole app.
  app.use("/api/liff", cors({ origin: env.LIFF_APP_ORIGIN }), liffRouter);

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    logger.error({ err }, "Unhandled request error");
    res.status(400).json({ error: "bad_request" });
  });

  return app;
}
