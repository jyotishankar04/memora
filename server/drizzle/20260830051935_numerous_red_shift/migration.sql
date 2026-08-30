CREATE TYPE "memory_status" AS ENUM('processing', 'ready', 'partial', 'failed');--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "status" "memory_status" DEFAULT 'processing'::"memory_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "normalized_url" text;--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "preview_status" text;--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "preview_source" text;--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "platform" text;--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "resource_type" text;--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "canonical_url" text;--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "fetch_status" text;--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "capture_method" text;--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "browser_capture" jsonb;--> statement-breakpoint
CREATE INDEX "idx_memories_user_normalized_url" ON "memories" ("user_id","normalized_url");--> statement-breakpoint

-- Backfill: every existing row just got status='processing' from the NOT
-- NULL default above, but they already ran through ingestion before this
-- column existed and will never be reprocessed automatically — leaving them
-- at 'processing' would show a permanent, false "still processing" badge.
UPDATE "memories" SET "status" = 'ready' WHERE "resource_category" IS NOT NULL;--> statement-breakpoint
UPDATE "memories" SET "status" = 'partial' WHERE "resource_category" IS NULL;