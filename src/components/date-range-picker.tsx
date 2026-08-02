"use client";

import { X } from "lucide-react";
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  id?: string;
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  disabled?: boolean;
  className?: string;
  numberOfMonths?: number;
}

export function DateRangePicker({
  id = "date-picker-range",
  date,
  onDateChange,
  disabled,
  className,
  numberOfMonths = 2,
}: DateRangePickerProps) {
  const hasValue = Boolean(date?.from);

  return (
    <div className={cn("relative", className)}>
      <Popover>
        <PopoverTrigger
          disabled={disabled}
          render={
            <Button
              variant="outline"
              id={id}
              className={cn(
                "w-full justify-start px-2.5 font-normal",
                hasValue && "pr-8"
              )}
            >
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={numberOfMonths}
          />
        </PopoverContent>
      </Popover>
      {hasValue && (
        <button
          type="button"
          aria-label="Clear date range"
          disabled={disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDateChange(undefined);
          }}
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
