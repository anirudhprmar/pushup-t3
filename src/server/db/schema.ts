// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `pushup_${name}`);

export const user = createTable(
  "user",
  (d) => ({
    id: d.text("id").primaryKey(),
     name: d.text("name").notNull(),
     email: d.text("email").notNull().unique(),
     emailVerified: d.boolean("email_verified")
       .$defaultFn(() => false)
       .notNull(),
     image: d.text("image"),
     createdAt: d.timestamp("created_at")
       .$defaultFn(() => new Date())
       .notNull(),
     updatedAt: d.timestamp("updated_at")
       .$defaultFn(() => new Date())
       .notNull(),
  }),
  (t) => [index("email_idx").on(t.email)],
) 
// like as mentioned a timer also a more button on the button or link to navigate to /profile/habit/:id and give a complete analysis like last 90 days actions / consistency and other analytics like a daily log of what got achived 
//feat: 
// 1. if timer based habit then timer (if timer finished ask is the habit done or not if not then reset timer)  
// 2. daily log of what you did in that habit like study for 3 hr but what did you study   
// 3. min. action required is the goal of the habit like read 20 pages, do 20 pushups, study for 3hr. 
// 4. done,doing,notdone


export const habit = createTable(
  "habit",
  (d) => ({
    id: d.integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: d.text("name").notNull(),
    goal: d.text("goal").notNull(),
    description: d.text("description"),
    
    // Timer-based habit support
    isTimerBased: d.boolean("is_timer_based").default(false).notNull(),
    timerDuration: d.integer("timer_duration"), // Duration in minutes
    
    // Minimum action required (e.g., "20 pages", "30 minutes", "50 pushups")
    minActionRequired: d.text("min_action_required"),
    minActionValue: d.integer("min_action_value"), // Numeric value for tracking
    minActionUnit: d.text("min_action_unit"), // Unit: "pages", "minutes", "reps", etc.
    
    // Current status for today
    currentStatus: d.text("current_status", { 
      enum: ["not_started", "in_progress", "completed"] 
    }).default("not_started").notNull(),
    
    userId: d.text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    
    createdAt: d.timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  }),
  (t) => [
    index("habit_name_idx").on(t.name),
    index("habit_user_id_idx").on(t.userId),
  ],
) 

// Enhanced habit log for basic check-ins
export const habitLog = createTable(
  "habit_log",
  (d) => ({
    id: d.integer("id").primaryKey().generatedByDefaultAsIdentity(),
    habitId: d.integer("habit_id")
      .notNull()
      .references(() => habit.id, { onDelete: "cascade" }),
    userId: d.text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    
    checkinDate: d.date("checkin_date").notNull(),
    completed: d.boolean("completed").notNull(),
    
    // Status tracking
    status: d.text("status", { 
      enum: ["done", "doing", "not_done"] 
    }).default("not_done").notNull(),
    
    // Action tracking
    actionTaken: d.text("action_taken"),
    actionValue: d.integer("action_value"), // Actual value achieved
    
    // Timer tracking
    timerStartedAt: d.timestamp("timer_started_at"),
    timerCompletedAt: d.timestamp("timer_completed_at"),
    timerDuration: d.integer("timer_duration"), // Actual duration in minutes
    
    createdAt: d.timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  }),
  (t) => [
    index("habit_log_habit_id_idx").on(t.habitId),
    index("habit_log_user_date_idx").on(t.userId, t.checkinDate),
  ],
)

// New table: Daily log entries with detailed notes
export const habitDailyLog = createTable(
  "habit_daily_log",
  (d) => ({
    id: d.integer("id").primaryKey().generatedByDefaultAsIdentity(),
    habitId: d.integer("habit_id")
      .notNull()
      .references(() => habit.id, { onDelete: "cascade" }),
    userId: d.text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    
    logDate: d.date("log_date").notNull(),
    
    // Detailed entry: "What did you study?", "What exercises?", etc.
    entry: d.text("entry").notNull(),
    
    // Optional: Link to the habit log for the day
    habitLogId: d.integer("habit_log_id")
      .references(() => habitLog.id, { onDelete: "cascade" }),
    
    // Metadata
    duration: d.integer("duration"), // Time spent in minutes
    actionValue: d.integer("action_value"), // Pages read, reps done, etc.
    
    createdAt: d.timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  }),
  (t) => [
    index("daily_log_habit_id_idx").on(t.habitId),
    index("daily_log_user_date_idx").on(t.userId, t.logDate),
  ],
)


export const userStats = createTable(
  "user_stats",
  (d)=>({
    id:d.serial("id").primaryKey(),
    userId: d.text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete:  "cascade" }),
    currentStreak:d.integer("current_streak").default(0),
    longestStreak:d.integer("longest_streak").default(0),
    totalConsistentDays:d.integer("total_consistent_days").default(0),
    updatedAt: d.timestamp("updated_at")
    .$defaultFn(()=> new Date())
    .notNull()
  }),
  (t) => [index("userstats_leaderboard_idx").on(t.currentStreak.desc(),t.longestStreak.desc())],
)

export const session = createTable("session", (d)=>({
  id: d.text("id").primaryKey(),
  expiresAt: d.timestamp("expires_at").notNull(),
  token: d.text("token").notNull().unique(),
  createdAt: d.timestamp("created_at").notNull(),
  updatedAt: d.timestamp("updated_at").notNull(),
  ipAddress: d.text("ip_address"),
  userAgent: d.text("user_agent"),
  userId: d.text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: d.text("impersonated_by"),
}));

export const account = createTable("account", (d)=>({
  id: d.text("id").primaryKey(),
  accountId: d.text("account_id").notNull(),
  providerId: d.text("provider_id").notNull(),
  userId: d.text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: d.text("access_token"),
  refreshToken: d.text("refresh_token"),
  idToken: d.text("id_token"),
  accessTokenExpiresAt: d.timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: d.timestamp("refresh_token_expires_at"),
  scope: d.text("scope"),
  password: d.text("password"),
  createdAt: d.timestamp("created_at").notNull(), 
  updatedAt: d.timestamp("updated_at").notNull(),
}));

export const verification = createTable("verification", (d)=>({
  id: d.text("id").primaryKey(),
  identifier: d.text("identifier").notNull(),
  value: d.text("value").notNull(),
  expiresAt: d.timestamp("expires_at").notNull(),
  createdAt: d.timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: d.timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
}));