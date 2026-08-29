CREATE TYPE "memory_type" AS ENUM('web', 'video', 'note', 'image', 'document', 'voice');--> statement-breakpoint
CREATE TABLE "collection_memories" (
	"collection_id" uuid,
	"memory_id" uuid,
	CONSTRAINT "collection_memories_pkey" PRIMARY KEY("collection_id","memory_id")
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"icon" varchar(50) DEFAULT 'folder-outline' NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"type" "memory_type" NOT NULL,
	"title" text DEFAULT 'Untitled' NOT NULL,
	"url" text,
	"content" text,
	"description" text,
	"source" varchar(100),
	"favicon_url" text,
	"preview_image_url" text,
	"keywords" text[],
	"is_favorite" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"in_trash" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memory_tags" (
	"memory_id" uuid,
	"tag_id" uuid,
	CONSTRAINT "memory_tags_pkey" PRIMARY KEY("memory_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_collection_memories_memory_id" ON "collection_memories" ("memory_id");--> statement-breakpoint
CREATE INDEX "idx_collections_user_id" ON "collections" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_memories_user_id" ON "memories" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_memories_user_created" ON "memories" ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_memory_tags_tag_id" ON "memory_tags" ("tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_tags_user_name" ON "tags" ("user_id","name");--> statement-breakpoint
ALTER TABLE "collection_memories" ADD CONSTRAINT "collection_memories_collection_id_collections_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "collection_memories" ADD CONSTRAINT "collection_memories_memory_id_memories_id_fkey" FOREIGN KEY ("memory_id") REFERENCES "memories"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "memories" ADD CONSTRAINT "memories_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "memory_tags" ADD CONSTRAINT "memory_tags_memory_id_memories_id_fkey" FOREIGN KEY ("memory_id") REFERENCES "memories"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "memory_tags" ADD CONSTRAINT "memory_tags_tag_id_tags_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;