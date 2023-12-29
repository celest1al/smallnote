CREATE TABLE IF NOT EXISTS "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"image_url" text,
	"user_id" text NOT NULL,
	"editor_state" text
);
