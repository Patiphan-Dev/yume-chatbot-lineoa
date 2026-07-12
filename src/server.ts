import { createApp } from "./expressApp";
import { env } from "./config/env";
import { logger } from "./lib/logger";

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`YUME LINE OA webhook server listening on port ${env.PORT}`);
});
