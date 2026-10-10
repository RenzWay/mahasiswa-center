import { CheckSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TaskHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-sky-100 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300">
            <CheckSquare className="size-4" />
            Tasks
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Organize your work queue
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Track assignments, deadlines, and small wins without making the
            workspace feel heavy.
          </p>
        </div>
        <Button onClick={onCreate} className="h-10 w-full lg:w-auto">
          <Plus className="size-4" />
          Add Task
        </Button>
      </div>
    </header>
  );
}
