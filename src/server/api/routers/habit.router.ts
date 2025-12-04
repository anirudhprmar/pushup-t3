import { eq } from 'drizzle-orm';
import { z } from "zod";

import { createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import { habit } from "~/server/db/schema";

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
      }))
    .mutation(async ({ ctx, input }) => {
      const { name, goal, description } = input

      await ctx.db.insert(habit).values({
        name,
        goal,
        description,
        userId:ctx.userId
      });

      return { success: true };
    }),
});
