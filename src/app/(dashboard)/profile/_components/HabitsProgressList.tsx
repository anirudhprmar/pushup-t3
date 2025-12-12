"use client"

import { api } from "~/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Activity } from "lucide-react"
import { motion } from "motion/react"

export function HabitsProgressList() {
  const { data: habits, isLoading } = api.habit.getAllHabitsWithStats.useQuery()

  if (isLoading) {
    return (
      <Card className="w-full bg-foreground/5 backdrop-blur-sm border-white/10 ">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Habit Consistency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-1/3 bg-white/5 rounded animate-pulse" />
                <div className="h-2 w-full bg-white/5 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!habits || habits.length === 0) {
    return (
      <Card className="w-full bg-foreground/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Habit Consistency</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
          <Activity className="w-8 h-8 mb-2 opacity-20" />
          <p>No habits found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-full bg-foreground/5 backdrop-blur-sm border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-400" />
          Habit Consistency
          <span className="text-xs font-normal text-muted-foreground ml-auto">Last 30 Days</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {habits.map((habit, index) => (
            <motion.div 
              key={habit.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-200">{habit.name}</span>
                <span className={`text-xs font-bold ${
                  habit.completionRate >= 80 ? "text-green-400" :
                  habit.completionRate >= 50 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {habit.completionRate}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${habit.completionRate}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className={`h-full rounded-full ${
                    habit.completionRate >= 80 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" :
                    habit.completionRate >= 50 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
