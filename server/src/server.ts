import "dotenv/config";
import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./shared/utils/logger";
import { startIngestionWorker } from "./modules/ai";

const app = createApp();
const port = env.PORT;

app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});

// Same process as the API for now — fine for dev, see the AI ingestion plan
// for splitting this into its own process/deployment in production.
try {
  startIngestionWorker();
  logger.info("Ingestion worker started");
} catch (err) {
  logger.error({ err }, "Failed to start ingestion worker — AI ingestion will not run");
}
