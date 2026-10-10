"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  CalendarDays,
  CheckSquare,
  Clock3,
  type LucideIcon,
} from "lucide-react";
import { auth } from "@/firebase/firebase";
import ModelFirestore from "@/model/model";

export type TaskDate = string | number | Date | { toDate: () => Date };
export type TaskEntry = {
  id: string;
  title: string;
  date: TaskDate;
  complete: boolean;
};
export type TaskScope = "all" | "active" | "complete";
export type TaskMetric = {
  label: string;
  value: number;
  helper: string;
  icon: LucideIcon;
  color: string;
};

const taskModel = new ModelFirestore();

function toDate(value: TaskDate | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "object") {
    const date = value.toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isToday(value: TaskDate) {
  const date = toDate(value);
  return date?.toDateString() === new Date().toDateString();
}

export function isTaskOverdue(task: TaskEntry) {
  const date = toDate(task.date);
  if (!date || task.complete) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
}

export function useTask() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskEntry | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        router.push("/auth/login");
        return;
      }

      try {
        const data = await taskModel.getAllTask();
        setTasks(data as TaskEntry[]);
      } catch (error) {
        console.error("Error while loading tasks:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const activeTasks = useMemo(
    () => tasks.filter((task) => !task.complete),
    [tasks],
  );
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.complete),
    [tasks],
  );
  const todayTasks = useMemo(
    () => tasks.filter((task) => isToday(task.date)),
    [tasks],
  );
  const overdueTasks = useMemo(() => tasks.filter(isTaskOverdue), [tasks]);
  const completionRate = tasks.length
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  const metricCards: TaskMetric[] = [
    {
      label: "Active",
      value: activeTasks.length,
      helper: "tasks in progress",
      icon: CheckSquare,
      color:
        "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300",
    },
    {
      label: "Due Today",
      value: todayTasks.length,
      helper: "scheduled for today",
      icon: CalendarDays,
      color:
        "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300",
    },
    {
      label: "Overdue",
      value: overdueTasks.length,
      helper: "need attention",
      icon: Clock3,
      color:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
    },
  ];

  const resetCreateForm = () => {
    setTitle("");
    setDate(new Date());
  };

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const created = await taskModel.addTask({
        title: title.trim(),
        complete: false,
        date,
      });
      setTasks((previous) => [created as TaskEntry, ...previous]);
      setCreateOpen(false);
      resetCreateForm();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (task: TaskEntry) => {
    setEditingTask(task);
    setEditTitle(task.title || "");
    setEditDate(toDate(task.date) || new Date());
    setEditOpen(true);
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingTask || !editTitle.trim()) return;

    setSubmitting(true);
    try {
      const changes = { title: editTitle.trim(), date: editDate };
      await taskModel.updateTask(editingTask.id, changes);
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingTask.id ? { ...task, ...changes } : task,
        ),
      );
      setEditOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await taskModel.deleteTask(id);
      setTasks((previous) => previous.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const current = tasks.find((task) => task.id === id);
      if (!current) return;
      const complete = !current.complete;
      await taskModel.updateTask(id, { complete });
      setTasks((previous) =>
        previous.map((task) => (task.id === id ? { ...task, complete } : task)),
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleReorder = (items: TaskEntry[], scope: TaskScope) => {
    if (scope === "active") setTasks([...items, ...completedTasks]);
    else if (scope === "complete") setTasks([...activeTasks, ...items]);
    else setTasks(items);
  };

  return {
    tasks,
    activeTasks,
    completedTasks,
    todayTasks,
    overdueTasks,
    completionRate,
    metricCards,
    loading,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    editingTask,
    title,
    setTitle,
    date,
    setDate,
    editTitle,
    setEditTitle,
    editDate,
    setEditDate,
    submitting,
    handleCreateSubmit,
    openEditDialog,
    handleEditSubmit,
    handleDelete,
    handleComplete,
    handleReorder,
  };
}
