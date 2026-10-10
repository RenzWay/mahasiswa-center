import { CalendarCheck } from "lucide-react";

export function EmptySchedule() {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 text-center dark:border-slate-800 dark:bg-slate-950">
      <CalendarCheck className="mb-3 size-8 text-slate-400 dark:text-slate-500" />
      <p className="font-semibold text-slate-700 dark:text-slate-200">
        No schedule for this date
      </p>
      <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
        Add a class, deadline, or campus activity to keep this day organized.
      </p>
    </div>
  );
}
