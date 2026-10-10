"use client";

import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ScheduleCalendarCard({
  date,
  onDateChange,
}: {
  date: Date;
  onDateChange: (date: Date) => void;
}) {
  return (
    <Card className="rounded-lg border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <CalendarDays className="size-4 text-emerald-600 dark:text-emerald-300" />
          Calendar
        </CardTitle>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Choose the day you want to organize.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-md border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(value: Date | undefined) => value && onDateChange(value)}
            className="mx-auto w-full min-w-70 bg-transparent"
            classNames={{
              root: "w-full",
              month: "w-full",
              table: "w-full border-collapse",
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
