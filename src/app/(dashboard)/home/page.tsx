"use client"
// import { HydrateClient } from "~/trpc/server";
import { api } from "~/lib/api";
import HabitVisualizer from "./_components/HabitVisualizer";
import dateAndactualMonth from "~/lib/day&months";
import { HabitCard } from "~/components/HabitCard";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { calculateProgress } from "~/lib/habitUtils";

// Helper function to get greeting based on time of day
function getGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  } else if (hour >= 17 && hour < 22) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
}

// Component to render a single habit card with progress
function HabitCardWithProgress({ 
  habit, 
  inProgress 
}: { 
  habit: any; 
  inProgress: boolean;
}) {
  const { data: log } = api.habit.getHabitProgress.useQuery({ habitId: habit.id });
  
  const getProgress = () => {
    if (!log) return 0;
    if (log.completed) return 100;
    
    // For numeric/timer habits, calculate based on actual vs target
    if ((habit.habitType === "numeric" || habit.habitType === "timer") && habit.targetValue && log.actualValue) {
      return calculateProgress(log.actualValue, habit.targetValue);
    }
    
    // For in-progress boolean habits, show 50%
    if (log.startedAt && !log.completed) return 50;
    
    return 0;
  };
  
  return (
    <HabitCard 
      habit={{
        ...habit,
        inProgress,
        completed: log?.completed ?? false,
        progress: getProgress(),
      }}
    />
  );
}

export default function Home() {
 
const router = useRouter()

const {data:userHabits,isLoading:loadingUserHabits,error:userHabitsError} = api.habit.habits.useQuery()
const {data:inProgressHabits} = api.habit.getTodayInProgressHabits.useQuery()

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
 const inProgressIds = new Set(inProgressHabits?.map(h => h.id) ?? [])

  return (
    // <HydrateClient>
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8 ">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">
              {getGreeting()}!
            </h1>
            <p className="text-2xl font-semibold text-muted-foreground">{properTodaysDate}</p>
          </div>
        </div>
        <HabitVisualizer/>
    
        {loadingUserHabits ? <p>Loading habits...</p> : (
          <div className="space-y-6">
            {/* In Progress Habits */}
            {inProgressHabits && inProgressHabits.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  In Progress
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {inProgressHabits.map((habit) => (
                    <HabitCardWithProgress 
                      key={habit.id}
                      habit={habit}
                      inProgress={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Habits */}
            {userHabits && userHabits.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {inProgressHabits && inProgressHabits.length > 0 ? "All Habits" : "Your Habits"}
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {
                    userHabits.map((habit) => (
                      <HabitCardWithProgress 
                        key={habit.id}
                        habit={habit}
                        inProgress={inProgressIds.has(habit.id)}
                      />
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
