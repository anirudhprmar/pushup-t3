"use client"
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/lib/api"
import { TaskForm } from "./_components/TaskForm";
import { TaskCard } from "./_components/TaskCard";


export default function Tasks() {
  const {data:userTasks,isLoading,error} = api.tasks.listAllTasks.useQuery()
  const router = useRouter()

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
              <p>Tasks</p>
            </h1>
              <TaskForm/>
          </div>
        </div>

        {isLoading ? <p>Loading tasks...</p> : (
          <div className="space-y-6">
            {/* All Habits */}
            {userTasks && userTasks.length > 0 ? (
              <div>
              <Card className="bg-secondary w-full max-w-4xl">
                 <CardHeader>
                  <CardTitle className="text-lg font-medium ">
                     Todays Tasks
                    </CardTitle>
                </CardHeader>
              <CardContent>

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

              </div>

            ) : (
              <p>No tasks found. Start by creating a new habit!</p>
            )}

          </div>
        )}
      </div>
    </main>
  )
}
