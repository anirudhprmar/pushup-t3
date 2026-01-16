import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user.router";
import { habitRouter } from "./routers/habits.router";
import { goalsRouter } from "./routers/goals.router";
import { tasksRouter } from "./routers/tasks.router";
import { weeklyGoalsRouter } from "./routers/weekly-goals.router";
import { notificationRouter } from "./routers/notification.router";
import { seoRouter } from "./routers/seo.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  habits: habitRouter,
  goals: goalsRouter,
  tasks: tasksRouter,
  weeklyGoals: weeklyGoalsRouter,
  notification: notificationRouter,
  seo: seoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
