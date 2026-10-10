"use client";

import type { ChangeEvent, FormEventHandler } from "react";
import {
  CalendarCheck,
  Check,
  Clock3,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptySchedule } from "@/components/schedule/EmptySchedule";

export type ScheduleEntry = { id: string; title: string; date: string };

type ScheduleAgendaCardProps = {
  selectedDateLabel: string;
  selectedSchedule: ScheduleEntry[];
  newTitle: string;
  onNewTitleChange: (value: string) => void;
  onAdd: FormEventHandler<HTMLFormElement>;
  editingId: string | null;
  editingValue: string;
  onEditingValueChange: (value: string) => void;
  onSave: (id: string) => void;
  onCancelEdit: () => void;
  onEdit: (item: ScheduleEntry) => void;
  onDelete: (id: string) => void;
};

export function ScheduleAgendaCard({
  selectedDateLabel,
  selectedSchedule,
  newTitle,
  onNewTitleChange,
  onAdd,
  editingId,
  editingValue,
  onEditingValueChange,
  onSave,
  onCancelEdit,
  onEdit,
  onDelete,
}: ScheduleAgendaCardProps) {
  return (
    <Card className="rounded-lg border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="gap-4 pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-base font-bold">Agenda</CardTitle>
            <p className="mt-1 wrap-break-word text-sm text-slate-500 dark:text-slate-400">
              {selectedDateLabel}
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            <Clock3 className="size-4" />
            {selectedSchedule.length} item
          </div>
        </div>
        <form onSubmit={onAdd} className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Add schedule..."
            value={newTitle}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onNewTitleChange(event.target.value)
            }
            className="h-10 flex-1"
          />
          <Button type="submit" className="h-10 w-full sm:w-auto">
            <Plus className="size-4" />
            Add
          </Button>
        </form>
      </CardHeader>
      <CardContent>
        {selectedSchedule.length ? (
          <div className="space-y-3">
            {selectedSchedule.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-emerald-200 hover:bg-emerald-50/70 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/20"
              >
                {editingId === item.id ? (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Input
                      value={editingValue}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        onEditingValueChange(event.target.value)
                      }
                      className="h-10 flex-1"
                      autoFocus
                    />
                    <div className="grid grid-cols-2 gap-2 sm:flex">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onSave(item.id)}
                      >
                        <Check className="size-4" />
                        Save
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={onCancelEdit}
                      >
                        <X className="size-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="wrap-break-word text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h2>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <CalendarCheck className="size-3.5" />
                        Important schedule
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:flex">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(item)}
                        className="w-full sm:w-auto"
                      >
                        <Pencil className="size-4" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(item.id)}
                        className="w-full text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200 sm:w-auto"
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <EmptySchedule />
        )}
      </CardContent>
    </Card>
  );
}
