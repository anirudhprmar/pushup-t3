"use client"
// import { HydrateClient } from "~/trpc/server";
import { api } from "~/lib/api";
import dateAndactualMonth from "~/lib/day&months";
import { HabitCard } from "~/components/HabitCard";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { habits } from "~/server/db/schema";
import { Card, CardContent } from "~/components/ui/card";

// Type for habit from database
type Habit = typeof habits.$inferSelect;


function HabitCardWithProgress({ 
  habit, 
}: { 
  habit: Habit; 
}) {

  
 
  
  return (
    <HabitCard 
      habit={{...habit}}
    />
  );
}

export default function Home() {
 
const router = useRouter()

const {data:userHabits,isLoading:loadingUserHabits,error:userHabitsError} = api.habits.getHabits.useQuery()


if(loadingUserHabits){
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

if(userHabitsError?.data?.code === "UNAUTHORIZED"){
  return router.push("/login")
}

 const todaysDate = new Date().toLocaleDateString().split("T")[0] ?? ""
 const properTodaysDate = dateAndactualMonth(todaysDate);

 // Get in-progress habit IDs
 
  return (
    // <HydrateClient>
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8 ">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">
              {/* {getGreeting()}! */}
              <p>Habits</p>
            </h1>
            {/* <p className="text-2xl font-semibold text-muted-foreground">{properTodaysDate}</p> */}
          </div>
        </div>
    
        {loadingUserHabits ? <p>Loading habits...</p> : (
          <div className="space-y-6">
            {/* In Progress Habits */}
           

            {/* All Habits */}
            {userHabits && userHabits.length > 0 ? (
              <div>
              <Card className="bg-secondary">
              <CardContent>

                <div className="grid grid-cols-2 gap-2">
                  {
                    userHabits.map((habit) => (
                      <HabitCardWithProgress 
                      key={habit.id}
                      habit={habit}
                      />
                    ))
                  }
                </div>
                  </CardContent>
                  </Card>
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
