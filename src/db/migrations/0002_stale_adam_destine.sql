ALTER TABLE "users" ADD COLUMN "password_hash" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_password_hash_unique" UNIQUE("password_hash");