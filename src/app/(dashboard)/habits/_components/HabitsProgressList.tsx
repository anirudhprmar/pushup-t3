"use client"

import { api } from "~/lib/api"
import { motion } from "motion/react"
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SkeletonHabitProgress from "../../profile/_components/SkeletonHabitProgress";

interface HabitProps {
habits: {
        id: string;
        userId: string;
        goalId: string | null;
        name: string;
        description: string | null;
        category: string | null;
        color: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
  habit_logs: {
      id: string;
      habitId: string;
      date: string;
      completed: boolean;
      notes: string | null;
      createdAt: Date;
      updatedAt: Date;
  } | null;
}

export function HabitsProgressList({habit}: {habit: HabitProps}) {

  const { data, isLoading } = api.habits.getHabitStatistics.useQuery({
    habitId: habit.habits.id,
  })

  

  if (isLoading) {
    return <SkeletonHabitProgress/>
  }

  if (!data) {
    return (
      <div>No data available</div>
    )
  }

  return (
  <div className="space-y-5">
  
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05 }}
        className="space-y-1.5"
      >
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground text-lg flex items-baseline gap-3">
            {habit.habits.name}
            <span className="text-xs text-muted-foreground">
              <Link href={`/habits/${habit.habits.id}/analysis`} className=" hover:text-primary transition-colors flex items-center gap-1">
              Learn More <ArrowUpRight className="size-3"/>
              </Link>
            </span>  
          </span>
          <span className={`text-md font-bold ${
            data.week.completedDays >= 292 ? "text-green-400" :
            data.week.completedDays >= 292 ? "text-green-400" :
            data.week.completedDays >= 182 ? "text-yellow-400" : "text-red-400"
          }`}>
            { data.week.completedDays === 1 ? `${data.week.completedDays} day` : `${data.week.completedDays} days`}
          </span>
        </div>
        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${data.week.completedDays}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-full rounded-full ${
              data.week.completedDays >= 292 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" :
             data.week.completedDays >= 182 ? "bg-yellow-500" : "bg-red-500"
            }`}
          />
        </div>
      </motion.div>

  </div>
  )
}
