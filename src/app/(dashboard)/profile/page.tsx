import { api, HydrateClient } from "~/trpc/server";
import { UserHabitProgressChart } from "./_components/UserProgressChart";
import { UserProgressCalender } from "./_components/UserProgressCalender";
import { UserRankingGlobe } from "./_components/UserRankingGlobe";

export default async function Page() {
  // 1. Fetch user data directly on the server
  // This uses the 'me' procedure we defined in user.router.ts
  const user = await api.user.me();

  // 2. (Optional) Prefetch data for client components if needed
  // void api.user.getStats.prefetch(); 

  return (
    <HydrateClient>
      <div className="mx-auto p-3 min-h-screen bg-primary-foreground text-primary">
        <div className="flex items-center gap-2">
            <h1 className="font-bold text-3xl">Hi!, {user.name.split(" ")[0]}</h1>
        </div>
        <div className="flex flex-wrap gap-4 justify-around items-center py-10">
            <UserProgressCalender />
        </div>

        <div className="flex flex-wrap gap-4 justify-around items-center">
            <div>
            {/* Today's progress */}
            </div>

            {/* small circle with my global ranking */}
            {/* <UserRankingGlobe/> */}

            <div>
                {/* my habits */}
            </div>
        </div>
      </div>
    </HydrateClient>
  );
}