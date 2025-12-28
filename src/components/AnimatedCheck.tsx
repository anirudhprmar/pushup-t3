"use client"
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ConfettiCelebration } from "./ConfettiCelebration";
import { api } from "~/lib/api";
import { Button } from "./ui/button";
import { set } from "zod";

export function AnimatedCheck({habitId,checkedStatus}:{habitId:string, checkedStatus?:boolean}) {
  const [isChecked,setIsChecked] = useState(false)
 



    const trpc = api.useUtils()
    const markCompleted = api.habits.setHabitCompleted.useMutation({
      onSuccess: async () => {
        await trpc.habits.invalidate()
      }
    })
    
    const handleCheck = async()=>{
      await markCompleted.mutateAsync({
        habitId,
        notes:"test2",
      })
      setIsChecked(!isChecked)
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
            {/* Empty circle or subtle outline */}
            <Button onClick={handleCheck} variant={'default'} size={'sm'} className="w-6 h-6 rounded-full border-2 border-gray-300" />
          </motion.div>
        )}
      </AnimatePresence>

      <ConfettiCelebration trigger={isChecked} color={"#3b82f6"} />
    </div>
  );
}
