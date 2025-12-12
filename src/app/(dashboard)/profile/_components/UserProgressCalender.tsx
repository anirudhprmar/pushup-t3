"use client"

import * as React from "react"

import { Calendar } from "~/components/ui/calendar"
// import { Day } from 'react-day-picker';
import { api } from "~/lib/api";



const getDates = (data: Record<string, boolean | object> | undefined) => {
  const successfulDates: Date[] = [];
  const failedDates: Date[] = [];

  if (!data) return { successfulDates, failedDates };

  for (const dateString in data) {
    const status = data[dateString];
    // Parse the date string (e.g., '2025-12-09') into a Date object
    const [year, month, day] = dateString.split('-').map(Number);

    // We use month - 1 because January is month 0
    if (year && month && day) {
      const date = new Date(year, month - 1, day);
      if (status === true) {
        successfulDates.push(date);
      } else {
        failedDates.push(date);
      }
    }
  }
  return { successfulDates, failedDates };
};

export function UserProgressCalender() {
  const { data } = api.habit.getYearlyCompletionDaysDetailed.useQuery();
  const {successfulDates, failedDates} = getDates(data?.completedDayNumbersDetailed);
  return (
   <>
    <div className="w-full max-w-3xl ">
      <Calendar
        mode="single"
        className="w-fit p-0"
        classNames={{
          months: "flex flex-col w-full",
          month: "space-y-4 w-full flex flex-col items-center p-5",
          caption: "flex justify-between pt-1 relative items-center px-2 w-full max-w-md mx-auto mb-4",
          caption_label: "text-2xl font-light text-white",
          nav: "space-x-1 absolute right-0 md:right-10 p-5",
          nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 text-white hover:bg-gray-800 rounded-full transition-all ",
          nav_button_previous: "absolute right-10",
          nav_button_next: "absolute right-0",
          table: "w-fit border-collapse space-y-1 mx-auto",
          head_row: "flex w-full gap-5 mb-4",
          head_cell: "text-gray-500 rounded-md w-12 font-normal text-[0.8rem] uppercase tracking-wider text-center",
          row: "flex w-full gap-5 mt-2",
          cell: "h-12 w-12 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 rounded-full border border-gray-800 text-gray-400 transition-all pointer-events-none",
          day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white border-blue-600 focus:bg-blue-600 focus:text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]",
          day_today: "bg-gray-800 text-white border-gray-600 ",
          day_outside: "text-gray-700 opacity-30",
          day_disabled: "text-gray-700 opacity-30",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
        }}
        modifiers={{
          hasEvent: successfulDates, 
          failedEvent: failedDates
        }}
        modifiersClassNames={{
           hasEvent: "bg-blue-600 text-white border-blue-600", 
          failedEvent: "bg-red-600/20 text-red-500 border-red-600/50" 
        }}
      />
    </div>
   </>
  )
}
