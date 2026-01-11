import { Activity, TreeDeciduous } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Skeleton } from "~/components/ui/skeleton"

export default function SkeletonHabits() {
  return (
    <div className="space-y-6">
        <Card className="bg-secondary w-full max-w-4xl">
            <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
                <TreeDeciduous className="text-primary"/>
                Current Habits
                </CardTitle>
            </CardHeader>
        <CardContent>
                <div className="grid grid-cols-1 gap-2">

            <div className="flex items-center justify-between">

                <div className="flex items-center justify-center gap-2 ">
                    <div>
                        <Skeleton className="w-8 h-8 rounded-lg"/>
                    </div>
                      <div className="flex justify-end gap-2">
                        <Skeleton className="w-30 h-6 rounded-md"/>
                        <Skeleton className="w-16 h-6 rounded-md"/>
                    </div>
                </div>
                <div>
                    <Skeleton className="w-20 h-6 rounded-full"/>
                </div>
            </div>

               <div className="flex items-center justify-between mt-2">

                <div className="flex items-center justify-center gap-2 ">
                    <div>
                        <Skeleton className="w-8 h-8 rounded-lg"/>
                    </div>
                      <div className="flex justify-end gap-2">
                        <Skeleton className="w-30 h-6 rounded-md"/>
                        <Skeleton className="w-16 h-6 rounded-md"/>
                    </div>
                </div>
                <div>
                    <Skeleton className="w-20 h-6 rounded-full"/>
                </div>
            </div>
            </div>
        </CardContent>
        </Card>
            
        <Card className="bg-secondary w-full max-w-4xl">
            <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Habit Consistency
                <span className="text-xs font-normal text-muted-foreground ml-auto">over 365 days</span>
            </CardTitle>
            </CardHeader>
            <CardContent>
             <div className="grid grid-cols-1 gap-2">

            <div className="flex items-center justify-between">

                <div className="flex items-center justify-center gap-2 ">
                    <div>
                        <Skeleton className="w-8 h-8 rounded-lg"/>
                    </div>
                      <div className="flex justify-end gap-2">
                        <Skeleton className="w-30 h-6 rounded-md"/>
                        <Skeleton className="w-16 h-6 rounded-md"/>
                    </div>
                </div>
                <div>
                    <Skeleton className="w-20 h-6 rounded-full"/>
                </div>
            </div>

               <div className="flex items-center justify-between mt-2">

                <div className="flex items-center justify-center gap-2 ">
                    <div>
                        <Skeleton className="w-8 h-8 rounded-lg"/>
                    </div>
                      <div className="flex justify-end gap-2">
                        <Skeleton className="w-30 h-6 rounded-md"/>
                        <Skeleton className="w-16 h-6 rounded-md"/>
                    </div>
                </div>
                <div>
                    <Skeleton className="w-20 h-6 rounded-full"/>
                </div>
            </div>
            </div>
        </CardContent>
        </Card>
    </div>
  )
}


    
