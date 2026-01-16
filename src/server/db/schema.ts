// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import { index, pgEnum, pgTableCreator, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
*/
export const createTable = pgTableCreator((name) => `pushup_${name}`);

export const goalType = pgEnum('pushup_goal_type',[
  "DAILY","WEEKLY","MONTHLY","YEARLY","LIFETIME"
])

export const goalStatus = pgEnum('pushup_goal_status',[
  "PENDING","IN_PROGRESS","COMPLETED","FAILED","ACHIEVED"
])

export const notificationType = pgEnum('pushup_notification',[
  "INFO","FEATURE","UPDATE","WARNING","SUCCESS","WELCOME"
])

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
    (t) => [index("user_email_idx").on(t.email)],
  ) 
  
  export const goals = createTable(
    "goals",
    (d) => ({
      id:d.uuid("id").defaultRandom().primaryKey(),
      userId: d.text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
      title:d.text("title").notNull(),
      description:d.text("description"),
      type:goalType().notNull(),
      status:goalStatus().default('PENDING').notNull(),
      targetDeadline:d.timestamp('target_deadline'),
      completedAt:d.timestamp('completed_at'),
      createdAt: d.timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
      updatedAt: d.timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull(),
    }),
    (t) => [index("user_goal_type_idx").on(t.userId,t.type)],
  )

