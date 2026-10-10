import { NotebookPen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NoteHeader({
  hasSelection,
  onCreate,
}: {
  hasSelection: boolean;
  onCreate: () => void;
}) {
  return (
    <header
      className={`${hasSelection ? "hidden lg:block" : "block"} w-full min-w-0 max-w-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 max-w-full">
          <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-violet-100 bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300 sm:mb-3">
            <NotebookPen className="size-4" />
            Notes
          </div>
          <h1 className="wrap-break-word text-xl font-bold tracking-tight sm:text-3xl">
            Capture what matters
          </h1>
          <p className="mt-2 hidden max-w-2xl wrap-break-word text-sm leading-6 text-slate-600 dark:text-slate-400 sm:block">
            Keep lecture summaries, study ideas, and personal reminders in one
            focused workspace.
          </p>
        </div>
        <Button onClick={onCreate} className="w-full md:w-auto">
          <Plus className="size-4" />
          New Note
        </Button>
      </div>
    </header>
  );
}
