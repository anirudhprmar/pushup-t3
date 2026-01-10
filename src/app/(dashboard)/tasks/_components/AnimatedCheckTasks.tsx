"use client"
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ConfettiCelebration } from "~/components/ConfettiCelebration";
import { api } from "~/lib/api";

export function AnimatedCheckTasks({taskId,habitId,checkedStatus}:{taskId:string,habitId:string, checkedStatus?:boolean}) {
  const [isChecked,setIsChecked] = useState(false)

    const trpc = api.useUtils()
    const markCompleted = api.tasks.completeTask.useMutation({
      onSuccess: async () => {
        await trpc.habits.invalidate()
        await trpc.habits.getHabitCompletionDays.invalidate({habitId})
      }
    })
    
    const handleCheck = async()=>{
      await markCompleted.mutateAsync({
        taskId,
        habitId,
        notes:"testing123",
        completed:true
      })
      setIsChecked(true)
    }

  return (
    <div className="relative w-6 h-6">
      {/* click off update the database with not completed */}

      <AnimatePresence mode="wait">
        {isChecked || checkedStatus ? (
          <motion.div
            key="checked"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
              duration: 0.3
            }}
          >
            <Check className="w-6 h-6 text-green-500" />
          </motion.div>
        ) : (
          <motion.div
            key="unchecked"
            initial={{ scale: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div onClick={handleCheck} className="w-6 h-6 rounded-lg border-2 border-gray-300 bg-transparent cursor-pointer transition-colors"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfettiCelebration trigger={isChecked} color={"#3b82f6"} />
    </div>
  );
}
