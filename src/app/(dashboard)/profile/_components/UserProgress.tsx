"use client"
import React from 'react'
import { Progress } from '~/components/ui/progress'
import { Skeleton } from '~/components/ui/skeleton'
import { api } from '~/lib/api'

export default function UserProgress() {
    const {data:totalDays,isLoading} = api.habits.getYearlyCompletionDays.useQuery()
    if (isLoading) {
        return <div><Skeleton className='w-2 h-2'/></div>
    }
    const progressValue = totalDays?.completedDayNumbers?.length ?? 0
  return (
    <div className='flex flex-col items-center justify-center w-full gap-2'>
          <Progress value={progressValue}  />
          <p className='text-muted-foreground'>{progressValue} of 365 days</p>
    </div>
  )
}
