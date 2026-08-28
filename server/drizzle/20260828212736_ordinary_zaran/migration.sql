CREATE TYPE "accent_color" AS ENUM('blue', 'purple', 'green', 'orange');--> statement-breakpoint
CREATE TYPE "settings_theme" AS ENUM('system', 'light', 'dark');--> statement-breakpoint
CREATE TABLE "user_settings" (
	"user_id" uuid PRIMARY KEY,
	"ai_auto_organization" boolean DEFAULT true NOT NULL,
	"ai_summaries" boolean DEFAULT true NOT NULL,
	"ai_related_memories" boolean DEFAULT true NOT NULL,
	"ai_semantic_search" boolean DEFAULT true NOT NULL,
	"ai_ask_memora" boolean DEFAULT true NOT NULL,
	"capture_extract_content" boolean DEFAULT true NOT NULL,
	"capture_generate_title" boolean DEFAULT true NOT NULL,
	"capture_generate_summary" boolean DEFAULT true NOT NULL,
	"capture_suggest_tags" boolean DEFAULT true NOT NULL,
	"notify_weekly_summary" boolean DEFAULT true NOT NULL,
	"notify_forgotten_memories" boolean DEFAULT true NOT NULL,
	"notify_product_updates" boolean DEFAULT false NOT NULL,
	"theme" "settings_theme" DEFAULT 'system'::"settings_theme" NOT NULL,
	"accent_color" "accent_color" DEFAULT 'blue'::"accent_color" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;