"use client"

import * as React from "react"
import { Button } from "~/components/ui/button"
import { Pause, Play, RotateCcw, Timer } from "lucide-react"

interface PomodoroTimerProps {
  onComplete?: () => void
  defaultDuration?: number // in minutes
}

export function PomodoroTimer({ onComplete, defaultDuration = 25 }: PomodoroTimerProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isRunning, setIsRunning] = React.useState(false)
  const [timeLeft, setTimeLeft] = React.useState(defaultDuration * 60) // in seconds
  const [totalTime] = React.useState(defaultDuration * 60)

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            onComplete?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, onComplete])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = ((totalTime - timeLeft) / totalTime) * 100

  const handleReset = () => {
    setTimeLeft(defaultDuration * 60)
    setIsRunning(false)
  }

  if (!isVisible) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsVisible(true)}
        className="w-full"
      >
        <Timer className="w-4 h-4 mr-2" />
        Show Pomodoro Timer
      </Button>
    )
  }

  return (
    <div className="space-y-4 p-6 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Timer className="w-5 h-5" />
          Pomodoro Timer
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
        >
          Hide
        </Button>
      </div>

      {/* Circular Progress */}
      <div className="relative flex items-center justify-center">
        <svg className="w-48 h-48 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
            className="text-primary transition-all duration-1000"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold font-mono tabular-nums">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {isRunning ? "Focus time" : "Paused"}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <Button
          type="button"
          onClick={() => setIsRunning(!isRunning)}
          size="lg"
          className="gap-2"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start
            </>
          )}
        </Button>
        <Button
          type="button"
          onClick={handleReset}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>
    </div>
  )
}
