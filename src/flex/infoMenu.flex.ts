import { FlexButton, FlexMessage } from "@line/bot-sdk";
import { INSURANCE_TYPE_LABEL_TH, InsuranceType } from "../types/conversation";
import { buildPostbackData } from "../types/postback";

const GOLD = "#B8862E";

function infoButton(label: string, value: string, primary = false): FlexButton {
  return {
    type: "button",
    style: primary ? "primary" : "secondary",
    height: "sm",
    color: primary ? GOLD : undefined,
    action: { type: "postback", label, data: buildPostbackData("show_info", value), displayText: label },
  };
}

/** Self-service info menu shown when the customer taps "สอบถามข้อมูล". */
export function buildInfoMenuFlex(): FlexMessage {
  const insuranceButtons = (Object.keys(INSURANCE_TYPE_LABEL_TH) as InsuranceType[]).map((type) =>
    infoButton(INSURANCE_TYPE_LABEL_TH[type], `insurance:${type}`),
  );

  return {
    type: "flex",
    altText: "สอบถามข้อมูล YUME Insurance",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          { type: "text", text: "อยากรู้เรื่องไหนครับ 😊", weight: "bold", size: "md", wrap: true },
          { type: "text", text: "เลือกหัวข้อด้านล่างได้เลย", size: "sm", color: "#999999" },
          {
            type: "box",
            layout: "vertical",
            spacing: "xs",
            margin: "md",
            contents: [
              infoButton("ข้อมูลบริษัท", "company", true),
              infoButton("ช่องทางติดต่อ / เวลาทำการ", "contact", true),
              infoButton("จุดเด่นของเรา", "highlights", true),
              { type: "separator", margin: "sm" },
              {
                type: "text",
                text: "ข้อมูลประกันแต่ละประเภท",
                size: "xs",
                color: "#999999",
                margin: "sm",
              },
              ...insuranceButtons,
            ],
          },
        ],
      },
    },
  };
}
