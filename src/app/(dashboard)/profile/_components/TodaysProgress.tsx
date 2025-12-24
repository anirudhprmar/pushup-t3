'use client'
import { api } from "~/lib/api"

export default function TodaysProgress() {
    const {data,isLoading} = api.habits.getHabitsNotCompleted.useQuery();
  return (
    <div className="bg-foreground/5 text-primary p-10 rounded-xl w-full">
        <div className="flex flex-col items-start justify-center">
            <h1 className="font-semibold">Today&apos;s Pending</h1>
            <p className="text-xs text-muted-foreground">make today count</p>
        </div>
        <div className="flex flex-col items-start justify-center gap-2 py-5">
           {isLoading ? (
            <p>Loading...</p>
           ) : data?.map((habit) => (
            <div key={habit.id} className="flex items-center gap-2">

                <div className="bg-red-500 w-3 h-3 animate-pulse rounded-full"/>
                <p className="font-semibold" >{habit.name}</p>
            </div>
           ))} 
        </div>
    </div>
  )
}
