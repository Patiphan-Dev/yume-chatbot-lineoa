import { Message } from "@line/bot-sdk";
import { buildCompanyProfileText, buildContactText, buildHighlightsText } from "../config/companyKnowledge";
import { buildInfoMenuFlex } from "../flex/infoMenu.flex";
import { INSURANCE_TYPE_LABEL_TH, InsuranceType } from "../types/conversation";
import { getCompanyProfile, getInsuranceInfo } from "./companySettings.service";

function isInsuranceType(value: string): value is InsuranceType {
  return value in INSURANCE_TYPE_LABEL_TH;
}

async function buildInsuranceInfoText(type: InsuranceType): Promise<string> {
  const info = (await getInsuranceInfo())[type];
  return [
    `${INSURANCE_TYPE_LABEL_TH[type]}`,
    info.summary,
    "",
    "ความคุ้มครองหลัก:",
    ...info.coverage.map((item) => `• ${item}`),
    "",
    `เหมาะกับ: ${info.suitableFor}`,
    "",
    "อยากรู้เบี้ยของรถ/ทรัพย์สินคุณเท่าไหร่ กดเมนู “เช็คเบี้ยประกัน” ด้านล่างได้เลยครับ",
  ].join("\n");
}

/**
 * Resolves a show_info postback value ("company" | "contact" | "highlights" |
 * "insurance:<TYPE>") into the reply message. Unknown values re-show the menu.
 */
export async function buildInfoReply(value: string): Promise<Message> {
  if (value === "company") return { type: "text", text: buildCompanyProfileText(await getCompanyProfile()) };
  if (value === "contact") return { type: "text", text: buildContactText(await getCompanyProfile()) };
  if (value === "highlights") return { type: "text", text: buildHighlightsText(await getCompanyProfile()) };

  const [prefix, type] = value.split(":");
  if (prefix === "insurance" && type && isInsuranceType(type)) {
    return { type: "text", text: await buildInsuranceInfoText(type) };
  }

  return buildInfoMenuFlex();
}
