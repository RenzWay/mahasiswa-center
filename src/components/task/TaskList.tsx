"use client";

import { Reorder } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileX,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/app/lib/formatdate";
import { isTaskOverdue, type TaskEntry, type TaskScope } from "@/hooks/useTask";

type TaskListProps = {
  tasks: TaskEntry[];
  activeTasks: TaskEntry[];
  completedTasks: TaskEntry[];
  onCreate: () => void;
  onComplete: (id: string) => void;
  onEdit: (task: TaskEntry) => void;
  onDelete: (id: string) => void;
  onReorder: (items: TaskEntry[], scope: TaskScope) => void;
};

export function TaskList({
  tasks,
  activeTasks,
  completedTasks,
  onCreate,
  onComplete,
  onEdit,
  onDelete,
  onReorder,
}: TaskListProps) {
  return (
    <Card className="rounded-lg border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="gap-4">
        <div>
          <CardTitle className="text-base font-bold">Task List</CardTitle>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Drag to reorder locally, check off what is done.
          </p>
        </div>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-3 rounded-md bg-slate-100 p-1 dark:bg-slate-950">
            <TabsTrigger value="all" className="rounded-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="active" className="rounded-sm">
              Active
            </TabsTrigger>
            <TabsTrigger value="complete" className="rounded-sm">
              Done
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <TaskItems
              items={tasks}
              scope="all"
              emptyTitle="No task yet"
              emptyDescription="Add your first assignment or daily focus item."
              onCreate={onCreate}
              onReorder={onReorder}
              onComplete={onComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            <TaskItems
              items={activeTasks}
              scope="active"
              emptyTitle="No active task"
              emptyDescription="Everything is clear for now. Add a new task when something comes up."
              onCreate={onCreate}
              onReorder={onReorder}
              onComplete={onComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </TabsContent>
          <TabsContent value="complete" className="mt-4">
            <TaskItems
              items={completedTasks}
              scope="complete"
              emptyTitle="No completed task"
              emptyDescription="Complete a task and it will show up here."
              onCreate={onCreate}
              onReorder={onReorder}
              onComplete={onComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
}

type TaskItemsProps = {
  items: TaskEntry[];
  scope: TaskScope;
  emptyTitle: string;
  emptyDescription: string;
  onCreate: () => void;
  onReorder: (items: TaskEntry[], scope: TaskScope) => void;
  onComplete: (id: string) => void;
  onEdit: (task: TaskEntry) => void;
  onDelete: (id: string) => void;
};

function TaskItems({
  items,
  scope,
  emptyTitle,
  emptyDescription,
  onCreate,
  onReorder,
  onComplete,
  onEdit,
  onDelete,
}: TaskItemsProps) {
  if (!items.length)
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-5 text-center dark:border-slate-800 dark:bg-slate-950">
        <FileX className="mb-4 size-10 text-slate-400 dark:text-slate-500" />
        <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
          {emptyTitle}
        </p>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
          {emptyDescription}
        </p>
        <Button onClick={onCreate} className="mt-5">
          <Plus className="size-4" />
          Add Task
        </Button>
      </div>
    );

  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={(newOrder: TaskEntry[]) => onReorder(newOrder, scope)}
      className="space-y-3"
    >
      {items.map((task) => (
        <Reorder.Item key={task.id} value={task} className="list-none">
          <TaskCard
            task={task}
            onComplete={() => onComplete(task.id)}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.id)}
          />
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}

function TaskCard({
  task,
  onComplete,
  onEdit,
  onDelete,
}: {
  task: TaskEntry;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const overdue = isTaskOverdue(task);
  return (
    <article
      className={`rounded-lg border p-4 shadow-sm transition-colors ${task.complete ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/70 dark:bg-emerald-950/30" : overdue ? "border-red-200 bg-red-50 dark:border-red-900/70 dark:bg-red-950/30" : "border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-900 dark:hover:bg-sky-950/20"}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <Checkbox
            checked={task.complete}
            onCheckedChange={onComplete}
            className="mt-1 size-5 shrink-0"
          />
          <div className="min-w-0">
            <h3
              className={`wrap-break-word text-sm font-semibold sm:text-base ${task.complete ? "text-emerald-800 line-through dark:text-emerald-200" : "text-slate-900 dark:text-slate-100"}`}
            >
              {task.title}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 dark:border-slate-800 dark:bg-slate-950">
                <CalendarDays className="size-3.5" />
                {formatDate(task.date)}
              </span>
              {task.complete && (
                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-100 px-2 py-1 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle2 className="size-3.5" />
                  Completed
                </span>
              )}
              {overdue && (
                <span className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-100 px-2 py-1 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                  <Clock3 className="size-3.5" />
                  Overdue
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="w-full sm:w-auto"
          >
            <Pencil className="size-4" />
            Edit
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onDelete}
            className="w-full text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200 sm:w-auto"
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}
