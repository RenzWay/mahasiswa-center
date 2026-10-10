"use client";

import { motion } from "framer-motion";
import { TaskDialog } from "@/components/task/TaskDialog";
import { TaskHeader } from "@/components/task/TaskHeader";
import { TaskLoading } from "@/components/task/TaskLoading";
import { TaskMetrics } from "@/components/task/TaskMetrics";
import { TaskProgress } from "@/components/task/TaskProgress";
import { TaskList } from "@/components/task/TaskList";
import { useTask } from "@/hooks/useTask";

export default function TaskPage() {
  const {
    tasks,
    activeTasks,
    completedTasks,
    todayTasks,
    completionRate,
    metricCards,
    loading,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
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
  } = useTask();

  if (loading) return <TaskLoading />;

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen bg-slate-50 px-3 py-4 text-slate-950 dark:bg-slate-950 dark:text-slate-50 sm:px-6 sm:py-5 lg:px-8"
    >
      <section className="mx-auto max-w-7xl space-y-6">
        <TaskHeader onCreate={() => setCreateOpen(true)} />
        <TaskMetrics cards={metricCards} />
        <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <TaskProgress
            completionRate={completionRate}
            nextTask={activeTasks[0]?.title}
            todayCount={todayTasks.length}
          />
          <TaskList
            tasks={tasks}
            activeTasks={activeTasks}
            completedTasks={completedTasks}
            onCreate={() => setCreateOpen(true)}
            onComplete={handleComplete}
            onEdit={openEditDialog}
            onDelete={handleDelete}
            onReorder={handleReorder}
          />
        </section>
      </section>
      <TaskDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        title={title}
        setTitle={setTitle}
        setDate={setDate}
        submitting={submitting}
        onSubmit={handleCreateSubmit}
      />
      <TaskDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        title={editTitle}
        setTitle={setEditTitle}
        setDate={setEditDate}
        submitting={submitting}
        onSubmit={handleEditSubmit}
      />
    </motion.main>
  );
}
