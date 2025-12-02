import { Button } from "./ui/button";
import { Card,CardContent } from "./ui/card";
import { Check,Flame,MoreVertical } from "lucide-react";

interface HabitProps{
    id:number
    name:string 
    description:string | null
    goal:string 
    streak?:number
    progress?:number
    completed?:boolean
    onComplete?:()=>void
}

export function HabitCard({habit,onComplete}: {habit:HabitProps,oncomplete?:()=>void}) {
    //dummny data is used
    // need to add more interactions
    
    const {name,description,goal,streak = 3, progress=20,completed=true} = habit;

    return(
        <Card
        className="group relative overflow-hidden hover:shadow-md hover:border-primary/40 transition-all duration-200"
        >
            <div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"
            />

            <CardContent className="relative p-5 space-y-3 ">

            <div className="flex flex-col items-start justify-between gap-3">

                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground truncate">{name}</h3>
                </div>

                {streak > 0 && (
                    <div
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full shrink-0"
                    >
                        <Flame className="w-4 h-4 text-blue-500"/>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{streak}</span>
                    </div>
                )}

                {description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {description}
                    </p>
                )}
                <div>
                    <p className="text-xs text-muted-foreground">Goal: <span className="text-foreground font-medium">{goal}</span></p>
                </div>

                <div className="pt-1">

             {/* ===== PROGRESS BAR TEST ===== */}
<div className="pt-1 w-40">
  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-blue-500">
    <div
      className="h-full bg-primary transition-all duration-500"
      style={{ width: "50%" }}
    />
  </div>
</div>



                </div>

                <div className="flex items-center gap-2 pt-2">
                <Button
                onClick={onComplete}
                size={'sm'}
                variant={completed ? "default" : "outline"}
                className={
                        `flex-1 rounded-md font-medium text-sm transition-all duration-200
                        ${completed ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-border hover:bg-secondary/50 hover:border-primary/40"}
                        `}
                >
                    <Check className="w-4 h-4 mr-2"/>
                    {completed ? "Completed" : "Mark Complete"}
                </Button>

                <Button
                size={"sm"}
                variant={"ghost"}
                className="p-0 w-9 h-9 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-secondary"
                title="More Options"
                >
                    <MoreVertical className="w-4 h-4"/>
                </Button>
                </div>
            </div>
            </CardContent>
        </Card>
    )

}