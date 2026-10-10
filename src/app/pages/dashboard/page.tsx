"use client";

import { motion } from "framer-motion";
import { HeaderHome } from "@/components/dashboard/HeaderDashboard";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { TodayFocus } from "@/components/dashboard/TodayFocus";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { ScheduleToday } from "@/components/dashboard/ScheduleToday";
import { RecentNotes } from "@/components/dashboard/RecentNotes";
import { LoadingDashboard } from "@/app/lib/loading";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const {
    loading,
    user,
    tasks,
    notes,
    formattedDate,
    formattedTime,
    activeTasks,
    completionRate,
    todaySchedule,
    metricCards,
  } = useDashboard();

  if (loading) return <LoadingDashboard />;

  if (!user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center text-slate-600 dark:text-slate-300">
        Redirecting to login...
      </main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen w-full min-w-0 max-w-full overflow-x-hidden bg-slate-50 px-2 py-3 text-slate-950 dark:bg-slate-950 dark:text-slate-50 sm:px-6 sm:py-5 lg:px-8"
    >
      <section className="mx-auto w-full min-w-0 max-w-7xl space-y-4 sm:space-y-6">
        <HeaderHome
          user={user}
          formattedDate={formattedDate}
          formattedTime={formattedTime}
        />
        <DashboardMetrics cards={metricCards} />
        <section className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <TodayFocus
            completionRate={completionRate}
            nextTask={activeTasks[0]}
            nextAgenda={todaySchedule[0]}
          />
          <UpcomingTasks tasks={tasks} activeCount={activeTasks.length} />
        </section>
        <section className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-2">
          <ScheduleToday items={todaySchedule} />
          <RecentNotes notes={notes} />
        </section>
      </section>
    </motion.main>
  );
}
