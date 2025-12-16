"use client"

import { api } from "~/lib/api";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Flame, Target, Loader2, Activity, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { getCategoryIcon } from "~/lib/habitUtils";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";
import { useState } from "react";
import { cn } from "~/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

type TimePeriod = "7" | "30" | "90";

export default function HabitAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const habitId = parseInt(params.id as string);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("30");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: habit, isLoading: habitLoading } = api.habit.getHabitById.useQuery({ habitId });
  const { data: logs, isLoading: logsLoading } = api.habit.getHabitLogs90Days.useQuery({ habitId });
  const { data: statistics, isLoading: statsLoading } = api.habit.getHabitStatistics.useQuery({ habitId });
  
  const deleteHabitMutation = api.habit.deleteHabit.useMutation({
    onSuccess: () => {
      router.push("/profile");
    },
    onError: (error) => {
      console.error("Failed to delete habit:", error);
      alert("Failed to delete habit. Please try again.");
    },
  });

  const handleDeleteHabit = () => {
    deleteHabitMutation.mutate({ habitId });
  };

  if (habitLoading || logsLoading || statsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Habit not found</p>
      </div>
    );
  }

  const CategoryIcon = habit.category ? getCategoryIcon(habit.category) : null;

  // Get data for selected period
  const getPeriodData = () => {
    const days = parseInt(selectedPeriod);
    return logs?.slice(0, days).reverse() ?? [];
  };

  const periodLogs = getPeriodData();
  
  // Prepare data for area chart
  const chartData = periodLogs.map((log) => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: log.completed ? (log.actualValue ?? 100) : 0,
    completed: log.completed ? 1 : 0,
  }));

  // Get current period stats
  const currentStats = selectedPeriod === "7" ? statistics?.week : 
                      selectedPeriod === "30" ? statistics?.month : 
                      statistics?.ninetyDays;

  // Circular progress component - shows actual value with ring based on percentage
  const CircularProgress = ({ value, label, color, maxValue = 100 }: { value: number; label: string; color: string; maxValue?: number }) => {
    // Use smaller size on mobile (70px) and larger on desktop (90px)
    const mobileSize = 70;
    const desktopSize = 90;
    const percentage = maxValue > 0 ? Math.min(100, (value / maxValue) * 100) : 0;
    
    return (
      <div className="flex flex-col items-center gap-2">
        {/* Mobile */}
        <div className="relative sm:hidden" style={{ width: mobileSize, height: mobileSize }}>
          <svg className="transform -rotate-90" width={mobileSize} height={mobileSize}>
            <circle
              cx={mobileSize / 2}
              cy={mobileSize / 2}
              r={(mobileSize - 8) / 2}
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-muted/20"
            />
            <circle
              cx={mobileSize / 2}
              cy={mobileSize / 2}
              r={(mobileSize - 8) / 2}
              stroke={color}
              strokeWidth="6"
              fill="none"
              strokeDasharray={2 * Math.PI * ((mobileSize - 8) / 2)}
              strokeDashoffset={2 * Math.PI * ((mobileSize - 8) / 2) - (percentage / 100) * 2 * Math.PI * ((mobileSize - 8) / 2)}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold" style={{ color }}>{value}</span>
          </div>
        </div>
        
        {/* Desktop */}
        <div className="relative hidden sm:block" style={{ width: desktopSize, height: desktopSize }}>
          <svg className="transform -rotate-90" width={desktopSize} height={desktopSize}>
            <circle
              cx={desktopSize / 2}
              cy={desktopSize / 2}
              r={(desktopSize - 8) / 2}
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-muted/20"
            />
            <circle
              cx={desktopSize / 2}
              cy={desktopSize / 2}
              r={(desktopSize - 8) / 2}
              stroke={color}
              strokeWidth="6"
              fill="none"
              strokeDasharray={2 * Math.PI * ((desktopSize - 8) / 2)}
              strokeDashoffset={2 * Math.PI * ((desktopSize - 8) / 2) - (percentage / 100) * 2 * Math.PI * ((desktopSize - 8) / 2)}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold" style={{ color }}>{value}</span>
          </div>
        </div>
        
        <span className="text-xs text-muted-foreground text-center">{label}</span>
      </div>
    );
  };

  // Weekly calendar view
  const WeeklyCalendar = () => {
    const last7Days = logs?.slice(0, 7).reverse() ?? [];
    
    return (
      <div className="flex justify-between gap-1 sm:gap-2">
        {last7Days.map((log) => {
          const dayOfWeek = new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' });
          return (
            <div key={log.id} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-all",
                  log.completed 
                    ? "text-white shadow-lg" 
                    : "bg-muted/30 text-muted-foreground"
                )}
                style={{
                  backgroundColor: log.completed ? (habit.color ?? "#3b82f6") : undefined,
                }}
              >
                {new Date(log.date).getDate()}
              </div>
              <span className="text-[10px] text-muted-foreground">{dayOfWeek}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/profile")}
              className="-ml-2"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Habit?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete &quot;{habit.name}&quot;? This action cannot be undone and will permanently delete all associated logs and progress data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteHabit}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={deleteHabitMutation.isPending}
                  >
                    {deleteHabitMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Habit"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {habit.category && (
                <Badge
                  variant="secondary"
                  className="text-xs font-medium border"
                  style={{
                    backgroundColor: `${habit.color ?? "#3b82f6"}20`,
                    borderColor: `${habit.color ?? "#3b82f6"}40`,
                    color: habit.color ?? "#3b82f6",
                  }}
                >
                  {CategoryIcon && <CategoryIcon className="w-3 h-3 mr-1" />}
                  {habit.category}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground">{habit.name}</h1>
            {habit.description && (
              <p className="text-sm sm:text-base text-muted-foreground">{habit.description}</p>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              <CircularProgress 
                value={currentStats?.completedDays ?? 0} 
                label="Days Done" 
                color={habit.color ?? "#3b82f6"}
                maxValue={currentStats?.totalDays ?? 1}
              />
              <CircularProgress 
                value={currentStats?.currentStreak ?? 0} 
                label="Day Streak" 
                color="#f59e0b"
                maxValue={30}
              />
              <CircularProgress 
                value={currentStats?.totalDays ?? 0} 
                label="Total Days" 
                color="#10b981"
                maxValue={parseInt(selectedPeriod)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Time Period Selector */}
        <div className="flex items-center gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Period:</span>
          {(["7", "30", "90"] as TimePeriod[]).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="min-w-[60px]"
              style={{
                backgroundColor: selectedPeriod === period ? (habit.color ?? "#3b82f6") : undefined,
                borderColor: selectedPeriod === period ? (habit.color ?? "#3b82f6") : undefined,
              }}
            >
              {period}D
            </Button>
          ))}
        </div>

        {/* Weekly Calendar */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyCalendar />
          </CardContent>
        </Card>

        {/* Progress Chart */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Progress Trend</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Last {selectedPeriod} days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: habit.habitType === "boolean" ? "Completed" : "Value",
                  color: habit.color ?? "#3b82f6",
                },
              }}
              className="h-[200px] sm:h-[300px] w-full"
            >
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={habit.color ?? "#3b82f6"} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={habit.color ?? "#3b82f6"} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                  interval={selectedPeriod === "90" ? 6 : selectedPeriod === "30" ? 3 : 0}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone"
                  dataKey="value" 
                  stroke={habit.color ?? "#3b82f6"}
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col items-center text-center">
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-muted-foreground" />
                <div className="text-xl sm:text-2xl font-bold">{currentStats?.completedDays ?? 0}</div>
                <div className="text-xs text-muted-foreground">Completed Days</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col items-center text-center">
                <Flame className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-orange-500" />
                <div className="text-xl sm:text-2xl font-bold">{currentStats?.currentStreak ?? 0}</div>
                <div className="text-xs text-muted-foreground">Current Streak</div>
              </div>
            </CardContent>
          </Card>

          {currentStats?.avgActualValue && (
            <Card className="col-span-2 sm:col-span-1">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col items-center text-center">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-blue-500" />
                  <div className="text-xl sm:text-2xl font-bold">{currentStats.avgActualValue}</div>
                  <div className="text-xs text-muted-foreground">Avg {habit.targetUnit}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Daily Logs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Activity Log</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Recent entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3 max-h-[400px] overflow-y-auto">
              {logs && logs.length > 0 ? (
                logs.slice(0, 20).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start justify-between p-3 sm:p-4 rounded-lg border transition-colors"
                    style={{
                      borderColor: log.completed ? `${habit.color ?? "#3b82f6"}40` : undefined,
                      backgroundColor: log.completed ? `${habit.color ?? "#3b82f6"}08` : undefined,
                    }}
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm sm:text-base">
                          {new Date(log.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                          })}
                        </span>
                        <Badge 
                          variant={log.completed ? "default" : "secondary"}
                          className="text-xs"
                          style={{
                            backgroundColor: log.completed ? (habit.color ?? "#3b82f6") : undefined,
                          }}
                        >
                          {log.completed ? "✓" : "○"}
                        </Badge>
                      </div>
                      {log.actualValue && (
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {log.actualValue} {habit.targetUnit}
                        </p>
                      )}
                      {log.notes && (
                        <p className="text-xs sm:text-sm text-foreground/80 italic truncate">
                          &ldquo;{log.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  No logs yet. Start tracking!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
