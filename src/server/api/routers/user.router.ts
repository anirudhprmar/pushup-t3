import { eq, desc, inArray } from 'drizzle-orm';

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { user, userStats, habits, habitLogs, tasks, goals, weeklyGoals, notification } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  me: protectedProcedure
    .query(async ({ ctx }) => {
    const [userInfo] = await ctx.db.select().from(user).where(eq(user.id,ctx.userId));
    
    // Return null instead of throwing - allows page to handle gracefully
    return userInfo ?? null;
    }),

  getLeaderboard: protectedProcedure
    .query(async ({ ctx }) => {
      const leaderboard = await ctx.db
        .select({
          id: user.id,
          name: user.name,
          image: user.image,
          allHabits: userStats.totalHabits,
          totalConsistentDays: userStats.totalConsistentDays,
        })
        .from(user)
        .innerJoin(userStats, eq(user.id, userStats.userId))
        .orderBy(desc(userStats.totalConsistentDays))
        .limit(50);

      return leaderboard;
    }),

  exportData: protectedProcedure
    .query(async ({ ctx }) => {
      const { db, userId } = ctx;
      
      // Fetch user profile
      const [userInfo] = await db.select().from(user).where(eq(user.id, userId));
      
      // Fetch habits and logs
      const userHabits = await db.select().from(habits).where(eq(habits.userId, userId));
      const habitIds = userHabits.map(h => h.id);
      const userHabitLogs = habitIds.length > 0 
        ? await db.select().from(habitLogs).where(inArray(habitLogs.habitId, habitIds))
        : [];
      
      // Fetch tasks
      const userTasks = await db.select().from(tasks).where(eq(tasks.userId, userId));
      
      // Fetch goals
      const userGoals = await db.select().from(goals).where(eq(goals.userId, userId));
      const userWeeklyGoals = await db.select().from(weeklyGoals).where(eq(weeklyGoals.userId, userId));
      
      // Fetch stats
      const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
      
      // Fetch notifications
      const userNotifications = await db.select().from(notification).where(eq(notification.userId, userId));

      return {
        profile: userInfo,
        habits: userHabits,
        habitLogs: userHabitLogs,
        tasks: userTasks,
        goals: userGoals,
        weeklyGoals: userWeeklyGoals,
        stats: stats,
        notifications: userNotifications,
        exportDate: new Date().toISOString()
      };
    }),

  deleteAccount: protectedProcedure
    .mutation(async ({ ctx }) => {
      // The schema has onDelete: "cascade" for all user-related tables
      // Deleting the user record will trigger cascading deletes
      await ctx.db.delete(user).where(eq(user.id, ctx.userId));
      
      return { success: true };
    }),
});
