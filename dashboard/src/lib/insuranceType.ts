import { InsuranceType } from "@prisma/client";

// Keep in sync with the webhook backend's src/types/conversation.ts INSURANCE_TYPE_LABEL_TH.
export const INSURANCE_TYPE_LABEL_TH: Record<InsuranceType, string> = {
  CAR_CLASS_1: "ประกันรถยนต์ชั้น 1",
  CAR_CLASS_2_3: "ประกันรถยนต์ชั้น 2+/3+",
  RENTAL_COMMERCIAL: "ประกันรถเช่า/รถพาณิชย์",
  LUXURY_SUPERCAR: "ประกันรถหรู/Supercar",
  EV: "ประกันรถไฟฟ้า EV",
  FIRE: "ประกันอัคคีภัย",
  CONSTRUCTION: "ประกันท่อสร้าง",
  OTHER: "ประกันภัยอื่นๆ",
};
