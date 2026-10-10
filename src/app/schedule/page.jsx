"use client";

import { motion } from "framer-motion";
import { ScheduleHeader } from "@/components/schedule/ScheduleHeader";
import { ScheduleCalendarCard } from "@/components/schedule/ScheduleCalendarCard";
import { ScheduleAgendaCard } from "@/components/schedule/ScheduleAgendaCard";
import { ScheduleLoading } from "@/components/schedule/ScheduleLoading";
import { useSchedule } from "@/hooks/useSchedule";

export default function SchedulePage() {
  const {
    loading,
    selectedSchedule,
    upcomingCount,
    date,
    setDate,
    newTitle,
    setNewTitle,
    editingId,
    editingValue,
    setEditingValue,
    handleAdd,
    handleDelete,
    handleEdit,
    handleCancelEdit,
    handleSave,
    selectedDateLabel,
  } = useSchedule();

  if (loading) return <ScheduleLoading />;

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen bg-slate-50 px-3 py-4 text-slate-950 dark:bg-slate-950 dark:text-slate-50 sm:px-6 sm:py-5 lg:px-8"
    >
      <section className="mx-auto max-w-7xl space-y-6">
        <ScheduleHeader
          selectedCount={selectedSchedule.length}
          upcomingCount={upcomingCount}
        />
        <section className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <ScheduleCalendarCard date={date} onDateChange={setDate} />
          <ScheduleAgendaCard
            selectedDateLabel={selectedDateLabel}
            selectedSchedule={selectedSchedule}
            newTitle={newTitle}
            onNewTitleChange={setNewTitle}
            onAdd={handleAdd}
            editingId={editingId}
            editingValue={editingValue}
            onEditingValueChange={setEditingValue}
            onSave={handleSave}
            onCancelEdit={handleCancelEdit}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </section>
    </motion.main>
  );
}
