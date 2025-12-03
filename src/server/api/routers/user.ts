import { eq } from 'drizzle-orm';
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { user } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  me: protectedProcedure
    .query(async ({ ctx }) => {
    const [userInfo] = await ctx.db.select().from(user).where(eq(user.id,ctx.userId));
    if(!userInfo){
      throw new Error("User not found")
    }

    return userInfo;
    }),
});
