import type {
  ConversationStep,
  Service,
  InsuranceType,
  RequestStatus,
} from "@prisma/client";

export { ConversationStep, Service, InsuranceType, RequestStatus };

export interface ConversationContext {
  lineUserId: string;
  step: ConversationStep;
  selectedService: Service | null;
  selectedInsuranceType: InsuranceType | null;
}

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

export const SERVICE_LABEL_TH: Record<Service, string> = {
  CHECK_PREMIUM: "เช็คเบี้ยประกัน",
  RENEW_PREMIUM: "เช็คเบี้ยต่ออายุประกัน",
  INQUIRY: "สอบถามข้อมูล",
  OTHER: "บริการอื่นๆ",
};
