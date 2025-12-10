import { and, eq } from 'drizzle-orm';
import { z } from "zod";

import { createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import { habit, habitLog } from "~/server/db/schema";

export const habitRouter = createTRPCRouter({

  habits: protectedProcedure
    .query(async ({ ctx }) => {
    const data = await ctx.db.select().from(habit).where(eq(habit.userId,ctx.userId));
    if(!data){
      throw new Error("No habits found")
    }

    return data;
    }),

  create: protectedProcedure
    .input(z.object({
        name: z.string().min(1),
        goal: z.string().min(1),
        description: z.string().optional(),
        category: z.string().optional(),
        color: z.string().optional(),
        habitType: z.enum(["boolean", "numeric", "timer"]).default("boolean"),
        targetValue: z.number().optional(),
        targetUnit: z.string().optional(),
      }))
    .mutation(async ({ ctx, input }) => {
      const { name, goal, description, category, color, habitType, targetValue, targetUnit } = input

      await ctx.db.insert(habit).values({
        name,
        goal,
        description,
        category,
        color,
        habitType,
        targetValue,
        targetUnit,
        userId:ctx.userId
      });

      return { success: true };
    }),

  deleteHabit: protectedProcedure
    .input(z.object({
      habitId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      // First verify the habit belongs to the user
      const [habitData] = await ctx.db
        .select()
        .from(habit)
        .where(
          and(
            eq(habit.id, input.habitId),
            eq(habit.userId, ctx.userId)
          )
        )
        .limit(1);

      if (!habitData) {
        throw new Error("Habit not found or you don't have permission to delete it");
      }

      // Delete the habit (cascade will handle habitLog deletion)
      await ctx.db
        .delete(habit)
        .where(eq(habit.id, input.habitId));

      return { success: true };
    }),

  startHabit: protectedProcedure
    .input(z.object({
      habitId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const today = new Date().toISOString().split('T')[0]!;
      
      // Check if log already exists for today
      const existingLog = await ctx.db
        .select()
        .from(habitLog)
        .where(
          and(
            eq(habitLog.habitId, input.habitId),
            eq(habitLog.date, today)
          )
        )
        .limit(1);

      if (existingLog.length > 0) {
        // Update existing log with startedAt if not already started
        if (!existingLog[0]!.startedAt) {
          await ctx.db
            .update(habitLog)
            .set({ startedAt: new Date() })
            .where(eq(habitLog.id, existingLog[0]!.id));
        }
        return { success: true, logId: existingLog[0]!.id };
      }

      // Create new log entry
      const [newLog] = await ctx.db
        .insert(habitLog)
        .values({
          habitId: input.habitId,
          userId: ctx.userId,
          date: today,
          startedAt: new Date(),
          completed: false,
        })
        .returning();

      return { success: true, logId: newLog!.id };
    }),

  completeHabit: protectedProcedure
    .input(z.object({
      habitId: z.number(),
      actualValue: z.number().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const today = new Date().toISOString().split('T')[0]!;

      // Find today's log
      const [log] = await ctx.db
        .select()
        .from(habitLog)
        .where(
          and(
            eq(habitLog.habitId, input.habitId),
            eq(habitLog.date, today)
          )
        )
        .limit(1);

      if (!log) {
        throw new Error("No active habit session found");
      }

      // Update log with completion data
      await ctx.db
        .update(habitLog)
        .set({
          completed: true,
          completedAt: new Date(),
          actualValue: input.actualValue,
          notes: input.notes,
        })
        .where(eq(habitLog.id, log.id));

      return { success: true };
    }),

  getHabitProgress: protectedProcedure
    .input(z.object({
      habitId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const today = new Date().toISOString().split('T')[0]!;

      const [log] = await ctx.db
        .select()
        .from(habitLog)
        .where(
          and(
            eq(habitLog.habitId, input.habitId),
            eq(habitLog.date, today)
          )
        )
        .limit(1);

      return log ?? null;
    }),

  getTodayInProgressHabits: protectedProcedure
    .query(async ({ ctx }) => {
      const today = new Date().toISOString().split('T')[0]!;

      // Get all logs that are started but not completed today
      const logs = await ctx.db
        .select()
        .from(habitLog)
        .where(
          and(
            eq(habitLog.userId, ctx.userId),
            eq(habitLog.date, today),
            eq(habitLog.completed, false)
          )
        );

      // Get habit IDs
      const habitIds = logs.map(log => log.habitId);

      if (habitIds.length === 0) {
        return [];
      }

      // Fetch the actual habits
      const habits = await ctx.db
        .select()
        .from(habit)
        .where(eq(habit.userId, ctx.userId));

      // Filter to only in-progress habits
      return habits.filter(h => habitIds.includes(h.id));
    }),

  // Get habit by ID for analysis page
  getHabitById: protectedProcedure
    .input(z.object({
      habitId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const [habitData] = await ctx.db
        .select()
        .from(habit)
        .where(
          and(
            eq(habit.id, input.habitId),
            eq(habit.userId, ctx.userId)
          )
        )
        .limit(1);

      if (!habitData) {
        throw new Error("Habit not found");
      }

      return habitData;
    }),

  // Get last 90 days of habit logs
  getHabitLogs90Days: protectedProcedure
    .input(z.object({
      habitId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const today = new Date();
      const ninetyDaysAgo = new Date(today);
      ninetyDaysAgo.setDate(today.getDate() - 90);

      const logs = await ctx.db
        .select()
        .from(habitLog)
        .where(
          and(
            eq(habitLog.habitId, input.habitId),
            eq(habitLog.userId, ctx.userId)
          )
        );

      // Filter logs from last 90 days and sort by date descending
      return logs
        .filter(log => {
          const logDate = new Date(log.date);
          return logDate >= ninetyDaysAgo && logDate <= today;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }),

  // Get habit statistics for different time periods
  getHabitStatistics: protectedProcedure
    .input(z.object({
      habitId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const today = new Date();
      
      // Get all logs for this habit
      const allLogs = await ctx.db
        .select()
        .from(habitLog)
        .where(
          and(
            eq(habitLog.habitId, input.habitId),
            eq(habitLog.userId, ctx.userId)
          )
        );

      // Helper function to calculate stats for a time period
      const calculatePeriodStats = (days: number) => {
        const periodStart = new Date(today);
        periodStart.setDate(today.getDate() - days);

        const periodLogs = allLogs.filter(log => {
          const logDate = new Date(log.date);
          return logDate >= periodStart && logDate <= today;
        });

        const completedLogs = periodLogs.filter(log => log.completed);
        const completionRate = periodLogs.length > 0 
          ? Math.round((completedLogs.length / periodLogs.length) * 100)
          : 0;

        // Calculate average actual value for numeric/timer habits
        const logsWithValues = completedLogs.filter(log => log.actualValue !== null);
        const avgActualValue = logsWithValues.length > 0
          ? Math.round(
              logsWithValues.reduce((sum, log) => sum + (log.actualValue ?? 0), 0) / logsWithValues.length
            )
          : null;

        // Calculate current streak
        let currentStreak = 0;
        const sortedLogs = [...allLogs]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        for (const log of sortedLogs) {
          if (log.completed) {
            currentStreak++;
          } else {
            break;
          }
        }

        return {
          totalDays: periodLogs.length,
          completedDays: completedLogs.length,
          completionRate,
          avgActualValue,
          currentStreak,
        };
      };

      return {
        week: calculatePeriodStats(7),
        month: calculatePeriodStats(30),
        ninetyDays: calculatePeriodStats(90),
        allTime: {
          totalDays: allLogs.length,
          completedDays: allLogs.filter(log => log.completed).length,
          completionRate: allLogs.length > 0
            ? Math.round((allLogs.filter(log => log.completed).length / allLogs.length) * 100)
            : 0,
        },
      };
    }),

  // Get completed day numbers (Day 1 = first day ALL habits completed, Day 2 = second day, etc.)
  getYearlyCompletionDays: protectedProcedure
    .query(async ({ ctx }) => {
      // Get all user habits
      const userHabits = await ctx.db
        .select()
        .from(habit)
        .where(eq(habit.userId, ctx.userId));
      
      const totalHabits = userHabits.length;
      
      if (totalHabits === 0) {
        return { completedDayNumbers: [] };
      }

      // Get all completed logs
      const completedLogs = await ctx.db
        .select()
        .from(habitLog)
        .where(
          and(
            eq(habitLog.userId, ctx.userId),
            eq(habitLog.completed, true)
          )
        );

      // Group by date and count completed habits per day
      const completionsByDate = new Map<string, number>();
      for (const log of completedLogs) {
        const current = completionsByDate.get(log.date) ?? 0;
        completionsByDate.set(log.date, current + 1);
      }

      // Count how many days have ALL habits completed
      let fullyCompletedCount = 0;
      for (const count of completionsByDate.values()) {
        if (count >= totalHabits) {
          fullyCompletedCount++;
        }
      }

      // Return sequential day numbers: [1, 2, 3, ...] up to fullyCompletedCount
      const completedDayNumbers = Array.from(
        { length: fullyCompletedCount }, 
        (_, i) => i + 1
      );

      return { completedDayNumbers };
    }),
    getYearlyCompletionDaysDetailed: protectedProcedure
      .query(async ({ ctx }) => {
        // Get all user habits
        const userHabits = await ctx.db
          .select()
          .from(habit)
          .where(eq(habit.userId, ctx.userId));
        
        const totalHabits = userHabits.length;
        
        if (totalHabits === 0) {
          return { completedDayNumbersDetailed: {} };
        }
        
        // Get all completed logs
        const completedLogs = await ctx.db
          .select()
          .from(habitLog)
          .where(
            and(
              eq(habitLog.userId, ctx.userId),
              eq(habitLog.completed, true)
            )
          );
        
        // Group by date and count completed habits per day
        const completionsByDate = new Map<string, number>();
        for (const log of completedLogs) {
          const current = completionsByDate.get(log.date) ?? 0;
          completionsByDate.set(log.date, current + 1);
        }
        
        const completedDayNumbersDetailed: Record<string, boolean> = {};

        // This prevents the system from unfairly marking a past day as "Failed" just because you created a new habit today.
        for (const [date, count] of completionsByDate.entries()) {
          const activeHabitsOnDate = userHabits.filter(h => {
            const habitCreatedDate = h.createdAt.toISOString().split('T')[0];
            //checking if the habit was created before the today's date
            return habitCreatedDate! <= date;
          }).length;

          if (count >= activeHabitsOnDate) {
            completedDayNumbersDetailed[date] = true;
          } else {
             completedDayNumbersDetailed[date] = false;
          }
        }

        const today = new Date().toISOString().split('T')[0]!;
        completedDayNumbersDetailed[today] ??= false;
        
        return { completedDayNumbersDetailed };
      }),
        
});

