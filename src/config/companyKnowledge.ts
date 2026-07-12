import { InsuranceType } from "../types/conversation";

// ─────────────────────────────────────────────────────────────────────────────
// ค่าเริ่มต้น (mock) ของฐานความรู้บริษัท — ข้อมูลจริงแก้ได้จากหน้า "ข้อมูลบริษัท"
// ใน dashboard ซึ่งเก็บลงตาราง company_settings; ไฟล์นี้เป็นเพียง fallback
// เมื่อยังไม่เคยบันทึกข้อมูลจากหน้า dashboard เลย
// ─────────────────────────────────────────────────────────────────────────────

export interface CompanyProfile {
  name: string;
  description: string;
  license: string;
  address: string;
  serviceArea: string;
  phone: string;
  mobile: string;
  lineOa: string;
  facebook: string;
  businessHours: string;
  highlights: string[];
}

export interface InsuranceInfo {
  summary: string;
  coverage: string[];
  suitableFor: string;
}

export const DEFAULT_COMPANY_PROFILE: CompanyProfile = {
  name: "YUME Insurance (ยูเมะ อินชัวรันส์)",
  description: "นายหน้าประกันวินาศภัยครบวงจร ดูแลตั้งแต่เช็คเบี้ย เปรียบเทียบแผน จนถึงเคลม",
  license: "ใบอนุญาตนายหน้าประกันวินาศภัย เลขที่ ว00000/2568",
  address: "123/45 อาคารยูเมะ ชั้น 8 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400",
  serviceArea: "ให้บริการทั่วประเทศไทย (ทำเรื่องออนไลน์ได้ทุกขั้นตอน)",
  phone: "02-000-0000",
  mobile: "080-000-0000",
  lineOa: "@yumeinsurance",
  facebook: "facebook.com/yumeinsurance",
  businessHours: "จันทร์–เสาร์ 09:00–18:00 น. (หยุดวันอาทิตย์และวันหยุดนักขัตฤกษ์)",
  highlights: [
    "เปรียบเทียบเบี้ยจากบริษัทประกันชั้นนำกว่า 15 แห่งในครั้งเดียว",
    "ผ่อนเบี้ย 0% ได้สูงสุด 10 เดือน",
    "มีเจ้าหน้าที่ช่วยประสานงานเคลมตลอดอายุกรมธรรม์",
    "แจ้งงานผ่าน LINE ได้ตลอด ไม่ต้องเดินทาง",
  ],
};

