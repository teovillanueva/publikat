CREATE TABLE IF NOT EXISTS "ad_spaces" (
	"id" text PRIMARY KEY NOT NULL,
	"billboard_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billboards" (
	"id" text PRIMARY KEY NOT NULL,
	"address" text,
	"location" geometry(Point,4326)
);
