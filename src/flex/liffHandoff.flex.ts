import { FlexMessage } from "@line/bot-sdk";
import { env } from "../config/env";
import { InsuranceType, INSURANCE_TYPE_LABEL_TH } from "../types/conversation";

/** Prompts the user to open the LIFF form (car info) for the request just created. */
export function buildLiffHandoffFlex(requestId: string, insuranceType: InsuranceType): FlexMessage {
  const formUrl = `${env.LIFF_APP_URL}?requestId=${encodeURIComponent(requestId)}&insuranceType=${encodeURIComponent(insuranceType)}`;

  return {
    type: "flex",
    altText: "กรุณากรอกข้อมูลรถ",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          { type: "text", text: INSURANCE_TYPE_LABEL_TH[insuranceType], weight: "bold", size: "md" },
          {
            type: "text",
            text: "กรุณากรอกข้อมูลรถ เพื่อให้เจ้าหน้าที่ตรวจสอบเบี้ยประกันให้ครับ",
            size: "sm",
            color: "#999999",
            wrap: true,
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#B8862E",
            action: { type: "uri", label: "กรอกข้อมูลรถ", uri: formUrl },
          },
        ],
      },
    },
  };
}
