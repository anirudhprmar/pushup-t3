import { Skeleton } from "~/components/ui/skeleton"

export default function SkeletonHabitProgress() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-24 rounded-sm" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-14 rounded-sm" />
      </div>
      <div>
        <Skeleton className="w-full h-3 rounded-full" />
      </div>
    </div>
  )
}
