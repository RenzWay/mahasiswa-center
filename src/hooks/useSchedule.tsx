import { auth } from "@/firebase/firebase";
import ModelFirestore from "@/model/model";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, type FormEvent } from "react";

type ScheduleEntry = {
  id: string;
  title: string;
  date: string;
};

const model = new ModelFirestore();

export function useSchedule() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
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
        const data = await model.getAllSchedule();
        setSchedule(data as ScheduleEntry[]);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTitle.trim() || !date) return;

    const savedSchedule = await model.addSchedule({
      title: newTitle.trim(),
      date: date.toISOString(),
    });
    setSchedule((previous) => [...previous, savedSchedule as ScheduleEntry]);
    setNewTitle("");
  };

  const handleDelete = async (id: string) => {
    await model.deleteSchedule(id);
    setSchedule((previous) => previous.filter((item) => item.id !== id));
  };

  const handleEdit = (item: ScheduleEntry) => {
    setEditingId(item.id);
    setEditingValue(item.title);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const handleSave = async (id: string) => {
    const title = editingValue.trim();
    if (!title) return;

    await model.updateSchedule(id, { title });
    setSchedule((previous) =>
      previous.map((item) => (item.id === id ? { ...item, title } : item)),
    );
    handleCancelEdit();
  };

  const selectedSchedule = useMemo(() => {
    if (!date) return [];
    return schedule.filter(
      (item) => new Date(item.date).toDateString() === date.toDateString(),
    );
  }, [date, schedule]);

  const selectedDateLabel = date.toLocaleDateString("id-ID", {
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

  return {
    date,
    setDate,
    schedule,
    setSchedule,
    newTitle,
    setNewTitle,
    editingId,
    setEditingId,
    editingValue,
    setEditingValue,
    loading,
    setLoading,
    handleAdd,
    handleDelete,
    handleEdit,
    handleCancelEdit,
    handleSave,
    selectedSchedule,
    selectedDateLabel,
    upcomingCount,
  };
}