export const habits = createTable(
  "habits",
  (d) => ({
    id: d.uuid("id").defaultRandom().primaryKey(),
    userId: d.text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    goalId:d.uuid("goals_id").references(()=> goals.id,{onDelete:"cascade"}),
    name: d.text("name").notNull(),
    description: d.text("description"),
    category: d.text("category"), 
    color: d.text("color"), 
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

export const habitLogs = createTable(
  "habit_logs",
  (d) => ({
    id: d.uuid("id").defaultRandom().primaryKey(),
    habitId: d.uuid("habit_id")
      .notNull()
      .references(() => habits.id, { onDelete: "cascade" }),
    date: d.text("date").notNull(),
    completed: d.boolean("completed").default(false).notNull(),
    notes: d.text("notes"),
    createdAt: d.timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  }),
  (t) => [
    index("habit_log_habit_id_idx").on(t.habitId),
    index("habit_log_date_idx").on(t.date),
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
    totalHabits:d.integer("total_habits").default(0),
    totalConsistentDays:d.integer("total_consistent_days").default(0),
    updatedAt: d.timestamp("updated_at")
    .$defaultFn(()=> new Date())
    .notNull()
  }),
  (t) => [index("userstats_leaderboard_idx").on(t.totalConsistentDays.desc())],
)

export const tasks = createTable(
  "tasks",
  (d) => ({
    id:d.uuid("id").defaultRandom().primaryKey(),
    userId: d.text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    habitId:d.uuid("habit_id").references(() => habits.id,{onDelete:"cascade"}),
    task:d.text("task"),
    startedAt:d.timestamp("started_at"),
    completedAt:d.timestamp("completed_at"),
    completed:d.boolean("completed").default(false).notNull(),
    targetValue: d.integer("target_value"), 
    targetUnit: d.text("target_unit"), 
    createdAt: d.timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  }),
  (t) => [
    index("user_task_idx").on(t.task),    
    uniqueIndex("tasks_unique_today").on(t.habitId, t.createdAt)
],
)

//might had to update this cause how we store weekly goals or keep track of it
export const weeklyGoals = createTable(
  "weekly_goals",
  (d) => ({
    id:d.uuid("id").defaultRandom().primaryKey(),
    userId: d.text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
    weekNumber:d.integer("week_number").notNull(),
    year:d.integer("year").notNull(),
    theme:d.text("theme"),
    priority:d.text("priority"),
    rating:d.integer("rating").default(0),
    reviewNotes:d.text("review_notes"),
    createdAt:d.timestamp("created_at")
      .$defaultFn(()=> new Date())
      .notNull()
  }),
  (t) => [uniqueIndex("unique_week_plan").on(t.userId,t.year,t.weekNumber)]
)

export const notification = createTable(
  "notifications",
  (d) => ({
    id:d.uuid("id").defaultRandom().primaryKey(),
    userId: d.text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
    title:d.text("title"),
    message:d.text("message"),
    read:d.boolean().default(false),
    type:notificationType().notNull(),
    createdAt:d.timestamp("created_at")
      .$defaultFn(()=> new Date())
      .notNull()
  }),
  (t) => [index("user_interacted_notifcation").on(t.userId,t.read)]
)

//___________Relations_____________

export const userRelations = relations(user,({many}) => ({
  goals:many(goals),
  habits:many(habits),
  weeklyGoals:many(weeklyGoals)
}))

export const goalsRelations = relations(goals,({one,many})=>({
  user:one(user,{fields:[goals.userId],references:[user.id]}),
  habits:many(habits),
  tasks:many(tasks)
}))

export const weeklyGoalsRelations = relations(weeklyGoals,({one})=>({
  user:one(user,{fields:[weeklyGoals.userId],references:[user.id]}),
}))

export const habitsRelations = relations(habits,({one,many})=>({
  user:one(user,{fields:[habits.userId],references:[user.id]}),
  goal:one(goals,{fields:[habits.goalId],references:[goals.id]}),
  logs:many(habitLogs)
}))

export const habitLogsRelations = relations(habitLogs,({one})=>({
  habit:one(habits,{fields:[habitLogs.habitId],references:[habits.id]})
}))

export const tasksRelations = relations(tasks,({one})=>({
  habit:one(habits,{fields:[tasks.habitId],references:[habits.id]})
}))


// ─────────────────────────────────────
// SEO Content Tables (Programmatic SEO)
// ─────────────────────────────────────

export const seoTopics = createTable(
  "seo_topics",
  (d) => ({
    id: d.uuid("id").defaultRandom().primaryKey(),
    slug: d.text("slug").notNull().unique(),
    title: d.text("title").notNull(),
    description: d.text("description").notNull(),
    category: d.text("category").notNull(),
    metaTitle: d.text("meta_title"),
    metaDescription: d.text("meta_description"),
    content: d.text("content"),
    isPublished: d.boolean("is_published").default(false).notNull(),
    publishedAt: d.timestamp("published_at"),
    createdAt: d.timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: d.timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
  }),
  (t) => [
    index("seo_topics_slug_idx").on(t.slug),
    index("seo_topics_category_idx").on(t.category),
    index("seo_topics_published_idx").on(t.isPublished),
  ]
);

export const seoPages = createTable(
  "seo_pages",
  (d) => ({
    id: d.uuid("id").defaultRandom().primaryKey(),
    topicId: d.uuid("topic_id").references(() => seoTopics.id, { onDelete: "cascade" }),
    slug: d.text("slug").notNull().unique(),
    title: d.text("title").notNull(),
    description: d.text("description").notNull(),
    metaTitle: d.text("meta_title"),
    metaDescription: d.text("meta_description"),
    content: d.text("content").notNull(),
    keywords: d.text("keywords").array(),
    schemaType: d.text("schema_type").default("Article"), // Article, HowTo, FAQ
    isPublished: d.boolean("is_published").default(false).notNull(),
    publishedAt: d.timestamp("published_at"),
    createdAt: d.timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: d.timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
  }),
  (t) => [
    index("seo_pages_slug_idx").on(t.slug),
    index("seo_pages_topic_idx").on(t.topicId),
    index("seo_pages_published_idx").on(t.isPublished),
    index("seo_pages_category_idx").on(t.schemaType),
  ]
);

export const seoFaqs = createTable(
  "seo_faqs",
  (d) => ({
    id: d.uuid("id").defaultRandom().primaryKey(),
    pageId: d.uuid("page_id").references(() => seoPages.id, { onDelete: "cascade" }),
    question: d.text("question").notNull(),
    answer: d.text("answer").notNull(),
    sortOrder: d.integer("sort_order").default(0),
    createdAt: d.timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  }),
  (t) => [
    index("seo_faqs_page_idx").on(t.pageId),
    index("seo_faqs_sort_idx").on(t.pageId, t.sortOrder),
  ]
);

// SEO Relations
export const seoTopicsRelations = relations(seoTopics, ({ many }) => ({
  pages: many(seoPages),
}));

export const seoPagesRelations = relations(seoPages, ({ one, many }) => ({
  topic: one(seoTopics, { fields: [seoPages.topicId], references: [seoTopics.id] }),
  faqs: many(seoFaqs),
}));

export const seoFaqsRelations = relations(seoFaqs, ({ one }) => ({
  page: one(seoPages, { fields: [seoFaqs.pageId], references: [seoPages.id] }),
}));


//________ Better Auth____________

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