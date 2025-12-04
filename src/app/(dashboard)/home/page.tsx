"use client"
// import { HydrateClient } from "~/trpc/server";
import { api } from "~/lib/api";
import HabitVisualizer from "./_components/HabitVisualizer";
import dateAndactualMonth from "~/lib/day&months";
import { HabitCard } from "~/components/HabitCard";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
 
const router = useRouter()

const {data:userInfo,isLoading:loadingUserInfo,error:userInfoError} = api.user.me.useQuery()

if(userInfoError?.data?.code === "UNAUTHORIZED"){
  return router.push("/login")
}

const {data:userHabits,isLoading:loadingUserHabits,error:userHabitsError} = api.habit.habits.useQuery()

if(loadingUserInfo || loadingUserHabits){
  return <p className="animate-spin text-2xl"><Loader2/></p>
}

if(userHabitsError?.data?.code === "UNAUTHORIZED"){
  return router.push("/login")
}

 const todaysDate = new Date().toLocaleDateString().split("T")[0] ?? ""
 const properTodaysDate = dateAndactualMonth(todaysDate);

  return (
    // <HydrateClient>
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8 ">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground ">Hello, {userInfo?.name ?? null}</h1>
            <p className="text-3xl font-semibold text-muted-foreground">{properTodaysDate}</p>
          </div>
        </div>
        <HabitVisualizer/>
    
        {loadingUserHabits ? <p>Loading habits...</p> : (
          <div className="space-y-4">
            {userHabits && userHabits.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">Your Habits</h2>
                <div className="grid grid-cols-2 gap-2  " >
                  {
                    userHabits.map((habit) => (
                      <HabitCard key={habit.id} habit={habit}/>
                    ))
                  }
                </div>
              </div>

            ) : (
              <p>No habits found. Start by creating a new habit!</p>
            )}
          </div>
        )}
      </div>
    </main>
    // </HydrateClient>
  )
}
