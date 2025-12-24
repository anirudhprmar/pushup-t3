"use client"

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Check, Flame, Play, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCategoryIcon, formatTargetValue } from "~/lib/habitUtils";

interface HabitProps {
  id: number;
  name: string;
  description: string | null;
  goalId?: string | null;
  category: string | null;
  color: string | null;
 streak?: number;
  progress?: number;
  completed?: boolean;
  change?: number;
}

export function HabitCard({
  habit,
}: {
  habit: HabitProps;
}) {
  const router = useRouter();
  const {
    id,
    name,
    description,
    category,
    color = "#3b82f6",
    streak = 0,
    progress = 0,
    completed = false,
    change = 0,
  } = habit;

  const CategoryIcon = category ? getCategoryIcon(category) : null;


  const handleStartOrContinue = () => {
    router.push(`/habit/${id}/execute`);
  };

  const handleCardClick = () => {
    router.push(`/habit/${id}/analysis`);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking button
    handleStartOrContinue();
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative overflow-hidden rounded-xl backdrop-blur-md bg-white/40 dark:bg-black/20 
                 border-2 transition-all duration-300 ease-out
                 hover:bg-white/50 dark:hover:bg-black/30 
                 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30
                 hover:scale-[1.02] hover:-translate-y-0.5
                 cursor-pointer"
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${color ?? "#3b82f6"} 0%, transparent 100%)`,
        }}
      />

      {/* Glass reflection effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />
     

      <div className="relative p-6 space-y-4">
        {/* Header with title, category, and streak */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2 flex-1">
              {/* Title */}
              <h3 className="font-semibold text-base text-foreground/90 dark:text-foreground">
                {name}
              </h3>


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

          {/* Description */}
          {description && (
            <p className="text-sm text-foreground/70 dark:text-foreground/60 line-clamp-2">
              {description}
            </p>
          )}

          {/* Target Value (for numeric/timer habits) */}
         
        </div>
      </div>
    </div>
  );
}