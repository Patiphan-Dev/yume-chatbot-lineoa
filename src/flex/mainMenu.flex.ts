import { FlexMessage } from "@line/bot-sdk";
import { Service, SERVICE_LABEL_TH } from "../types/conversation";
import { buildPostbackData } from "../types/postback";

const SERVICE_ORDER: Service[] = ["CHECK_PREMIUM", "RENEW_PREMIUM", "INQUIRY", "OTHER"];

export function buildMainMenuFlex(): FlexMessage {
  return {
    type: "flex",
    altText: "เลือกบริการที่ต้องการ",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          { type: "text", text: "YUME Insurance", weight: "bold", size: "lg" },
          {
            type: "text",
            text: "กรุณาเลือกบริการที่ต้องการ",
            size: "sm",
            color: "#999999",
            wrap: true,
          },
          {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            margin: "md",
            contents: SERVICE_ORDER.map((service) => ({
              type: "button" as const,
              style: "primary" as const,
              color: "#B8862E",
              action: {
                type: "postback" as const,
                label: SERVICE_LABEL_TH[service],
                data: buildPostbackData("select_service", service),
                displayText: SERVICE_LABEL_TH[service],
              },
            })),
          },
        ],
      },
    },
  };
}
