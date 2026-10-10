"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import ModelFirestore from "@/model/model";

export type NoteEntry = {
  id: string;
  title?: string;
  content?: string;
  date: string | number | Date;
  category?: string;
};

const notesModel = new ModelFirestore();

export function stripHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function useNote() {
  const router = useRouter();
  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteEntry | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const titleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        router.push("/auth/login");
        return;
      }

      try {
        const data = await notesModel.getAllNotes();
        setNotes(data as NoteEntry[]);
        setSelectedNote(null);
      } catch (error) {
        console.error("Error loading notes:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(
    () => () => {
      if (titleTimer.current) clearTimeout(titleTimer.current);
      if (contentTimer.current) clearTimeout(contentTimer.current);
    },
    [],
  );

  const filteredNotes = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return notes;
    return notes.filter(
      (note) =>
        (note.title || "").toLowerCase().includes(keyword) ||
        stripHtml(note.content).toLowerCase().includes(keyword) ||
        (note.category || "").toLowerCase().includes(keyword),
    );
  }, [notes, search]);

  const updateSelectedNote = (changes: Partial<NoteEntry>) => {
    if (!selectedNote) return;
    const updated = { ...selectedNote, ...changes };
    setSelectedNote(updated);
    setNotes((previous) =>
      previous.map((note) => (note.id === updated.id ? updated : note)),
    );
  };

  const createNote = async () => {
    try {
      const created = (await notesModel.addNote({
        title: "Untitled Note",
        content: "<p>Write here...</p>",
        date: new Date().toISOString(),
        category: "None",
      })) as NoteEntry;
      setNotes((previous) => [created, ...previous]);
      setSelectedNote(created);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await notesModel.deleteNote(id);
      setNotes((previous) => previous.filter((note) => note.id !== id));
      setSelectedNote((current) => (current?.id === id ? null : current));
    } catch (error) {
      console.error("Gagal menghapus note:", error);
    }
  };

  const changeTitle = (title: string) => {
    if (!selectedNote) return;
    const id = selectedNote.id;
    updateSelectedNote({ title });
    if (titleTimer.current) clearTimeout(titleTimer.current);
    titleTimer.current = setTimeout(() => {
      void notesModel
        .updateNote(id, { title })
        .catch((error) => console.error("Error saving note title:", error));
    }, 600);
  };

  const changeContent = (content: string) => {
    if (!selectedNote) return;
    const id = selectedNote.id;
    updateSelectedNote({ content });
    if (contentTimer.current) clearTimeout(contentTimer.current);
    contentTimer.current = setTimeout(() => {
      void notesModel
        .updateNote(id, { content })
        .catch((error) => console.error("Error saving note content:", error));
    }, 800);
  };

  const changeCategory = async (category: string) => {
    if (!selectedNote) return;
    const id = selectedNote.id;
    updateSelectedNote({ category });
    try {
      await notesModel.updateNote(id, { category });
    } catch (error) {
      console.error("Error saving note category:", error);
    }
  };

  return {
    notes,
    filteredNotes,
    selectedNote,
    setSelectedNote,
    search,
    setSearch,
    loading,
    createNote,
    deleteNote,
    changeTitle,
    changeContent,
    changeCategory,
  };
}
