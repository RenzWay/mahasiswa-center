"use client";

import type { ChangeEvent } from "react";
import { ArrowLeft, FileText, Folder, Trash2 } from "lucide-react";
import { TiptapEditor } from "@/app/lib/tiptap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyNotes } from "@/components/note/EmptyNotes";
import { formatDate } from "@/app/lib/formatdate";
import type { NoteEntry } from "@/hooks/useNote";

const categories = ["None", "Study", "Ideas", "Work", "Personal"];

type NoteEditorProps = {
  note: NoteEntry | null;
  onBack: () => void;
  onDelete: (id: string) => void;
  onTitleChange: (title: string) => void;
  onCategoryChange: (category: string) => void;
  onContentChange: (html: string) => void;
  onCreate: () => void;
};

export function NoteEditor({
  note,
  onBack,
  onDelete,
  onTitleChange,
  onCategoryChange,
  onContentChange,
  onCreate,
}: NoteEditorProps) {
  return (
    <section
      className={`${note ? "flex" : "hidden lg:flex"} w-full min-w-0 max-w-full min-h-[72dvh] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:min-h-0`}
    >
      {note ? (
        <>
          <div className="border-b border-slate-200 p-3 dark:border-slate-800 sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-3 lg:hidden">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="size-4" />
                Notes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(note.id)}
                className="text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200"
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </div>
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              <Input
                type="text"
                value={note.title || ""}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onTitleChange(event.target.value)
                }
                className="h-11 min-w-0 border-transparent bg-slate-50 text-lg font-bold shadow-none focus-visible:border-violet-300 dark:bg-slate-950 dark:focus-visible:border-violet-800 sm:text-xl"
                placeholder="Note title..."
              />
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex sm:items-center">
                <Select
                  value={note.category || "None"}
                  onValueChange={onCategoryChange}
                >
                  <SelectTrigger className="h-11 w-full sm:w-40">
                    <Folder className="size-4 text-slate-400" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => onDelete(note.id)}
                  className="hidden text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200 lg:inline-flex"
                >
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <FileText className="size-3.5" />
              Last opened from {formatDate(note.date)}
            </p>
          </div>
          <Card className="min-h-0 flex-1 rounded-none border-0 bg-white py-0 shadow-none dark:bg-slate-900">
            <CardContent className="h-full p-0">
              <TiptapEditor
                key={note.id}
                content={note.content}
                onChange={(html: string) => onContentChange(html)}
                minHeight="100%"
                className="h-full"
              />
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="flex h-full items-center justify-center p-6">
          <EmptyNotes onCreate={onCreate} />
        </div>
      )}
    </section>
  );
}
