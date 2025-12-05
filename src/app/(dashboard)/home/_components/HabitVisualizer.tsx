"use client"

import { api } from "~/lib/api";

export default function HabitVisualizer() {
  const { data } = api.habit.getYearlyCompletionDays.useQuery();
  
  const totalDots = 365;
  const containerSize = 330;
  const dotsPerRow = Math.ceil(Math.sqrt(totalDots)); // 20
  const spacing = containerSize / (dotsPerRow + 1); // even spacing

  // Create a Set of completed day numbers for O(1) lookup
  const completedDayNumbers = new Set<number>(data?.completedDayNumbers ?? []);

  const dots = [];

  for (let i = 0; i < totalDots; i++) {
    const row = Math.floor(i / dotsPerRow);
    const col = i % dotsPerRow;

    const x = spacing + col * spacing;
    const y = spacing + row * spacing;

    dots.push({ x, y, day: i + 1 });
  }

  return (
    <div className="flex flex-col items-center justify-center ">

      <div
        className="relative rounded-lg "
        style={{
          width: containerSize,
          height: containerSize,
        }}
      >
        {dots.map(({ x, y, day }) => {
          const isCompleted = completedDayNumbers.has(day);
          
          return (
            <div
              key={day}
              className={
                isCompleted 
                  ? "bg-emerald-400 absolute w-2 h-2 rounded-full shadow-sm shadow-emerald-500/50" 
                  : "absolute w-2 h-2 rounded-full bg-zinc-700"
              }
              style={{
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)',
              }}
              title={`Day ${day}${isCompleted ? ' ✓ All habits completed!' : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
}
