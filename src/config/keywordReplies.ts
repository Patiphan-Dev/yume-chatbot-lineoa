export interface KeywordReplyRule {
  id: string;
  keywords: string[];
  reply: string;
  /** Also push the customer's message to the staff group when this rule fires. */
  escalateToStaff?: boolean;
}

export const KEYWORD_REPLY_RULES: KeywordReplyRule[] = [
  {
    id: "greeting",
    keywords: ["สวัสดี", "หวัดดี", "hello", "hi"],
    reply: "สวัสดีครับ 😊 ยินดีต้อนรับสู่ YUME Insurance\nกดปุ่มด้านล่างเพื่อเลือกบริการที่ต้องการได้เลยครับ",
  },
  {
    id: "thanks",
    keywords: ["ขอบคุณ", "thank"],
    reply: "ยินดีให้บริการครับ 🙏 หากต้องการสอบถามเพิ่มเติม พิมพ์มาได้เลยครับ",
  },
  {
    id: "pricing_question",
    keywords: ["เบี้ยเท่าไหร่", "ราคาเท่าไหร่", "ราคาประกัน", "เช็คราคา", "เช็คเบี้ย"],
    reply: "การเช็คเบี้ยประกันต้องขอข้อมูลรถของลูกค้าก่อนครับ กดปุ่มด้านล่างเพื่อเริ่มเช็คเบี้ยได้เลยครับ",
  },
  {
    id: "human_handoff",
    keywords: ["คุยกับเจ้าหน้าที่", "ติดต่อเจ้าหน้าที่", "คุยกับแอดมิน", "ขอเจ้าหน้าที่", "พนักงาน"],
    reply: "รับเรื่องแล้วครับ เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุดครับ",
    escalateToStaff: true,
  },
];

/** First rule whose keyword appears in the message, case-insensitive. Order matters — more
 *  specific rules (e.g. pricing) should come before generic ones. */
export function matchKeywordReply(text: string): KeywordReplyRule | undefined {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return undefined;

  return KEYWORD_REPLY_RULES.find((rule) =>
    rule.keywords.some((keyword) => normalized.includes(keyword.toLowerCase())),
  );
}
