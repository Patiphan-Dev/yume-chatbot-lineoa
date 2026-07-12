import type { InsuranceRequest } from "@prisma/client";
import { pushMessage } from "../lib/line/client";
import { env } from "../config/env";
import { logger } from "../lib/logger";
import { INSURANCE_TYPE_LABEL_TH, InsuranceType } from "../types/conversation";

function requestDetailUrl(requestId: string): string {
  return `${env.DASHBOARD_URL}/requests/${requestId}`;
}

export async function notifyStaffNewRequest(
  requestId: string,
  lineUserId: string,
  insuranceType: InsuranceType,
  displayName?: string | null,
): Promise<void> {
  const text = [
    "🔔 คำขอเช็คเบี้ยประกันใหม่",
    `ลูกค้า: ${displayName ?? lineUserId}`,
    `ประเภท: ${INSURANCE_TYPE_LABEL_TH[insuranceType]}`,
    `เลขที่คำขอ: ${requestId}`,
    `ตรวจสอบ: ${requestDetailUrl(requestId)}`,
  ].join("\n");

  try {
    await pushMessage(env.LINE_STAFF_GROUP_ID, { type: "text", text });
  } catch (error) {
    // Staff notification failing must not fail the customer-facing reply flow.
    logger.error({ error, requestId }, "Failed to notify staff group of new insurance request");
  }
}

export async function notifyStaffKeywordEscalation(lineUserId: string, messageText: string): Promise<void> {
  const text = [
    "🙋 ลูกค้าขอคุยกับเจ้าหน้าที่",
    `LINE user: ${lineUserId}`,
    `ข้อความ: ${messageText}`,
  ].join("\n");

  try {
    await pushMessage(env.LINE_STAFF_GROUP_ID, { type: "text", text });
  } catch (error) {
    // Staff notification failing must not fail the customer-facing reply flow.
    logger.error({ error, lineUserId }, "Failed to notify staff of keyword escalation");
  }
}

/** Alerts staff that an incoming customer event crashed, so failures surface before complaints do. */
export async function notifyStaffProcessingError(eventType: string, errorMessage: string): Promise<void> {
  const text = [
    "⚠️ ระบบประมวลผลข้อความลูกค้าล้มเหลว",
    `ประเภทเหตุการณ์: ${eventType}`,
    `สาเหตุ: ${errorMessage}`,
    "ลูกค้าอาจไม่ได้รับการตอบกลับ กรุณาตรวจสอบแชทล่าสุด",
  ].join("\n");

  try {
    await pushMessage(env.LINE_STAFF_GROUP_ID, { type: "text", text });
  } catch (error) {
    // The alert itself failing must never cascade.
    logger.error({ error }, "Failed to push processing-error alert to staff group");
  }
}

export async function notifyStaffCarInfoSubmitted(request: InsuranceRequest): Promise<void> {
  const text = [
    "📄 ลูกค้าส่งข้อมูลรถแล้ว",
    `เลขที่คำขอ: ${request.id}`,
    `ประเภท: ${INSURANCE_TYPE_LABEL_TH[request.insuranceType]}`,
    `ทะเบียน: ${request.carRegistration ?? "-"} (${request.province ?? "-"})`,
    `ยี่ห้อ/รุ่น: ${request.brand ?? "-"} ${request.model ?? ""} ปี ${request.year ?? "-"}`,
    `เลขตัวถัง: ${request.chassisNumber ?? "-"}`,
    `ตรวจสอบ: ${requestDetailUrl(request.id)}`,
  ].join("\n");

  try {
    await pushMessage(env.LINE_STAFF_GROUP_ID, { type: "text", text });
  } catch (error) {
    logger.error({ error, requestId: request.id }, "Failed to notify staff of submitted car info");
  }
}
