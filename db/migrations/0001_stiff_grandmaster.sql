DO $$ BEGIN
 CREATE TYPE "billboard_status" AS ENUM('active', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "booking_status" AS ENUM('pending', 'approved', 'rejected', 'ended');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "schedule" AS ENUM('weekly', 'monthly');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "ad_spaces" RENAME TO "bookings";--> statement-breakpoint
ALTER TABLE "billboards" ALTER COLUMN "address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "billboards" ALTER COLUMN "location" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "billboard_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "billboards" ADD COLUMN "status" "billboard_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "billboards" ADD COLUMN "daily_impressions" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "billboards" ADD COLUMN "schedule" "schedule" NOT NULL;--> statement-breakpoint
ALTER TABLE "billboards" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "billboards" ADD COLUMN "resolution_width" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "billboards" ADD COLUMN "resolution_height" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "billboards" ADD COLUMN "width" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "billboards" ADD COLUMN "height" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "billboards" ADD COLUMN "spot_duration" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "billboards" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "billboards" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "schedule" "schedule" NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "start_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "end_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "status" "booking_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;