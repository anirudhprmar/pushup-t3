import React from 'react'
import dateAndactualMonth from '~/lib/day&months';
import { cn } from '~/lib/utils';

interface CalendarProps{
    logs: {
      id: string;
      habitId: string;
      date: string;
      completed: boolean;
      notes: string | null;
      createdAt: Date;
      updatedAt: Date;
  }[],
  habitColor:string
}

export default function WeeklyCalender({logs,habitColor}:CalendarProps) {
  return (
    <div className='flex gap-2'>
      {logs && logs.length > 0 ? logs.reverse().map((log)=>( 
        <div key={log.id} className='flex flex-col justify-between gap-2 sm:gap-2'>
          <span className="text-[10px] text-muted-foreground">{new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
        <div
        className={cn(
          "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-all",
          log.completed ?
          "text-white shadow-lg" 
          : "bg-muted/30 text-muted-foreground"
        )}
        style={{
          backgroundColor: log?.completed ? (habitColor) : undefined,
        }}
        >
        {new Date(log.date).getDate()}
        </div>
      </div>
      )): <div>No logs Available.</div>}
      
    </div>
  )
}


         