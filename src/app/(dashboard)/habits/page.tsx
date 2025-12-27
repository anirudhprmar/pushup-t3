"use client"
// import { HydrateClient } from "~/trpc/server";
import { api } from "~/lib/api";
import dateAndactualMonth from "~/lib/day&months";
import { HabitCard } from "~/components/HabitCard";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { habits } from "~/server/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { HabitForm } from "../_components/HabitForm";


export default function Home() {
 
const router = useRouter()

const {data:userHabits,isLoading,error} = api.habits.getHabits.useQuery()


  if(isLoading){
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if(error?.data?.code === "UNAUTHORIZED"){
    return router.push("/login")
  }

  
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 ">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">
              <p>Habits</p>
            </h1>
              <HabitForm/>
          </div>
        </div>
    
        {isLoading ? <p>Loading habits...</p> : (
          <div className="space-y-6">
            {/* All Habits */}
            {userHabits && userHabits.length > 0 ? (
              <div>
              <Card className="bg-secondary w-full max-w-4xl">
                 <CardHeader>
                  <CardTitle>Current Habits</CardTitle>
                </CardHeader>
              <CardContent>

                <div className="grid grid-cols-2 gap-2">
                  {
                    userHabits.map((habit) => (
                      <HabitCard 
                      key={habit.habits.id}
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
  )
}
