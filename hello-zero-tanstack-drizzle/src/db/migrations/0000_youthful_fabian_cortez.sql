CREATE SCHEMA "zero";
--> statement-breakpoint
CREATE TABLE "todo" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"description" varchar(255) NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "zero"."schemaVersions" (
	"minSupportedVersion" integer,
	"maxSupportedVersion" integer,
	"lock" boolean PRIMARY KEY DEFAULT true NOT NULL,
	CONSTRAINT "zero_schema_versions_single_row_constraint" CHECK ("zero"."schemaVersions"."lock")
);
