ALTER TABLE "verification" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET NOT NULL;