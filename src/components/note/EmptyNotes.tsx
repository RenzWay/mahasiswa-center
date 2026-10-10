import { NotebookPen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyNotes({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-5 text-center dark:border-slate-800 dark:bg-slate-950">
      <NotebookPen className="mb-4 size-10 text-slate-400 dark:text-slate-500" />
      <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
        No note selected
      </p>
      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
        Choose a note from your library, or create one for lecture summaries,
        ideas, and reminders.
      </p>
      <Button onClick={onCreate} className="mt-5">
        <Plus className="size-4" />
        New Note
      </Button>
    </div>
  );
}
