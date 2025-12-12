import { api, HydrateClient } from "~/trpc/server";
import { UserProgressCalender } from "./_components/UserProgressCalender";
import { UserConsistencyTracker } from "./_components/UserConsistencyTracker";
import TodaysProgress from "./_components/TodaysProgress";

import { ReviewNotes } from "./_components/ReviewNotes";
import { HabitsProgressList } from "./_components/HabitsProgressList";

import { redirect } from "next/navigation";

export default async function Page() {
  // 1. Fetch user data directly on the server
  // This uses the 'me' procedure we defined in user.router.ts
  let user;
  try {
    user = await api.user.me();
  } catch (error) {
    redirect("/login");
  }

  // 2. (Optional) Prefetch data for client components if needed
  // void api.user.getStats.prefetch(); 

  return (
    <HydrateClient>
      <div className="mx-auto p-3 min-h-screen bg-primary-foreground text-primary">
        <div className="flex items-center gap-2">
            <h1 className="font-bold text-3xl">Hi!, {user.name.split(" ")[0]}</h1>
        </div>
        <div className="mt-8 flex flex-col md:flex-row gap-8 items-center justify-center w-full">
        <UserProgressCalender />
        <UserConsistencyTracker />
      </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full ">
            <div className="flex flex-col gap-4 items-center justify-center">
              {/* Today's progress */}
              <TodaysProgress/>
                <ReviewNotes/>
            </div>

            <div className="flex flex-col gap-4 ">
                {/* my habits and progress */}
                <HabitsProgressList />
            </div>
        </div>
      </div>
    </HydrateClient>
  );
}