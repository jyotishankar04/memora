import "dotenv/config";
import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./shared/utils/logger";
import { startIngestionWorker } from "./modules/ai";
import { startTrashPurgeWorker } from "./modules/memory/trash-purge.job";
import { startEmailWorker } from "./modules/email";
import { startAccountDeletionWorker } from "./modules/account";

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

try {
  startTrashPurgeWorker();
  logger.info("Trash purge worker started");
} catch (err) {
  logger.error({ err }, "Failed to start trash purge worker — trashed memories will not be auto-deleted");
}

try {
  startEmailWorker();
  logger.info("Email worker started");
} catch (err) {
  logger.error({ err }, "Failed to start email worker — outgoing email will not be sent");
}

try {
  startAccountDeletionWorker();
  logger.info("Account deletion worker started");
} catch (err) {
  logger.error({ err }, "Failed to start account deletion worker — scheduled account wipes will not run");
}
