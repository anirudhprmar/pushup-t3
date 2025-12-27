import { and, eq } from 'drizzle-orm';
import { z } from "zod";

import { createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import { habits, habitLogs } from "~/server/db/schema";

export const habitRouter = createTRPCRouter({

  getHabits: protectedProcedure
    .query(async ({ ctx }) => {
        const today = new Date().toISOString().split('T')[0]!;

    const data = await ctx.db.select().from(habits).where(eq(habits.userId,ctx.userId)).leftJoin(habitLogs, and(
      eq(habitLogs.habitId, habits.id),
      eq(habitLogs.date, today)
    ))
    if(!data){
      throw new Error("No habits found")
    }

    return data;
    }),

  createHabit: protectedProcedure
    .input(z.object({
        goalId: z.uuid().optional(),
        name: z.string().min(1),
        description: z.string().optional(),
        category: z.string().optional(),
        color: z.string().optional()
      }))
    .mutation(async ({ ctx, input }) => {
      const { name,goalId, description, category, color } = input

      const [newHabit] = await ctx.db.insert(habits).values({
        name,
        goalId,
        description,
        category,
        color,
        userId:ctx.userId
      }).returning({id:habits.id})

      if (!newHabit) throw new Error("Failed to create habit");

      await ctx.db.insert(habitLogs).values({
        habitId:newHabit.id,
        date:new Date().toDateString().split('T')[0]!
      })

      return { success: true };
    }),

  deleteHabit: protectedProcedure
    .input(z.object({
      habitId: z.uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      // First verify the habit belongs to the user
      const [habitData] = await ctx.db
        .select()
        .from(habits)
        .where(
          and(
            eq(habits.id, input.habitId),
            eq(habits.userId, ctx.userId)
          )
        )
        .limit(1);

      if (!habitData) {
        throw new Error("Habit not found or you don't have permission to delete it");
      }

      // Delete the habit (cascade will handle habitLog deletion)
      await ctx.db
        .delete(habits)
        .where(eq(habits.id, input.habitId));

      return { success: true };
    }),

    setHabitCompleted:protectedProcedure
    .input(z.object({
      habitId:z.uuid(),
      notes:z.string().optional()
    }))
    .mutation(async({ctx,input})=>{
      const today = new Date().toDateString().split('T')[0]!;

      await ctx.db
      .update(habitLogs)
      .set({
        date:today,
        completed:true,
        notes:input.notes
      })
      .where(eq(habitLogs.habitId,input.habitId)).returning()

      return {success:true}
    })
    ,

    getHabitsNotCompleted: protectedProcedure
    .query(async ({ ctx }) => {
      const today = new Date().toISOString().split('T')[0]!;

      // 1. Get all active habits for the user
      const allHabits = await ctx.db
        .select()
        .from(habits)
        .where(
          eq(habits.userId, ctx.userId)
        );

      if (allHabits.length === 0) {
        return [];
      }

      // 2. Get IDs of habits that are COMPLETED today
      const completedLogs = await ctx.db
        .select({ habitId: habitLogs.habitId })
        .from(habitLogs)
        .where(
          and(
            eq(habits.userId, ctx.userId),
            eq(habitLogs.date, today),
            eq(habitLogs.completed, true)
          )
        );

      const completedHabitIds = new Set(completedLogs.map(log => log.habitId));

      return allHabits.filter(h => !completedHabitIds.has(h.id));
    }),

    getHabitById: protectedProcedure
    .input(z.object({
      habitId: z.uuid(),
    }))
    .query(async ({ ctx, input }) => {
      const [habitData] = await ctx.db
        .select()
        .from(habits)
        .where(
          and(
            eq(habits.id, input.habitId),
            eq(habits.userId, ctx.userId)
          )
        )
        .limit(1);

      if (!habitData) {
        throw new Error("Habit not found");
      }

      return habitData;
    }),

    getLast90DaysLogs: protectedProcedure
    .input(z.object({
      habitId: z.uuid(),
    }))
    .query(async ({ ctx, input }) => {
      const today = new Date();
      const ninetyDaysAgo = new Date(today);
      ninetyDaysAgo.setDate(today.getDate() - 90);

      const logs = await ctx.db
        .select()
        .from(habitLogs)
        .where(
          eq(habitLogs.habitId, input.habitId)
        );

      // Filter logs from last 90 days and sort by date descending
      return logs
        .filter(log => {
          const logDate = new Date(log.date);
          return logDate >= ninetyDaysAgo && logDate <= today;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }),
    
  getHabitStatistics: protectedProcedure
    .input(z.object({
      habitId: z.uuid(),
    }))
    .query(async ({ ctx, input }) => {
      const today = new Date();
      
      // Get all logs for this habit
      const allLogs = await ctx.db
        .select()
        .from(habitLogs)
        .where(
            
          eq(habitLogs.habitId, input.habitId)
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

  getYearlyCompletionDays: protectedProcedure
    .query(async ({ ctx }) => {
      // Get all user habits
      const userHabits = await ctx.db
        .select()
        .from(habits)
        .where(eq(habits.userId, ctx.userId));
      
      const totalHabits = userHabits.length;
      
      if (totalHabits === 0) {
        return { completedDayNumbers: [] };
      }

      // Get all completed logs
      const completedLogs = await ctx.db
        .select()
        .from(habitLogs)
        .where(
          eq(habitLogs.completed, true)
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
          .from(habits)
          .where(eq(habits.userId, ctx.userId));
        
        const totalHabits = userHabits.length;
        
        if (totalHabits === 0) {
          return { completedDayNumbersDetailed: {} };
        }
        
        // Get all completed logs
        const completedLogs = await ctx.db
          .select()
          .from(habitLogs)
          .where(
              eq(habitLogs.completed, true)
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

  getRecentHabitNotes: protectedProcedure
    .query(async ({ ctx }) => {
      const notes = await ctx.db
        .select({
          id: habitLogs.id,
          date: habitLogs.date,
          note: habitLogs.notes,
          habitName: habits.name,
          habitColor: habits.color,
        })
        .from(habitLogs)
        .innerJoin(habits, eq(habitLogs.habitId, habits.id))
        .where(
          eq(habits.userId,ctx.userId)
        )
        .orderBy(habitLogs.date); 

      // Filter in memory to ensure we only get actual notes and sort descending
      return notes
        .filter(n => n.note && n.note.trim().length > 0)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
    }),

  getAllHabitsWithStats: protectedProcedure
    .query(async ({ ctx }) => {
      const userHabits = await ctx.db
        .select()
        .from(habits)
        .where(eq(habits.userId, ctx.userId));

      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const stats = await Promise.all(userHabits.map(async (h) => {
        const logs = await ctx.db
          .select()
          .from(habitLogs)
          .where(
              eq(habitLogs.habitId, h.id)
          );
        
        const recentLogs = logs.filter(log => {
           const d = new Date(log.date);
           return d >= thirtyDaysAgo && d <= today;
        });

        const completedCount = recentLogs.filter(l => l.completed).length;
        const completionRate = Math.round((completedCount / 30) * 100);

        return {
          ...h,
          completionRate
        };
      }));

      return stats;
    }),
        
});

