import { eq, desc } from 'drizzle-orm';

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { user, userStats } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  me: protectedProcedure
    .query(async ({ ctx }) => {
    const [userInfo] = await ctx.db.select().from(user).where(eq(user.id,ctx.userId));
    if(!userInfo){
      throw new Error("User not found")
    }

    return userInfo;
    }),

  getLeaderboard: publicProcedure
    .query(async ({ ctx }) => {
      const leaderboard = await ctx.db
        .select({
          id: user.id,
          name: user.name,
          image: user.image,
          currentStreak: userStats.currentStreak,
          longestStreak: userStats.longestStreak,
          totalConsistentDays: userStats.totalConsistentDays,
        })
        .from(user)
        .innerJoin(userStats, eq(user.id, userStats.userId))
        .orderBy(desc(userStats.totalConsistentDays))
        .limit(50);

      return leaderboard;
    }),
});
