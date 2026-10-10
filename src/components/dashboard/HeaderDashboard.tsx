"use client";

import type { User } from "firebase/auth";
import Link from "next/link";
import { Clock3, LayoutDashboard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeaderHomeProps = {
  user: Pick<User, "displayName" | "email">;
  formattedDate: string;
  formattedTime: string;
};

export function HeaderHome({
  user,
  formattedDate,
  formattedTime,
}: HeaderHomeProps) {
  return (
    <header className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-4 p-3 sm:p-5 md:grid-cols-[minmax(0,1fr)_auto] md:p-6">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-sky-100 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300 sm:text-sm">
            <LayoutDashboard className="size-4" />
            Dashboard
          </div>
          <h1 className="wrap-break-word text-xl font-bold tracking-tight sm:text-3xl">
            Selamat datang, {user.displayName || user.email}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Lihat tugas yang aktif, agenda hari ini, dan catatan terbaru tanpa
            pindah halaman dulu.
          </p>
        </div>
        <div className="flex min-w-0 flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 sm:p-4 md:w-72">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <Clock3 className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="wrap-break-word text-sm font-medium text-slate-500 dark:text-slate-400">
                {formattedDate}
              </p>
              <p className="text-2xl font-bold tabular-nums">{formattedTime}</p>
            </div>
          </div>
          <Button asChild className="h-9">
            <Link href="/task">
              <Plus className="size-4" />
              Add Task
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
