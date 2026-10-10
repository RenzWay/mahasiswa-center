import { CalendarDays, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { EmptyState } from "@/components/EmptyState";
import { formatDate } from "@/app/lib/formatdate";
import type { DashboardTask } from "@/hooks/useDashboard";

export function UpcomingTasks({
  tasks,
  activeCount,
}: {
  tasks: DashboardTask[];
  activeCount: number;
}) {
  const visibleTasks = tasks.slice(0, 4);
  return (
    <SectionCard
      title="Upcoming Tasks"
      description={`${activeCount} task masih aktif`}
      href="/task"
      action="Open"
    >
      {visibleTasks.length ? (
        visibleTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900 sm:items-center"
          >
            <Checkbox
              checked={task.complete}
              className="mt-0.5 size-5 shrink-0 sm:mt-0"
            />
            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm font-semibold ${task.complete ? "text-slate-400 line-through" : "text-slate-800 dark:text-slate-100"}`}
              >
                {task.title}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <CalendarDays className="size-3" />
                {formatDate(task.date)}
              </p>
            </div>
            {task.complete && (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500 sm:mt-0" />
            )}
          </div>
        ))
      ) : (
        <EmptyState label="No task yet" />
      )}
    </SectionCard>
  );
}
