import { FlexMessage } from "@line/bot-sdk";
import { InsuranceType, INSURANCE_TYPE_LABEL_TH } from "../types/conversation";
import { buildPostbackData } from "../types/postback";

const INSURANCE_TYPE_ORDER: InsuranceType[] = [
  "CAR_CLASS_1",
  "CAR_CLASS_2_3",
  "RENTAL_COMMERCIAL",
  "LUXURY_SUPERCAR",
  "EV",
  "FIRE",
  "CONSTRUCTION",
  "OTHER",
];

export function buildInsuranceTypeMenuFlex(): FlexMessage {
  return {
    type: "flex",
    altText: "กรุณาเลือกประเภทประกัน",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          { type: "text", text: "เลือกประเภทประกันที่ต้องการเช็คเบี้ย", weight: "bold", size: "md", wrap: true },
          {
            type: "box",
            layout: "vertical",
            spacing: "xs",
            margin: "md",
            contents: INSURANCE_TYPE_ORDER.map((insuranceType) => ({
              type: "button" as const,
              style: "secondary" as const,
              height: "sm" as const,
              action: {
                type: "postback" as const,
                label: INSURANCE_TYPE_LABEL_TH[insuranceType],
                data: buildPostbackData("select_insurance_type", insuranceType),
                displayText: INSURANCE_TYPE_LABEL_TH[insuranceType],
              },
            })),
          },
        ],
      },
    },
  };
}
