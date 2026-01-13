"use client"
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/lib/api"
import { TaskForm } from "./_components/TaskForm";
import { TaskCard } from "./_components/TaskCard";
import SkeletonTasks from "./_components/SkeletonTasks";
import dateAndactualMonth from "~/lib/day&months";


export default function Tasks() {
  const {data:userTasks,isLoading,error} = api.tasks.listAllTasks.useQuery()
  const router = useRouter()

  
    if(error?.data?.code === "UNAUTHORIZED"){
      return router.push("/login")
    }
  
    if(!userTasks) return;

    const date = new Date().toISOString().split("T")[0]!;
    const todaysDate = dateAndactualMonth(date)
    console.log(date)
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 ">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">
              <p>Tasks</p>
            </h1>
              <TaskForm/>
          </div>
        </div>

        {isLoading ? <SkeletonTasks/> : <div className="space-y-6"> 
          <Card className="bg-secondary w-full max-w-4xl">
              <CardHeader>
              <CardTitle className="text-lg font-medium ">
                  {todaysDate}
                </CardTitle>
            </CardHeader>
          <CardContent>

              { userTasks && userTasks?.length === 0 ? <div>No Tasks found. Start by creating a new task!</div> : null}
            <div className="grid grid-cols-1 gap-2">
              {
                userTasks?.map((task) => (
                  <TaskCard 
                  key={task.id}
                  userTask={task}
                  />
                  
                ))
              }
            </div>
          </CardContent>
          </Card>
        </div>}

      </div>
    </main>
  )
}
