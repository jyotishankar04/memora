-- Must run before the vector/tsvector columns below — local/dev only
-- (pgvector/pgvector image, see docker-compose.yml); production uses
-- Upstash Vector instead (VECTOR_STORE_PROVIDER=upstash), so the `vector`
-- extension is never needed there.
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
--> statement-breakpoint
CREATE TABLE "memory_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"memory_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"chunk_index" integer NOT NULL,
	"chunk_content" text NOT NULL,
	"token_count" integer,
	"embedding" vector(1536) NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "document_embedding" vector(1536);--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "fts_tokens" tsvector;--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "resource_category" text;--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "inferred_intent" text;--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "intent_confidence" real;--> statement-breakpoint
CREATE INDEX "idx_memory_chunks_user_memory" ON "memory_chunks" ("user_id","memory_id");--> statement-breakpoint
ALTER TABLE "memory_chunks" ADD CONSTRAINT "memory_chunks_memory_id_memories_id_fkey" FOREIGN KEY ("memory_id") REFERENCES "memories"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "memory_chunks" ADD CONSTRAINT "memory_chunks_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint

-- HNSW indexes for cosine-similarity search (docs/AI_REQUIREMENTS.md's tuning).
CREATE INDEX "idx_memories_document_embedding" ON "memories" USING hnsw ("document_embedding" vector_cosine_ops) WITH (m = 16, ef_construction = 64);--> statement-breakpoint
CREATE INDEX "idx_memory_chunks_embedding" ON "memory_chunks" USING hnsw ("embedding" vector_cosine_ops) WITH (m = 16, ef_construction = 64);--> statement-breakpoint

-- Full-text search: fts_tokens is trigger-populated, weighted A=title,
-- B=description+inferred_intent, C=content — the app never writes this
-- column directly (see the tsvector customType in pgvector-type.ts).
CREATE INDEX "idx_memories_fts_tokens" ON "memories" USING gin ("fts_tokens");--> statement-breakpoint

CREATE OR REPLACE FUNCTION memories_fts_tokens_trigger() RETURNS trigger AS $$
BEGIN
  NEW.fts_tokens :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '') || ' ' || coalesce(NEW.inferred_intent, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.content, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint

CREATE TRIGGER memories_fts_tokens_update
  BEFORE INSERT OR UPDATE ON "memories"
  FOR EACH ROW EXECUTE FUNCTION memories_fts_tokens_trigger();