import { FollowEvent, JoinEvent, MessageEvent, PostbackEvent, WebhookEvent } from "@line/bot-sdk";
import { env } from "../config/env";
import { replyMessage } from "../lib/line/client";
import { logger } from "../lib/logger";
import { matchKeywordReply } from "../config/keywordReplies";
import { buildInfoMenuFlex } from "../flex/infoMenu.flex";
import { buildInsuranceTypeMenuFlex } from "../flex/insuranceTypeMenu.flex";
import { buildInfoReply } from "./infoReply.service";
import { buildLiffHandoffFlex } from "../flex/liffHandoff.flex";
import { buildMainMenuFlex } from "../flex/mainMenu.flex";
import { InsuranceType, Service } from "../types/conversation";
import { parsePostbackData } from "../types/postback";
import {
  getConversationContext,
  resetToMainMenu,
  setInsuranceTypeSelected,
  setServiceSelected,
} from "./conversationState.service";
import { createInsuranceRequest } from "./insuranceRequest.service";
import { notifyStaffKeywordEscalation, notifyStaffNewRequest } from "./notifyStaff.service";
import { linkRichMenuToUser } from "./richMenu.service";

/** Entry point for every LINE webhook event; dispatches by event type. */
export async function routeEvent(event: WebhookEvent): Promise<void> {
  switch (event.type) {
    case "follow":
      return handleFollow(event);
    case "message":
      if (event.message.type === "text") return handleTextMessage(event);
      return;
    case "postback":
      return handlePostback(event);
    case "join":
      return handleJoin(event);
    default:
      logger.debug({ eventType: event.type }, "Unhandled LINE event type");
  }
}

/** Fires when the bot is added to a group/room — replies with the id so it's visible right in
 *  the chat, no server logs needed, to copy into LINE_STAFF_GROUP_ID. */
async function handleJoin(event: JoinEvent): Promise<void> {
  const { source } = event;
  const id = source.type === "group" ? source.groupId : source.type === "room" ? source.roomId : undefined;

  logger.info({ source }, "Bot joined a group/room");
  await replyMessage(event.replyToken, {
    type: "text",
    text: `เข้ากลุ่มนี้แล้วครับ\nLINE_STAFF_GROUP_ID=${id}`,
  });
}

async function handleFollow(event: FollowEvent): Promise<void> {
  const lineUserId = event.source.userId;
  if (!lineUserId) return;

  await getConversationContext(lineUserId); // ensures LineUser + ConversationState rows exist
  await replyMessage(event.replyToken, buildMainMenuFlex());

  if (env.LINE_RICH_MENU_ID) {
    await linkRichMenuToUser(lineUserId, env.LINE_RICH_MENU_ID);
  }
}

async function handleTextMessage(event: MessageEvent): Promise<void> {
  const lineUserId = event.source.userId;
  if (!lineUserId) return;
  if (event.message.type !== "text") return;

  await getConversationContext(lineUserId);

  const matchedRule = matchKeywordReply(event.message.text);
  if (matchedRule) {
    await replyMessage(event.replyToken, { type: "text", text: matchedRule.reply });
    if (matchedRule.escalateToStaff) {
      await notifyStaffKeywordEscalation(lineUserId, event.message.text);
    }
    return;
  }

  // Free-text input outside the guided flow and unmatched by any keyword just re-anchors
  // the user on the main menu.
  await replyMessage(event.replyToken, buildMainMenuFlex());
}

async function handlePostback(event: PostbackEvent): Promise<void> {
  const lineUserId = event.source.userId;
  if (!lineUserId) return;

  // Ensures the LineUser + ConversationState rows exist even if the follow
  // event never fired for this user (e.g. they friended the bot before this
  // logic existed), otherwise the upserts below hit a foreign key violation.
  await getConversationContext(lineUserId);

  const parsed = parsePostbackData(event.postback.data);
  if (!parsed) {
    await replyMessage(event.replyToken, buildMainMenuFlex());
    return;
  }

  if (parsed.action === "select_service") {
    return handleServiceSelected(event.replyToken, lineUserId, parsed.value as Service);
  }
  if (parsed.action === "show_info") {
    await replyMessage(event.replyToken, buildInfoReply(parsed.value));
    return;
  }
  return handleInsuranceTypeSelected(event.replyToken, lineUserId, parsed.value as InsuranceType);
}

async function handleServiceSelected(replyToken: string, lineUserId: string, service: Service): Promise<void> {
  await setServiceSelected(lineUserId, service);

  if (service === "CHECK_PREMIUM" || service === "RENEW_PREMIUM") {
    await replyMessage(replyToken, buildInsuranceTypeMenuFlex());
    return;
  }

  if (service === "INQUIRY") {
    // Self-service knowledge menu; no staff involvement needed.
    await replyMessage(replyToken, buildInfoMenuFlex());
    await resetToMainMenu(lineUserId);
    return;
  }

  // OTHER hands off to a human — tell the customer AND actually alert staff.
  await replyMessage(replyToken, {
    type: "text",
    text: "รับเรื่องแล้วครับ เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด",
  });
  await notifyStaffKeywordEscalation(lineUserId, "ลูกค้ากดเมนู “บริการอื่นๆ” ขอให้เจ้าหน้าที่ติดต่อกลับ");
  await resetToMainMenu(lineUserId);
}

async function handleInsuranceTypeSelected(
  replyToken: string,
  lineUserId: string,
  insuranceType: InsuranceType,
): Promise<void> {
  await setInsuranceTypeSelected(lineUserId, insuranceType);

  const request = await createInsuranceRequest(lineUserId, insuranceType);
  await notifyStaffNewRequest(request.id, lineUserId, insuranceType);

  await replyMessage(replyToken, buildLiffHandoffFlex(request.id, insuranceType));
}
