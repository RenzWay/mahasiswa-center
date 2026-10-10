"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import type { Timestamp } from "firebase/firestore";
import { CalendarDays, CheckSquare, NotebookPen, type LucideIcon } from "lucide-react";
import { auth } from "@/firebase/firebase";
import ModelFirestore from "@/model/model";

export type DashboardDateValue = string | number | Date | Timestamp;

export type DashboardTask = {
  id: string;
  title: string;
  date: DashboardDateValue;
  complete: boolean;
};

export type DashboardNote = {
  id: string;
  title?: string;
  content?: string;
};

export type DashboardScheduleItem = {
  id: string;
  title: string;
  date: DashboardDateValue;
};

type MetricCard = {
  label: string;
  value: number;
  helper: string;
  icon: LucideIcon;
  color: string;
};

const Model = new ModelFirestore();

export function useDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [notes, setNotes] = useState<DashboardNote[]>([]);
  const [schedule, setSchedule] = useState<DashboardScheduleItem[]>([]);
  const [dateTime, setDateTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        router.push("/auth/login");
        return;
      }

      setUser(currentUser);
      try {
        const [tasksResult, notesResult, scheduleResult] = await Promise.all([
          Model.getAllTask(),
          Model.getAllNotes(),
          Model.getAllSchedule(),
        ]);

        setTasks(tasksResult as DashboardTask[]);
        setNotes(notesResult as DashboardNote[]);
        setSchedule(scheduleResult as DashboardScheduleItem[]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const formattedDate = dateTime.toLocaleString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = dateTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const activeTasks = useMemo(() => tasks.filter((task) => !task.complete), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((task) => task.complete), [tasks]);
  const completionRate = tasks.length > 0
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  const todaySchedule = useMemo(() => {
    const today = new Date().toDateString();
    return schedule.filter((item) => {
      const date = item.date instanceof Date
        ? item.date
        : typeof item.date === "object"
          ? item.date.toDate()
          : new Date(item.date);
      return date.toDateString() === today;
    });
  }, [schedule]);

  const metricCards: MetricCard[] = [
    {
      label: "Active Tasks",
      value: activeTasks.length,
      helper: `${completedTasks.length} completed`,
      icon: CheckSquare,
      color: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/70 dark:bg-sky-950/40 dark:text-sky-300",
    },
    {
      label: "Today Schedule",
      value: todaySchedule.length,
      helper: `${schedule.length} total agenda`,
      icon: CalendarDays,
      color: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    {
      label: "Notes",
      value: notes.length,
      helper: "study archive",
      icon: NotebookPen,
      color: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/70 dark:bg-violet-950/40 dark:text-violet-300",
    },
  ];

  return {
    loading,
    user,
    tasks,
    notes,
    schedule,
    formattedDate,
    formattedTime,
    activeTasks,
    completedTasks,
    completionRate,
    todaySchedule,
    metricCards,
  };
}