export const DEFAULT_INSURANCE_INFO: Record<InsuranceType, InsuranceInfo> = {
  CAR_CLASS_1: {
    summary: "คุ้มครองครอบคลุมที่สุด ทั้งรถเราและคู่กรณี ไม่ว่าใครผิด",
    coverage: [
      "ซ่อมรถตัวเอง ทั้งชนแบบมี/ไม่มีคู่กรณี",
      "ซ่อมรถคู่กรณีและทรัพย์สินบุคคลภายนอก",
      "รถหาย ไฟไหม้ น้ำท่วม",
      "ค่ารักษาพยาบาลผู้ขับขี่และผู้โดยสาร",
    ],
    suitableFor: "รถใหม่ป้ายแดง–อายุไม่เกิน 7 ปี หรือรถที่ยังผ่อนไฟแนนซ์",
  },
  CAR_CLASS_2_3: {
    summary: "เบี้ยประหยัดกว่าชั้น 1 แต่ยังคุ้มครองเหตุการณ์สำคัญ",
    coverage: [
      "2+: รถหาย ไฟไหม้ + ซ่อมรถเราเมื่อชนแบบมีคู่กรณี",
      "3+: ซ่อมรถเราเมื่อชนแบบมีคู่กรณี (ไม่รวมรถหาย/ไฟไหม้)",
      "ซ่อมรถคู่กรณีและความรับผิดต่อบุคคลภายนอกทั้งคู่",
    ],
    suitableFor: "รถอายุ 7 ปีขึ้นไป หรือต้องการคุมงบเบี้ยประกัน",
  },
  RENTAL_COMMERCIAL: {
    summary: "สำหรับรถที่ใช้เชิงพาณิชย์ ต้องใช้กรมธรรม์แบบระบุการใช้งานถูกต้อง",
    coverage: [
      "คุ้มครองการใช้รถรับจ้าง/ให้เช่า/ขนส่ง ตามประเภทที่จดทะเบียน",
      "เลือกทุนประกันตามมูลค่ารถและความเสี่ยงธุรกิจ",
    ],
    suitableFor: "รถเช่า รถรับส่งพนักงาน รถขนส่งสินค้า รถป้ายเหลือง",
  },
  LUXURY_SUPERCAR: {
    summary: "แผนพิเศษสำหรับรถมูลค่าสูง ซ่อมห้าง อะไหล่แท้",
    coverage: [
      "ทุนประกันสูงตามมูลค่ารถจริง",
      "เลือกอู่ซ่อมห้าง/ศูนย์บริการที่กำหนดเองได้",
      "คุ้มครองอุปกรณ์ตกแต่งพิเศษ (แจ้งเพิ่มได้)",
    ],
    suitableFor: "รถยุโรป รถสปอร์ต supercar และรถสะสมมูลค่าสูง",
  },
  EV: {
    summary: "ออกแบบสำหรับรถไฟฟ้าโดยเฉพาะ รวมความเสี่ยงเรื่องแบตเตอรี่",
    coverage: [
      "คุ้มครองแบตเตอรี่ตามเงื่อนไขกรมธรรม์ EV",
      "เครื่องชาร์จติดผนัง (Wall Charger) แจ้งคุ้มครองเพิ่มได้",
      "ความคุ้มครองหลักเทียบเท่าชั้น 1",
    ],
    suitableFor: "รถยนต์ไฟฟ้า 100% และปลั๊กอินไฮบริดทุกรุ่น",
  },
  FIRE: {
    summary: "คุ้มครองบ้านและทรัพย์สินจากไฟไหม้และภัยธรรมชาติ",
    coverage: [
      "ไฟไหม้ ฟ้าผ่า ระเบิด",
      "ภัยน้ำท่วม ลมพายุ ลูกเห็บ แผ่นดินไหว (เลือกซื้อเพิ่ม)",
      "ทรัพย์สินภายในบ้าน (แจ้งทุนเพิ่มได้)",
    ],
    suitableFor: "บ้านอยู่อาศัย ทาวน์โฮม อาคารพาณิชย์ และทรัพย์สินให้เช่า",
  },
  CONSTRUCTION: {
    summary: "คุ้มครองงานก่อสร้างและความรับผิดระหว่างดำเนินโครงการ",
    coverage: [
      "ความเสียหายต่อตัวงานก่อสร้าง (CAR/EAR)",
      "ความรับผิดต่อบุคคลภายนอกจากงานก่อสร้าง",
      "เครื่องมือเครื่องจักรที่ใช้ในโครงการ",
    ],
    suitableFor: "ผู้รับเหมา เจ้าของโครงการ งานต่อเติม/สร้างใหม่ทุกขนาด",
  },
  OTHER: {
    summary: "ประกันภัยอื่นๆ สอบถามได้ เรามีพาร์ทเนอร์ครบทุกประเภท",
    coverage: [
      "ประกันเดินทาง ประกันอุบัติเหตุส่วนบุคคล (PA)",
      "ประกันสุขภาพ ประกันร้านค้า/SME",
      "ประกันขนส่งสินค้า (Cargo)",
    ],
    suitableFor: "แจ้งความต้องการมาได้เลย เจ้าหน้าที่จะแนะนำแผนที่เหมาะสมให้",
  },
};

export function buildCompanyProfileText(profile: CompanyProfile): string {
  return [
    `🏢 ${profile.name}`,
    profile.description,
    profile.license,
    "",
    `📍 ${profile.address}`,
    `🗺️ ${profile.serviceArea}`,
  ].join("\n");
}

export function buildContactText(profile: CompanyProfile): string {
  return [
    `ช่องทางติดต่อ ${profile.name}`,
    `📞 โทร: ${profile.phone} / ${profile.mobile}`,
    `💬 LINE: ${profile.lineOa}`,
    `📘 Facebook: ${profile.facebook}`,
    `🕘 เวลาทำการ: ${profile.businessHours}`,
  ].join("\n");
}

export function buildHighlightsText(profile: CompanyProfile): string {
  return ["ทำไมต้องเช็คเบี้ยกับเรา ✨", ...profile.highlights.map((h) => `• ${h}`)].join("\n");
}
