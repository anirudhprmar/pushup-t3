import { Activity, BookOpen, Brain, Dumbbell, Heart, Palette, Users, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const HABIT_CATEGORIES = [
  "Fitness",
  "Learning",
  "Health",
  "Productivity",
  "Mindfulness",
  "Social",
  "Creative",
  "Other",
] as const;

export const HABIT_COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#f97316", // orange
  "#6366f1", // indigo
  "#14b8a6", // teal
  "#ef4444", // red
] as const;

export type HabitCategory = typeof HABIT_CATEGORIES[number];
export type HabitType = "boolean" | "numeric" | "timer";

/**
 * Get display label for habit type
 */
export function getHabitTypeLabel(type: HabitType): string {
  const labels: Record<HabitType, string> = {
    boolean: "Simple Checkbox",
    numeric: "Numeric Goal",
    timer: "Time-Based",
  };
  return labels[type];
}

/**
 * Format target value with unit
 */
export function formatTargetValue(value: number | null, unit: string | null): string {
  if (!value || !unit) return "";
  return `${value} ${unit}`;
}

/**
 * Calculate percentage progress
 */
export function calculateProgress(actual: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(Math.round((actual / target) * 100), 100);
}

/**
 * Get default color for category
 */
export function getDefaultColor(category: string): string {
  const colorMap: Record<string, string> = {
    Fitness: "#f97316", // orange
    Learning: "#3b82f6", // blue
    Health: "#10b981", // emerald
    Productivity: "#8b5cf6", // purple
    Mindfulness: "#06b6d4", // cyan
    Social: "#ec4899", // pink
    Creative: "#f59e0b", // amber
    Other: "#6366f1", // indigo
  };
  return colorMap[category] ?? "#3b82f6";
}

/**
 * Get icon for category
 */
export function getCategoryIcon(category: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    Fitness: Dumbbell,
    Learning: BookOpen,
    Health: Heart,
    Productivity: Zap,
    Mindfulness: Brain,
    Social: Users,
    Creative: Palette,
    Other: Activity,
  };
  return iconMap[category] ?? Activity;
}
