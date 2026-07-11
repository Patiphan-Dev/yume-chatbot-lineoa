import { middleware } from "@line/bot-sdk";
import { Router } from "express";
import { env } from "../config/env";
import { handleWebhook } from "../controllers/webhook.controller";

export const webhookRouter = Router();

// @line/bot-sdk's middleware verifies the X-Line-Signature against the raw body
// and parses it into req.body — do not put express.json() in front of this route.
webhookRouter.post("/", middleware({ channelSecret: env.LINE_CHANNEL_SECRET }), handleWebhook);
