import { logger } from "../lib/logger";
import { createAndPublishRichMenu } from "../services/richMenu.service";

/**
 * Run once (`npm run richmenu:setup`) whenever the rich menu layout or image changes.
 * Defaults to src/richMenu/assets/rich-menu.jpg; set RICH_MENU_IMAGE_PATH to point at a
 * different designed image (2500x843, under LINE's 1MB limit) if you want to swap it out.
 */
async function main(): Promise<void> {
  const richMenuId = await createAndPublishRichMenu(process.env.RICH_MENU_IMAGE_PATH);
  logger.info(
    { richMenuId },
    "Rich menu created and set as account default. Save this ID as LINE_RICH_MENU_ID in .env to also link it explicitly on follow.",
  );
}

main().catch((error) => {
  logger.error({ error }, "Failed to set up rich menu");
  process.exit(1);
});
