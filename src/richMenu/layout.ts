import { RichMenu, Size } from "@line/bot-sdk";
import { Service } from "../types/conversation";
import { buildPostbackData } from "../types/postback";

const COLUMN_WIDTH = 625;
const MENU_HEIGHT = 843;

export const RICH_MENU_SIZE: Size = { width: COLUMN_WIDTH * 4, height: MENU_HEIGHT };

export const RICH_MENU_TABS: { service: Service; label: string }[] = [
  { service: "CHECK_PREMIUM", label: "เช็คเบี้ยประกัน" },
  { service: "RENEW_PREMIUM", label: "เช็คเบี้ยต่ออายุ" },
  { service: "INQUIRY", label: "สอบถามข้อมูล" },
  { service: "OTHER", label: "บริการอื่นๆ" },
];

// Tap areas mirror the main menu Flex buttons — tapping one fires the same
// select_service postback handled in conversationRouter.service.ts.
export const RICH_MENU_AREAS: RichMenu["areas"] = RICH_MENU_TABS.map((tab, index) => ({
  bounds: { x: index * COLUMN_WIDTH, y: 0, width: COLUMN_WIDTH, height: MENU_HEIGHT },
  action: {
    type: "postback",
    data: buildPostbackData("select_service", tab.service),
    displayText: tab.label,
  },
}));
