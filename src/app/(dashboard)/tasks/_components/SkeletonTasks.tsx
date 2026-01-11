import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Skeleton } from "~/components/ui/skeleton"

export default function SkeletonTasks() {
  return (
    <div className="space-y-6">  
        <Card className="bg-secondary w-full max-w-4xl">
             <CardHeader>
              <CardTitle className="text-lg font-medium ">
                  Todays Tasks
                </CardTitle>
            </CardHeader>
            <CardContent>
             <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center justify-between">

                <div className="flex items-center justify-center gap-2" >
                        <Skeleton className="w-8 h-8 rounded-lg"/>
                        <Skeleton className="w-30 h-8 rounded-md"/>
                </div>

              
            </div>
                
            </div>
        </CardContent>
        </Card>
    </div>
  )
}
