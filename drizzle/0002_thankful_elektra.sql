ALTER TABLE "pushup_habit_daily_log" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "pushup_habit_daily_log" CASCADE;--> statement-breakpoint
DROP INDEX "habit_name_idx";--> statement-breakpoint
DROP INDEX "habit_log_user_date_idx";--> statement-breakpoint
ALTER TABLE "pushup_habit_log" ALTER COLUMN "completed" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "pushup_habit" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "pushup_habit" ADD COLUMN "color" text;--> statement-breakpoint
ALTER TABLE "pushup_habit" ADD COLUMN "habit_type" text DEFAULT 'boolean' NOT NULL;--> statement-breakpoint
ALTER TABLE "pushup_habit" ADD COLUMN "target_value" integer;--> statement-breakpoint
ALTER TABLE "pushup_habit" ADD COLUMN "target_unit" text;--> statement-breakpoint
ALTER TABLE "pushup_habit_log" ADD COLUMN "date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "pushup_habit_log" ADD COLUMN "actual_value" integer;--> statement-breakpoint
ALTER TABLE "pushup_habit_log" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "pushup_habit_log" ADD COLUMN "started_at" timestamp;--> statement-breakpoint
ALTER TABLE "pushup_habit_log" ADD COLUMN "completed_at" timestamp;--> statement-breakpoint
CREATE INDEX "habit_category_idx" ON "pushup_habit" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "habit_log_unique_daily" ON "pushup_habit_log" USING btree ("habit_id","date");--> statement-breakpoint
CREATE INDEX "habit_log_user_date_idx" ON "pushup_habit_log" USING btree ("user_id","date");--> statement-breakpoint
ALTER TABLE "pushup_habit" DROP COLUMN "is_timer_based";--> statement-breakpoint
ALTER TABLE "pushup_habit" DROP COLUMN "timer_duration";--> statement-breakpoint
ALTER TABLE "pushup_habit" DROP COLUMN "min_action_required";--> statement-breakpoint
ALTER TABLE "pushup_habit" DROP COLUMN "min_action_value";--> statement-breakpoint
ALTER TABLE "pushup_habit" DROP COLUMN "min_action_unit";--> statement-breakpoint
ALTER TABLE "pushup_habit" DROP COLUMN "current_status";--> statement-breakpoint
ALTER TABLE "pushup_habit_log" DROP COLUMN "checkin_date";--> statement-breakpoint
ALTER TABLE "pushup_habit_log" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "pushup_habit_log" DROP COLUMN "action_taken";--> statement-breakpoint
ALTER TABLE "pushup_habit_log" DROP COLUMN "action_value";--> statement-breakpoint
ALTER TABLE "pushup_habit_log" DROP COLUMN "timer_started_at";--> statement-breakpoint
ALTER TABLE "pushup_habit_log" DROP COLUMN "timer_completed_at";--> statement-breakpoint
ALTER TABLE "pushup_habit_log" DROP COLUMN "timer_duration";