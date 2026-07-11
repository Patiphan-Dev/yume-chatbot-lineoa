import { readFile } from "fs/promises";
import path from "path";
import { lineClient } from "../lib/line/client";
import { logger } from "../lib/logger";
import { RICH_MENU_AREAS, RICH_MENU_SIZE } from "../richMenu/layout";

// LINE caps rich menu images at 1MB — JPEG compresses this gradient/photo-style design far
// better than PNG while staying visually identical.
const DEFAULT_RICH_MENU_IMAGE_PATH = path.join(__dirname, "..", "richMenu", "assets", "rich-menu.jpg");

function contentTypeForImage(imagePath: string): string {
  return imagePath.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
}

/** One-time setup: creates the rich menu, uploads its image, and sets it as the account default. */
export async function createAndPublishRichMenu(imagePath?: string): Promise<string> {
  const resolvedImagePath = imagePath ?? DEFAULT_RICH_MENU_IMAGE_PATH;

  const richMenuId = await lineClient.createRichMenu({
    size: RICH_MENU_SIZE,
    selected: true,
    name: "YUME Insurance - Main Menu",
    chatBarText: "เมนู",
    areas: RICH_MENU_AREAS,
  });

  const image = await readFile(resolvedImagePath);
  await lineClient.setRichMenuImage(richMenuId, image, contentTypeForImage(resolvedImagePath));
  await lineClient.setDefaultRichMenu(richMenuId);

  return richMenuId;
}

/** Explicit per-user link, called on follow so intent stays visible even though setDefaultRichMenu
 *  already covers new followers — this is the hook to reach for once menus start varying by user segment. */
export async function linkRichMenuToUser(lineUserId: string, richMenuId: string): Promise<void> {
  try {
    await lineClient.linkRichMenuToUser(lineUserId, richMenuId);
  } catch (error) {
    logger.error({ error, lineUserId, richMenuId }, "Failed to link rich menu to user");
  }
}
