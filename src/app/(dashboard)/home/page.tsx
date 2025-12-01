"use client"
import { Button } from "~/components/ui/button"
import { PlusIcon } from "lucide-react"
import { useState } from "react";
import { HabitForm } from "./_components/HabitForm";
// import { HydrateClient } from "~/trpc/server";
import { api } from "~/lib/api";

export default function Home() {
 
  const [createHabit, setCreateHabit] = useState(false);


const {data:userInfo} = api.user.me.useQuery({userId:"Wxk9BvCUI2LJ29BgDDoawezMdwfMrK9P"})

const {data:userHabits,isLoading:loadingUserHabits} = api.habit.habits.useQuery({userId:"Wxk9BvCUI2LJ29BgDDoawezMdwfMrK9P"})


 

  return (
    // <HydrateClient>
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-start justify-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Hello, {userInfo?.name ?? null}</h1>
          </div>
          <div>
            <Button variant={"default"} onClick={()=>setCreateHabit(!createHabit)} className="mt-4 flex items-center gap-2">
              <span><PlusIcon/></span>Create New Habit
            </Button>
          </div>
        </div>
        {createHabit && <HabitForm/>}
        {loadingUserHabits ? <p>Loading habits...</p> : (
          <div className="space-y-4">
            {userHabits && userHabits.length > 0 ? (
              userHabits.map((habit) => (
                <div key={habit.id} className="p-4 border border-border rounded-lg">
                  <h2 className="text-xl font-semibold text-foreground">{habit.name}</h2>
                  <p className="text-sm text-muted-foreground">{habit.description}</p>
                  <p className="text-sm text-foreground mt-2">Goal: {habit.goal}</p>
                </div>
              ))
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
