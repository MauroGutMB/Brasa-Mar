CREATE TYPE "public"."dish_tag" AS ENUM('carnes', 'mar', 'para-dividir');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(160) NOT NULL,
	"name" varchar(120) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dishes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(120) NOT NULL,
	"price_cents" integer NOT NULL,
	"description" text NOT NULL,
	"tag" "dish_tag" NOT NULL,
	"image_url" text,
	"image_alt" varchar(200) DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dishes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "opening_hours" (
	"weekday" smallint PRIMARY KEY NOT NULL,
	"label" varchar(20) NOT NULL,
	"opens_at" varchar(5) DEFAULT '' NOT NULL,
	"closes_at" varchar(5) DEFAULT '' NOT NULL,
	"closed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" smallint PRIMARY KEY DEFAULT 1 NOT NULL,
	"name" varchar(120) NOT NULL,
	"tagline" varchar(160) NOT NULL,
	"kicker" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"hero_title_line1" varchar(80) NOT NULL,
	"hero_title_line2" varchar(80) NOT NULL,
	"hero_badge" varchar(120) NOT NULL,
	"hero_text" text NOT NULL,
	"hero_image_url" text,
	"hero_image_alt" varchar(200) NOT NULL,
	"hero_secondary_image_url" text,
	"hero_secondary_image_alt" varchar(200) NOT NULL,
	"dishes_note" text DEFAULT '' NOT NULL,
	"buffet_eyebrow" varchar(120) NOT NULL,
	"buffet_badge" varchar(120) NOT NULL,
	"buffet_text" text NOT NULL,
	"buffet_features_intro" text DEFAULT '' NOT NULL,
	"buffet_closing" text DEFAULT '' NOT NULL,
	"buffet_image_url" text,
	"buffet_image_alt" varchar(200) NOT NULL,
	"buffet_occasions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"buffet_features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"phone" varchar(40) NOT NULL,
	"email" varchar(160) DEFAULT '' NOT NULL,
	"street" varchar(160) NOT NULL,
	"number" varchar(20) NOT NULL,
	"district" varchar(120) NOT NULL,
	"city" varchar(120) NOT NULL,
	"state" varchar(2) NOT NULL,
	"zip" varchar(20) DEFAULT '' NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"location_note" varchar(240) DEFAULT '' NOT NULL,
	"seo_keywords" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"og_image_url" text DEFAULT '/og.jpg' NOT NULL,
	"show_prices" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
