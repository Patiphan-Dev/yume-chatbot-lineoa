export type PostbackAction = "select_service" | "select_insurance_type" | "show_info";

export interface ParsedPostback {
  action: PostbackAction;
  value: string;
}

/** Postback data is a flat query string, e.g. "action=select_service&value=CHECK_PREMIUM". */
export function parsePostbackData(data: string): ParsedPostback | null {
  const params = new URLSearchParams(data);
  const action = params.get("action");
  const value = params.get("value");

  if (action !== "select_service" && action !== "select_insurance_type" && action !== "show_info") {
    return null;
  }
  if (!value) return null;

  return { action, value };
}

export function buildPostbackData(action: PostbackAction, value: string): string {
  return new URLSearchParams({ action, value }).toString();
}
