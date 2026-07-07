"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  CalendarDays,
  Check,
  Clock3,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { auth } from "@/firebase/firebase";
import ModelFirestore from "@/model/model";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Model = new ModelFirestore();

function EmptySchedule() {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 text-center dark:border-slate-800 dark:bg-slate-950">
      <CalendarCheck className="mb-3 size-8 text-slate-400 dark:text-slate-500" />
      <p className="font-semibold text-slate-700 dark:text-slate-200">
        No schedule for this date
      </p>
      <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
        Add a class, deadline, or campus activity to keep this day organized.
      </p>
    </div>
  );
}

export default function SchedulePage() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        router.push("/auth/login");
        return;
      }

      try {
        const data = await Model.getAllSchedule();
        setSchedule(data);
      } catch (err) {
        console.error("Error fetching schedule:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !date) return;

    const newItem = {
      title: newTitle.trim(),
      date: date.toISOString(),
    };

    const savedSchedule = await Model.addSchedule(newItem);
    setSchedule((prev) => [...prev, savedSchedule]);
    setNewTitle("");
  };

  const handleDelete = async (id) => {
    await Model.deleteSchedule(id);
    setSchedule((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditingValue(item.title);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const handleSave = async (id) => {
    const title = editingValue.trim();
    if (!title) return;

    await Model.updateSchedule(id, { title });
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title } : item)),
    );
    handleCancelEdit();
  };

  const selectedSchedule = useMemo(() => {
    if (!date) return [];

    return schedule.filter(
      (item) => new Date(item.date).toDateString() === date.toDateString(),
    );
  }, [date, schedule]);

  const selectedDateLabel = date?.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const upcomingCount = useMemo(() => {
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    return schedule.filter((item) => new Date(item.date) >= startToday).length;
  }, [schedule]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        Loading schedule...
      </main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen bg-slate-50 px-3 py-4 text-slate-950 dark:bg-slate-950 dark:text-slate-50 sm:px-6 sm:py-5 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
                <CalendarDays className="size-4" />
                Schedule
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Plan your academic days
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                Pick a date, add agenda, and keep your class or campus activity
                visible at a glance.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Selected
                </p>
                <p className="mt-1 text-lg font-bold">
                  {selectedSchedule.length}
                </p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Upcoming
                </p>
                <p className="mt-1 text-lg font-bold">{upcomingCount}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <Card className="rounded-lg border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <CalendarDays className="size-4 text-emerald-600 dark:text-emerald-300" />
                Calendar
              </CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose the day you want to organize.
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-md border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(value) => value && setDate(value)}
                  className="mx-auto w-full min-w-[280px] bg-transparent"
                  classNames={{
                    root: "w-full",
                    month: "w-full",
                    table: "w-full border-collapse",
                  }}
                />
              </div>
            </CardContent>
          </Card>

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

              <form
                onSubmit={handleAdd}
                className="flex flex-col gap-2 sm:flex-row">
                <Input
                  placeholder="Add schedule..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-10 flex-1"
                />
                <Button type="submit" className="h-10 w-full sm:w-auto">
                  <Plus className="size-4" />
                  Add
                </Button>
              </form>
            </CardHeader>

            <CardContent>
              {selectedSchedule.length > 0 ? (
                <div className="space-y-3">
                  {selectedSchedule.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-emerald-200 hover:bg-emerald-50/70 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/20">
                      {editingId === item.id ? (
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <Input
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="h-10 flex-1"
                            autoFocus
                          />
                          <div className="grid grid-cols-2 gap-2 sm:flex">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleSave(item.id)}>
                              <Check className="size-4" />
                              Save
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}>
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
                              onClick={() => handleEdit(item)}
                              className="w-full sm:w-auto">
                              <Pencil className="size-4" />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(item.id)}
                              className="w-full text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200 sm:w-auto">
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
        </section>
      </section>
    </motion.main>
  );
}
