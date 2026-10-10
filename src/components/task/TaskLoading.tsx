import { Loader2 } from "lucide-react";

export function TaskLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-10 animate-spin text-sky-600 dark:text-sky-300" />
        <p className="text-sm font-medium">Loading your tasks...</p>
      </div>
    </main>
  );
}
