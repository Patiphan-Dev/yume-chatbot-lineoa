import { Client, Message } from "@line/bot-sdk";
import { env } from "./env";

const lineClient = new Client({ channelAccessToken: env.LINE_CHANNEL_ACCESS_TOKEN });

export async function pushLineMessage(to: string, messages: Message | Message[]): Promise<void> {
  await lineClient.pushMessage(to, messages);
}
