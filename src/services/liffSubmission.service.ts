import { pushMessage } from "../lib/line/client";
import { logger } from "../lib/logger";
import { CarInfoInput } from "../types/carInfo";
import { markSubmitted } from "./conversationState.service";
import {
  addCarInfo,
  InsuranceRequestNotFoundError,
  RequestOwnershipMismatchError,
} from "./insuranceRequest.service";
import { verifyLiffIdToken } from "./liffAuth.service";
import { notifyStaffCarInfoSubmitted } from "./notifyStaff.service";

export type SubmitInsuranceRequestResult =
  | { ok: true }
  | { ok: false; reason: "invalid_id_token" | "not_found" | "ownership_mismatch" };

interface SubmitInsuranceRequestParams {
  idToken: string;
  requestId: string;
  carInfo: CarInfoInput;
}

/** Orchestrates the LIFF form submission: verify identity, persist, notify staff, confirm to customer. */
export async function submitLiffInsuranceRequest(
  params: SubmitInsuranceRequestParams,
): Promise<SubmitInsuranceRequestResult> {
  const identity = await verifyLiffIdToken(params.idToken);
  if (!identity) return { ok: false, reason: "invalid_id_token" };

  try {
    const request = await addCarInfo(params.requestId, identity.lineUserId, params.carInfo);

    await markSubmitted(identity.lineUserId);
    await notifyStaffCarInfoSubmitted(request);
    await pushMessage(identity.lineUserId, {
      type: "text",
      text: "ได้รับข้อมูลรถเรียบร้อยครับ เจ้าหน้าที่กำลังตรวจสอบเบี้ยประกันให้ จะแจ้งกลับทาง LINE นี้ครับ",
    });

    return { ok: true };
  } catch (error) {
    if (error instanceof InsuranceRequestNotFoundError) return { ok: false, reason: "not_found" };
    if (error instanceof RequestOwnershipMismatchError) return { ok: false, reason: "ownership_mismatch" };

    logger.error({ error, requestId: params.requestId }, "Failed to submit LIFF insurance request");
    throw error;
  }
}
