// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { index, pgTableCreator, uniqueIndex } from "drizzle-orm/pg-core";

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


export const habit = createTable(
  "habit",
  (d) => ({
    id: d.integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: d.text("name").notNull(),
    goal: d.text("goal").notNull(),
    description: d.text("description"),
    
    // Categorization for UI (tags/badges)
    category: d.text("category"), // e.g., "Fitness", "Learning", "Health"
    color: d.text("color"), // Hex color for UI customization
    
    // Habit type
    habitType: d.text("habit_type", {
      enum: ["boolean", "numeric", "timer"] // Simple boolean check, numeric goal, or timer-based
    }).default("boolean").notNull(),
    
    // Target value (for numeric/timer habits)
    targetValue: d.integer("target_value"), // e.g., 20 pages, 30 minutes, 50 pushups
    targetUnit: d.text("target_unit"), // e.g., "pages", "minutes", "reps"
    
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
    index("habit_user_id_idx").on(t.userId),
    index("habit_category_idx").on(t.category),
  ],
) 

// Simplified habit log - one entry per habit per day
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
    
    // Date of this log entry
    date: d.date("date").notNull(),
    
    // Completion status (simplified - just one field)
    completed: d.boolean("completed").default(false).notNull(),
    
    // Actual value achieved (for numeric/timer habits)
    actualValue: d.integer("actual_value"), // Pages read, minutes spent, reps done
    
    // Optional notes about what was done
    notes: d.text("notes"),
    
    // Timer tracking (only if habit is timer-based)
    startedAt: d.timestamp("started_at"),
    completedAt: d.timestamp("completed_at"),
    
    createdAt: d.timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  }),
  (t) => [
    index("habit_log_habit_id_idx").on(t.habitId),
    index("habit_log_user_date_idx").on(t.userId, t.date),
    // Unique constraint: one log per habit per day
    uniqueIndex("habit_log_unique_daily").on(t.habitId, t.date),
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