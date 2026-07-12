export interface CarInfoFormValues {
  carRegistration: string;
  province: string;
  brand: string;
  model: string;
  year: string;
  chassisNumber: string;
}

const ERROR_MESSAGE_TH: Record<string, string> = {
  invalid_request: "ข้อมูลไม่ครบถ้วนหรือไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง",
  invalid_id_token: "ไม่สามารถยืนยันตัวตนได้ กรุณาปิดหน้านี้แล้วเปิดใหม่จากแชท LINE",
  not_found: "ไม่พบคำขอนี้ อาจถูกดำเนินการไปแล้ว กรุณาติดต่อเจ้าหน้าที่",
  ownership_mismatch: "คำขอนี้ไม่ตรงกับบัญชี LINE ของคุณ",
  missing_request_id: "ลิงก์ไม่ถูกต้อง กรุณาเปิดจากข้อความที่แชทส่งมา",
};

export class SubmitRequestError extends Error {}

export async function submitInsuranceRequest(
  requestId: string,
  idToken: string,
  values: CarInfoFormValues,
): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/liff/insurance-requests/${encodeURIComponent(requestId)}/submit`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, ...values }),
    },
  );

  if (response.ok) return;

  let errorCode = "invalid_request";
  try {
    const body = (await response.json()) as { error?: string };
    if (body.error) errorCode = body.error;
  } catch {
    // Response body wasn't JSON — fall back to the generic message below.
  }

  throw new SubmitRequestError(ERROR_MESSAGE_TH[errorCode] ?? "ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
}
