import { Client, ClientConfig, Message } from "@line/bot-sdk";
import { env } from "../../config/env";
import { logger } from "../logger";

export const lineClientConfig: ClientConfig = {
  channelAccessToken: env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: env.LINE_CHANNEL_SECRET,
};

export const lineClient = new Client(lineClientConfig);

export async function replyMessage(replyToken: string, messages: Message | Message[]): Promise<void> {
  try {
    await lineClient.replyMessage(replyToken, messages);
  } catch (error) {
    logger.error({ error }, "Failed to reply message via LINE API");
    throw error;
  }
}

export async function pushMessage(to: string, messages: Message | Message[]): Promise<void> {
  try {
    await lineClient.pushMessage(to, messages);
  } catch (error) {
    logger.error({ error, to }, "Failed to push message via LINE API");
    throw error;
  }
}
