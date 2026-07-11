import type { InsuranceRequest } from "@prisma/client";
import { pushMessage } from "../lib/line/client";
import { env } from "../config/env";
import { logger } from "../lib/logger";
import { INSURANCE_TYPE_LABEL_TH, InsuranceType } from "../types/conversation";

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
  ].join("\n");

  try {
    await pushMessage(env.LINE_STAFF_GROUP_ID, { type: "text", text });
  } catch (error) {
    // Staff notification failing must not fail the customer-facing reply flow.
    logger.error({ error, requestId }, "Failed to notify staff group of new insurance request");
  }
}

export async function notifyStaffCarInfoSubmitted(request: InsuranceRequest): Promise<void> {
  const text = [
    "📄 ลูกค้าส่งข้อมูลรถแล้ว",
    `เลขที่คำขอ: ${request.id}`,
    `ประเภท: ${INSURANCE_TYPE_LABEL_TH[request.insuranceType]}`,
    `ทะเบียน: ${request.carRegistration ?? "-"} (${request.province ?? "-"})`,
    `ยี่ห้อ/รุ่น: ${request.brand ?? "-"} ${request.model ?? ""} ปี ${request.year ?? "-"}`,
  ].join("\n");

  try {
    await pushMessage(env.LINE_STAFF_GROUP_ID, { type: "text", text });
  } catch (error) {
    logger.error({ error, requestId: request.id }, "Failed to notify staff of submitted car info");
  }
}
