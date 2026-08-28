CREATE TYPE "organize_mode" AS ENUM('auto', 'manual');--> statement-breakpoint
CREATE TABLE "user_onboarding" (
	"user_id" uuid PRIMARY KEY,
	"interests" jsonb DEFAULT '[]' NOT NULL,
	"content_types" jsonb DEFAULT '[]' NOT NULL,
	"organize_mode" "organize_mode" DEFAULT 'auto'::"organize_mode" NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_onboarding" ADD CONSTRAINT "user_onboarding_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;