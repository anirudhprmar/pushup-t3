CREATE TABLE "pushup_habit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"habit_id" uuid NOT NULL,
	"date" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pushup_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"habit_id" uuid,
	"task" text,
	"started_at" timestamp,
	"completed_at" timestamp,
	"completed" boolean DEFAULT false NOT NULL,
	"target_value" integer,
	"target_unit" text,
	"notes" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
DROP TABLE "pushup_habit_log" CASCADE;--> statement-breakpoint
DROP TABLE "pushup_user_tasks" CASCADE;--> statement-breakpoint
ALTER TABLE "pushup_habit_logs" ADD CONSTRAINT "pushup_habit_logs_habit_id_pushup_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."pushup_habits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pushup_tasks" ADD CONSTRAINT "pushup_tasks_user_id_pushup_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."pushup_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pushup_tasks" ADD CONSTRAINT "pushup_tasks_habit_id_pushup_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."pushup_habits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "habit_log_habit_id_idx" ON "pushup_habit_logs" USING btree ("habit_id");--> statement-breakpoint
CREATE INDEX "habit_log_date_idx" ON "pushup_habit_logs" USING btree ("date");--> statement-breakpoint
CREATE UNIQUE INDEX "habit_log_unique_daily" ON "pushup_habit_logs" USING btree ("habit_id","date");--> statement-breakpoint
CREATE INDEX "user_task_idx" ON "pushup_tasks" USING btree ("task");