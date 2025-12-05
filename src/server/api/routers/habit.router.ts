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
});
