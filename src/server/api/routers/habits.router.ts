import { and, eq, lte } from 'drizzle-orm';
import { z } from "zod";

import { createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import { habits, habitLogs } from "~/server/db/schema";

export const habitRouter = createTRPCRouter({
  all:protectedProcedure
    .query(async ({ ctx }) => {
      const data = await ctx.db.select().from(habits).where(eq(habits.userId,ctx.userId))
      if(!data){
        throw new Error("No habits found")
      }

      return data;
    }),
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

      // await ctx.db.insert(habitLogs).values({
      //   habitId:newHabit.id,
      //   date:new Date().toDateString().split('T')[0]!
      // })

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
      completed:z.boolean(),
      notes:z.string().optional(),
    }))
    .mutation(async({ctx,input})=>{
    const today = new Date().toISOString().split('T')[0]!; 

       await ctx.db
      .insert(habitLogs)
      .values({
        habitId:input.habitId,
        date: today,
        completed: input.completed,
        notes: input.notes ?? null
      })
      .onConflictDoUpdate({
        target: [habitLogs.habitId, habitLogs.date], // Your unique constraint
        set: { 
          completed: input.completed,
          notes: input.notes,
          updatedAt: new Date()
        }
      });

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

    getLogs: protectedProcedure
    .input(z.object({
      habitId: z.uuid(),
    }))
    .query(async ({ ctx, input }) => {
      const today = new Date();

      const logs = await ctx.db
        .select()
        .from(habitLogs)
        .where(
          and (
            eq(habitLogs.habitId, input.habitId),
            lte(habitLogs.date, today.toDateString())
          )
        )
        .orderBy(habitLogs.date)

        return logs;  
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
        periodStart.setHours(23, 59, 59, 999);
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
          if(log.date !== today.toDateString()){
            break;
          }
          else if (log.completed) {
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
  getHabitCompletionDays: protectedProcedure
    .input(z.object({
      habitId: z.uuid(),
    }))
    .query(async ({ ctx, input }) => {

      const userHabit = await ctx.db
      .select()
      .from(habits)
      .where(
        and(
          eq(habits.userId,ctx.userId),
          eq(habits.id,input.habitId)
        )
      )

      if(userHabit.length===0){
        throw new Error("Habit not found")
      }

      const completedLogs = await ctx.db
      .select()
      .from(habitLogs)
      .where(
        and(
          eq(habitLogs.habitId,input.habitId),
          eq(habitLogs.completed,true)
        )
      )
      
    const uniqueDates = new Set(completedLogs.map(log => log.date));

    const consistentDays = uniqueDates.size;

      // console.log("consistentDays",uniqueDates)
      return {consistentDays};

    })
    ,
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

  getMonthlyAnalysis: protectedProcedure
    .query(async ({ ctx }) => {
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth()
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

      // Get all user habits
      const userHabits = await ctx.db
        .select()
        .from(habits)
        .where(eq(habits.userId, ctx.userId))

      if (userHabits.length === 0) {
        return []
      }

      // Get all logs for user's habits - query habitLogs directly and join to verify ownership
      const allLogsData = await ctx.db
        .select({
          id: habitLogs.id,
          habitId: habitLogs.habitId,
          date: habitLogs.date,
          completed: habitLogs.completed,
          notes: habitLogs.notes,
        })
        .from(habitLogs)
        .innerJoin(habits, eq(habitLogs.habitId, habits.id))
        .where(eq(habits.userId, ctx.userId))

      // Process logs to calculate monthly statistics
      const stats: Array<{
        month: number
        monthName: string
        totalHabits: number
        totalDaysCompleted: number
        totalDaysLogged: number
        averageCompletionRate: number
        growth: number | null
        habitsBreakdown: Array<{
          habitId: string
          habitName: string
          completedDays: number
          loggedDays: number
          completionRate: number
        }>
      }> = []

      // Initialize stats for each month up to current month
      for (let monthIndex = 0; monthIndex <= currentMonth; monthIndex++) {
        const monthStats = {
          month: monthIndex,
          monthName: months[monthIndex]!,
          totalHabits: 0,
          totalDaysCompleted: 0,
          totalDaysLogged: 0,
          averageCompletionRate: 0,
          growth: null as number | null,
          habitsBreakdown: [] as Array<{
            habitId: string
            habitName: string
            completedDays: number
            loggedDays: number
            completionRate: number
          }>,
        }

        // Process each habit
        userHabits.forEach((habit) => {
          const habitCreatedDate = new Date(habit.createdAt)
          const habitCreatedYear = habitCreatedDate.getFullYear()
          const habitCreatedMonth = habitCreatedDate.getMonth()

          // Only count habits that existed in this month
          if (habitCreatedYear < currentYear || (habitCreatedYear === currentYear && habitCreatedMonth <= monthIndex)) {
            monthStats.totalHabits++

            // Get logs for this habit
            const habitLogs = allLogsData.filter(log => log.habitId === habit.id)

            // Filter logs for this month and year
            // Date is stored as "YYYY-MM-DD" string
            const monthLogs = habitLogs.filter((log) => {
              const [year, month] = log.date.split('-').map(Number)
              return year === currentYear && month === monthIndex + 1 // month is 1-indexed in date strings
            })

            const completedDays = monthLogs.filter((log) => log.completed).length
            const loggedDays = monthLogs.length
            const completionRate = loggedDays > 0 ? Math.round((completedDays / loggedDays) * 100) : 0

            monthStats.totalDaysCompleted += completedDays
            monthStats.totalDaysLogged += loggedDays

            monthStats.habitsBreakdown.push({
              habitId: habit.id,
              habitName: habit.name,
              completedDays,
              loggedDays,
              completionRate,
            })
          }
        })

        // Calculate average completion rate
        if (monthStats.totalHabits > 0 && monthStats.habitsBreakdown.length > 0) {
          const totalCompletionRates = monthStats.habitsBreakdown.reduce(
            (sum, habit) => sum + habit.completionRate,
            0
          )
          monthStats.averageCompletionRate = Math.round(totalCompletionRates / monthStats.habitsBreakdown.length)
        }

        stats.push(monthStats)
      }

      // Calculate growth for each month (compared to previous month)
      stats.forEach((stat, index) => {
        if (index > 0) {
          const previousStat = stats[index - 1]!
          if (previousStat.averageCompletionRate > 0) {
            stat.growth = Math.round(
              ((stat.averageCompletionRate - previousStat.averageCompletionRate) /
                previousStat.averageCompletionRate) *
                100
            )
          } else if (stat.averageCompletionRate > 0) {
            stat.growth = 100 // First month with data
          } else {
            stat.growth = 0
          }
        }
      })

      return stats
    })
        
});

