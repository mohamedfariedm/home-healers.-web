"use client"

import type * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 w-full max-w-md mx-auto text-black", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "text-lg font-bold text-[#1e1e1e]",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-8 w-8 bg-white rounded-full shadow-sm border border-[#d0d5dd] p-0 opacity-70 hover:opacity-100 flex items-center justify-center",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex w-full mb-2",
        head_cell: "text-[#1e1e1e] rounded-md flex-1 font-medium text-sm text-center py-2",
        row: "flex w-full",
        cell: "flex-1 text-center text-sm p-1 relative",
        day: cn(
          "h-8 w-full p-0 font-medium text-sm rounded-md flex items-center justify-center",
          "hover:bg-[#eff6fe] transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-[#62a0f6] focus:ring-offset-2",
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-[#62a0f6] text-white hover:bg-[#62a0f6] hover:text-white focus:bg-[#62a0f6] focus:text-white shadow-sm",
        day_today: "bg-[#eff6fe] text-[#1e1e1e] font-semibold",
        day_outside: "text-[rgba(0,23,83,0.15)] opacity-50",
        day_disabled: "text-[rgba(0,23,83,0.15)] opacity-30 cursor-not-allowed",
        day_range_middle: "aria-selected:bg-[#eff6fe] aria-selected:text-[#1e1e1e]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4 text-[#1e1e1e]" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4 text-[#1e1e1e]" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
