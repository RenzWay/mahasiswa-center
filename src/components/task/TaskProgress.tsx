import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TaskProgress({
  completionRate,
  nextTask,
  todayCount,
}: {
  completionRate: number;
  nextTask?: string;
  todayCount: number;
}) {
  return (
    <Card className="rounded-lg border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="text-base font-bold">Progress</CardTitle>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          A quick pulse on your task list.
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-600 dark:text-slate-300">
              Completion
            </span>
            <span className="font-bold">{completionRate}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-sky-600 transition-all dark:bg-sky-400"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Next active task
            </p>
            <p className="mt-2 line-clamp-2 font-semibold">
              {nextTask || "No active task"}
            </p>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm text-slate-500 dark:text-slate-400">Today</p>
            <p className="mt-2 font-semibold">{todayCount} task due today</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
