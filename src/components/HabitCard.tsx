"use client"

import { Badge } from "./ui/badge";
import { getCategoryIcon } from "~/lib/habitUtils";
import { AnimatedCheck } from "./AnimatedCheck";


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

export function HabitCard({
  habit,
}: {
  habit: HabitProps;
}) {
  const {
    habits: { id, name, description, category, color = "#3b82f6" },
  } = habit;

  const completed = habit.habit_logs?.completed ?? false;

  const CategoryIcon = category ? getCategoryIcon(category) : null;
  
  console.log(name,completed)

  return (
    <div
      className="group relative overflow-hidden rounded-xl backdrop-blur-md bg-white/40 dark:bg-black/20 border-2 "
    >
     

      <div className="relative p-2 space-y-4">
        {/* <div className="grid grid-cols-1"> */}
          <div className="flex items-start justify-between gap-2">

              <div className="flex items-center gap-2">

                <div className="flex items-center justify-center gap-2 ">

                    <AnimatedCheck habitId={id} checkedStatus={habit.habit_logs?.completed ?? false} />

                    <span className={`font-semibold text-base relative inline-block ${habit.habit_logs?.completed ? 'opacity-60 scale-[0.98]':'text-foreground/90 dark:text-foreground '}`} >
                        {name}
                        {false && (
                        <span className="absolute inset-0 h-0.2 bg-destructive top-1/2 -translate-y-1/2 origin-left scale-x-100 " />
                      )}
                    </span>
                    <p className="text-sm text-foreground/70 dark:text-foreground/60 line-clamp-2">
                      {description && description.length > 10 ? description.slice(0,10) + "..." : description }
                    </p>
                </div>
              </div>
                          
              {/* Category Badge */}
              {category && (
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-xs font-medium border"
                    style={{
                      backgroundColor: `${color ?? "#3b82f6"}20`,
                      borderColor: `${color ?? "#3b82f6"}40`,
                      color: color ?? "#3b82f6",
                    }}
                  >
                    {CategoryIcon && <CategoryIcon className="w-3 h-3 mr-1" />}
                    {category}
                  </Badge>
                
                </div>
              )}
            
          </div>
        </div>
      {/* </div> */}
    </div>
  );
}