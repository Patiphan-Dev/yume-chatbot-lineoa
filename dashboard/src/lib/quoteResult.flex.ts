import { FlexComponent, FlexMessage } from "@line/bot-sdk";

export function buildQuoteResultFlex(insuranceTypeLabel: string, premium: number, note?: string | null): FlexMessage {
  const noteComponent: FlexComponent[] = note
    ? [{ type: "text", text: note, size: "sm", wrap: true, color: "#666666" }]
    : [];

  return {
    type: "flex",
    altText: `เบี้ยประกันของคุณ: ${premium.toLocaleString("th-TH")} บาท`,
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          { type: "text", text: "ผลการเช็คเบี้ยประกัน", weight: "bold", size: "lg" },
          { type: "text", text: insuranceTypeLabel, size: "sm", color: "#999999" },
          { type: "separator" },
          {
            type: "box",
            layout: "baseline",
            contents: [
              { type: "text", text: "เบี้ยประกัน", flex: 1 },
              {
                type: "text",
                text: `${premium.toLocaleString("th-TH")} บาท`,
                weight: "bold",
                color: "#B8862E",
                flex: 0,
              },
            ],
          },
          ...noteComponent,
        ],
      },
    },
  };
}
