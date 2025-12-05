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
  goal: string;
  category: string | null;
  color: string | null;
  habitType: "boolean" | "numeric" | "timer";
  targetValue: number | null;
  targetUnit: string | null;
  streak?: number;
  progress?: number;
  completed?: boolean;
  inProgress?: boolean;
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
    goal,
    category,
    color = "#3b82f6",
    habitType,
    targetValue,
    targetUnit,
    streak = 0,
    progress = 0,
    completed = false,
    inProgress = false,
    change = 0,
  } = habit;

  const CategoryIcon = category ? getCategoryIcon(category) : null;

  // Calculate number of filled segments (out of 30)
  const totalSegments = 30;
  const filledSegments = Math.floor((progress / 100) * totalSegments);

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
      style={{
        borderColor: inProgress ? (color ?? "#3b82f6") : `${color ?? "#3b82f6"}40`,
        boxShadow: inProgress ? `0 0 20px ${color ?? "#3b82f6"}40` : undefined,
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${color ?? "#3b82f6"} 0%, transparent 100%)`,
        }}
      />

      {/* Glass reflection effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* In Progress Pulse */}
      {inProgress && (
        <div
          className="absolute inset-0 animate-pulse opacity-20 pointer-events-none"
          style={{ backgroundColor: color ?? "#3b82f6" }}
        />
      )}

      <div className="relative p-6 space-y-4">
        {/* Header with title, category, and streak */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2 flex-1">
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
                  {inProgress && (
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium animate-pulse"
                    >
                      <span style={{ color: color ?? "#3b82f6" }}>In Progress</span>
                    </Badge>
                  )}
                </div>
              )}

              {/* Title */}
              <h3 className="font-semibold text-base text-foreground/90 dark:text-foreground">
                {name}
              </h3>
            </div>

            {/* Streak Badge */}
            {streak > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full shrink-0">
                <Flame className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                  {streak}
                </span>
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
          {(habitType === "numeric" || habitType === "timer") && targetValue && (
            <p className="text-xs text-muted-foreground">
              Target: {formatTargetValue(targetValue, targetUnit)}
            </p>
          )}
        </div>

        {/* Progress Section */}
        <div className="space-y-3 pt-2">
          {/* Progress Stats */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold font-mono tabular-nums text-foreground/90 dark:text-foreground">
              {progress}%
            </span>
            {change > 0 && (
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {change}%
              </span>
            )}
            <span className="text-xs text-foreground/50 dark:text-foreground/40 ml-auto">
              {goal}
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="flex gap-0.5">
            {Array.from({ length: totalSegments }).map((_, i) => (
              <div
                key={i}
                className={`h-12 flex-1 transition-all duration-300`}
                style={{
                  backgroundColor:
                    i < filledSegments ? (color ?? "#3b82f6") : `${color ?? "#3b82f6"}20`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          {completed ? (
            <Button
              size="sm"
              variant="default"
              className="flex-1 rounded-lg font-medium text-sm transition-all duration-200 backdrop-blur-sm"
              style={{
                backgroundColor: color ?? "#3b82f6",
                color: "white",
              }}
              disabled
            >
              <Check className="w-4 h-4 mr-2" />
              Completed
            </Button>
          ) : (
            <Button
              onClick={handleButtonClick}
              size="sm"
              variant="outline"
              className="flex-1 rounded-lg font-medium text-sm transition-all duration-200 backdrop-blur-sm border-2"
              style={{
                borderColor: color ?? "#3b82f6",
                color: color ?? "#3b82f6",
              }}
            >
              {inProgress ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Continue
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Habit
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}