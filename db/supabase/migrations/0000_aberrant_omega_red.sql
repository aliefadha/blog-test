CREATE TYPE "public"."status" AS ENUM('draft', 'scheduled', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"image" varchar,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"category" varchar NOT NULL,
	"tags" varchar,
	"status" "status" DEFAULT 'draft',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"posted_at" timestamp
);
