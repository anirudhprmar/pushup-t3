"use client"

// import { Timer } from "lucide-react";
import { AnimatedCheckTasks } from "./AnimatedCheckTasks";
import SkeletonTasks from "./SkeletonTasks";

interface TaskProps {
  id: string;
  userId: string;
  habitId: string | null;
  task: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  completed: boolean
  targetValue:number | null 
  targetUnit:string | null
  createdAt: Date;
  updatedAt: Date;
}

export function TaskCard({
  userTask,
}: {
  userTask: TaskProps;
}) {


  if(!userTask){
    return <SkeletonTasks/>
  }


  return (
    <div
      className="group relative overflow-hidden rounded-xl backdrop-blur-md bg-white/40 dark:bg-black/20 border-2 "
    >
     

      <div className="relative p-2 space-y-4">
          <div className="flex items-start justify-between gap-2">
                <div className="flex items-center justify-center gap-2 ">

                    <AnimatedCheckTasks taskId={userTask.id} habitId={userTask.habitId ?? ""} checkedStatus={userTask?.completed ?? false} />

                    <span className={`font-semibold text-base relative inline-block ${userTask?.completed ? 'opacity-60 scale-[0.98]':'text-foreground/90 dark:text-foreground '}`} >
                        {userTask.task}
                        {false && (
                        <span className="absolute inset-0 h-0.2 bg-destructive top-1/2 -translate-y-1/2 origin-left scale-x-100 " />
                      )}
                    </span>

                </div>

                {/* <Timer/> */}
          </div>
        </div>
    </div>
  );
}