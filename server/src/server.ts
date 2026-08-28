import "dotenv/config";
import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./shared/utils/logger";

const app = createApp();
const port = env.PORT;

app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});
