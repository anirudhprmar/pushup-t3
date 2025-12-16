"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { api } from "~/lib/api"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { PomodoroTimer } from "~/components/PomodoroTimer"
import { ConfettiCelebration } from "~/components/ConfettiCelebration"
import { JournalEntry } from "~/components/JournalEntry"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { formatTargetValue, getCategoryIcon } from "~/lib/habitUtils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"

export default function HabitExecutePage() {
  const params = useParams()
  const router = useRouter()
  const habitId = parseInt(params.id as string)

  const [showPomodoroDialog, setShowPomodoroDialog] = React.useState(true)
  const [usePomodoro, setUsePomodoro] = React.useState(false)
  const [actualValue, setActualValue] = React.useState<number | undefined>()
  const [showConfetti, setShowConfetti] = React.useState(false)
  const [showJournal, setShowJournal] = React.useState(false)

  const { data: habit, isLoading: habitLoading } = api.habit.habits.useQuery()
  const { data: progress } = api.habit.getHabitProgress.useQuery({ habitId })
  
  const trpc = api.useUtils()
  const startHabit = api.habit.startHabit.useMutation()
  const completeHabit = api.habit.completeHabit.useMutation({
    onSuccess: async () => {
      await trpc.habit.invalidate()
      setShowConfetti(true)
      // Show journal after a brief delay
      setTimeout(() => {
        setShowJournal(true)
      }, 1500)
    },
  })

  const currentHabit = habit?.find((h) => h.id === habitId)
  const CategoryIcon = currentHabit?.category ? getCategoryIcon(currentHabit.category) : null

  // Track if we've already started the habit to prevent infinite loop
  const hasStartedRef = React.useRef(false)

  // Start habit on mount if not already started
  React.useEffect(() => {
    if (!progress && habitId && !hasStartedRef.current && !startHabit.isPending) {
      hasStartedRef.current = true
      startHabit.mutate({ habitId })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitId, progress]) // Removed startHabit from dependencies to prevent infinite loop

  const handlePomodoroChoice = (useIt: boolean) => {
    setUsePomodoro(useIt)
    setShowPomodoroDialog(false)
  }

  const handleComplete = async () => {
    if (!currentHabit) return

    // Validate numeric/timer habits have actual value
    if (
      (currentHabit.habitType === "numeric" || currentHabit.habitType === "timer") &&
      !actualValue
    ) {
      toast.error("Please enter the actual value achieved")
      return
    }

    await completeHabit.mutateAsync({
      habitId,
      actualValue,
    })
  }

  const handleJournalSave = async (notes: string) => {
    // Update the habit log with notes
    await completeHabit.mutateAsync({
      habitId,
      actualValue,
      notes,
    })
    setShowJournal(false)
    toast.success("Habit completed! Great work! 🎉")
    setTimeout(() => {
      router.push("/profile")
    }, 1000)
  }

  const handleJournalSkip = () => {
    setShowJournal(false)
    toast.success("Habit completed! Great work! 🎉")
    setTimeout(() => {
      router.push("/profile")
    }, 1000)
  }

  if (habitLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!currentHabit) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Habit not found</h2>
          <Button onClick={() => router.push("/profile")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  const isCompleted = progress?.completed ?? false

  return (
    <>
      <ConfettiCelebration trigger={showConfetti} color={currentHabit.color ?? "#3b82f6"} />
      <JournalEntry
        isOpen={showJournal}
        onSave={handleJournalSave}
        onSkip={handleJournalSkip}
        habitName={currentHabit.name}
      />

      {/* Pomodoro Dialog */}
      <Dialog open={showPomodoroDialog} onOpenChange={setShowPomodoroDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ready to work on {currentHabit.name}?</DialogTitle>
            <DialogDescription>
              Would you like to use a Pomodoro timer to help you focus?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => handlePomodoroChoice(false)}>
              No, thanks
            </Button>
            <Button onClick={() => handlePomodoroChoice(true)}>
              Yes, use Pomodoro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/profile")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <div
              className="p-8 rounded-2xl border-2 transition-all"
              style={{
                borderColor: currentHabit.color ?? "#3b82f6",
                backgroundColor: `${currentHabit.color ?? "#3b82f6"}10`,
              }}
            >
              <div className="flex items-start gap-4">
                {CategoryIcon && (
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${currentHabit.color ?? "#3b82f6"}20` }}
                  >
                    <CategoryIcon
                      className="w-8 h-8"
                      style={{ color: currentHabit.color ?? "#3b82f6" }}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{currentHabit.name}</h1>
                  <p className="text-lg text-muted-foreground mb-1">{currentHabit.goal}</p>
                  {currentHabit.description && (
                    <p className="text-sm text-muted-foreground">{currentHabit.description}</p>
                  )}
                  {(currentHabit.habitType === "numeric" || currentHabit.habitType === "timer") && (
                    <p className="text-sm font-medium mt-2">
                      Target: {formatTargetValue(currentHabit.targetValue, currentHabit.targetUnit)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pomodoro Timer (if enabled) */}
          {usePomodoro && !isCompleted && (
            <div className="mb-8">
              <PomodoroTimer />
            </div>
          )}

          {/* Actual Value Input (for numeric/timer habits) */}
          {!isCompleted && (currentHabit.habitType === "numeric" || currentHabit.habitType === "timer") && (
            <div className="mb-8 p-6 rounded-xl border border-border bg-card">
              <label className="block text-sm font-medium mb-2">
                How much did you achieve?
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={actualValue ?? ""}
                  onChange={(e) => setActualValue(e.target.valueAsNumber)}
                  placeholder={`Enter ${currentHabit.targetUnit ?? "value"}`}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">
                  {currentHabit.targetUnit}
                </span>
              </div>
            </div>
          )}

          {/* Complete Button */}
          {!isCompleted && (
            <Button
              onClick={handleComplete}
              disabled={completeHabit.isPending}
              size="lg"
              className="w-full gap-2"
            >
              <Check className="w-5 h-5" />
              {completeHabit.isPending ? "Completing..." : "Complete Habit"}
            </Button>
          )}

          {/* Already Completed Message */}
          {isCompleted && (
            <div className="text-center p-8 rounded-xl border border-border bg-card">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2">Habit Completed!</h2>
              <p className="text-muted-foreground mb-4">
                Great job on completing {currentHabit.name} today!
              </p>
              <Button onClick={() => router.push("/profile")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
