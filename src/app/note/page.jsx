"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Folder,
  NotebookPen,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { auth } from "@/firebase/firebase";
import ModelFirestore from "@/model/model";
import { TiptapEditor } from "@/app/lib/tiptap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/app/lib/formatdate";

const Notes = new ModelFirestore();

const categories = ["None", "Study", "Ideas", "Work", "Personal"];

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

function stripHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function EmptyNotes({ onCreate }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-5 text-center dark:border-slate-800 dark:bg-slate-950">
      <NotebookPen className="mb-4 size-10 text-slate-400 dark:text-slate-500" />
      <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
        No notes yet
      </p>
      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
        Create your first note for lecture summaries, ideas, or quick study
        reminders.
      </p>
      <Button onClick={onCreate} className="mt-5">
        <Plus className="size-4" />
        New Note
      </Button>
    </div>
  );
}

export default function NotePage() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        router.push("/auth/login");
        return;
      }

      try {
        const data = await Notes.getAllNotes();
        setNotes(data);
        setSelectedNotes(data[0] || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleTitleChange = useMemo(
    () =>
      debounce(async (id, newTitle) => {
        if (!id) return;
        await Notes.updateNote(id, { title: newTitle });
      }, 600),
    [],
  );

  const handleContentChange = useMemo(
    () =>
      debounce(async (id, html) => {
        if (!id) return;
        await Notes.updateNote(id, { content: html });
      }, 800),
    [],
  );

  const filteredNotes = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return notes;

    return notes.filter((note) => {
      const title = note.title?.toLowerCase() || "";
      const content = stripHtml(note.content).toLowerCase();
      const category = note.category?.toLowerCase() || "";
      return (
        title.includes(keyword) ||
        content.includes(keyword) ||
        category.includes(keyword)
      );
    });
  }, [notes, search]);

  const updateSelectedNote = (patch) => {
    if (!selectedNotes) return;
    const updatedNote = { ...selectedNotes, ...patch };
    setSelectedNotes(updatedNote);
    setNotes((prev) =>
      prev.map((note) => (note.id === updatedNote.id ? updatedNote : note)),
    );
  };

  const handleAddNotes = async () => {
    const newNotes = {
      title: "Untitled Note",
      content: "<p>Write here...</p>",
      date: new Date().toISOString(),
      category: "None",
    };

    const fireNotes = await Notes.addNote(newNotes);
    setNotes((prev) => [fireNotes, ...prev]);
    setSelectedNotes(fireNotes);
  };

  const handleDeleteNote = async (id) => {
    try {
      await Notes.deleteNote(id);
      setNotes((prev) => {
        const nextNotes = prev.filter((note) => note.id !== id);
        if (selectedNotes?.id === id) {
          setSelectedNotes(nextNotes[0] || null);
        }
        return nextNotes;
      });
    } catch (err) {
      console.error("Gagal menghapus note:", err);
    }
  };

  const handleCategoryChange = async (newCategory) => {
    if (!selectedNotes) return;
    updateSelectedNote({ category: newCategory });
    await Notes.updateNote(selectedNotes.id, { category: newCategory });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        Loading notes...
      </main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen bg-slate-50 px-3 py-4 text-slate-950 dark:bg-slate-950 dark:text-slate-50 sm:px-6 sm:py-5 lg:px-8">
      <section className="mx-auto flex h-[calc(100vh-2rem)] max-w-7xl flex-col gap-5 sm:h-[calc(100vh-2.5rem)]">
        <header
          className={` ${selectedNotes ? "hidden lg:block" : "block"} rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-violet-100 bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300">
                <NotebookPen className="size-4" />
                Notes
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Capture what matters
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                Keep lecture summaries, study ideas, and personal reminders in
                one focused workspace.
              </p>
            </div>

            <Button onClick={handleAddNotes} className="w-full md:w-auto">
              <Plus className="size-4" />
              New Note
            </Button>
          </div>
        </header>

        <section className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside
            className={`${selectedNotes ? "hidden lg:flex" : " block"} min-h-0 flex-col rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900`}>
            <div className="border-b border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-950 dark:text-slate-50">
                    Library
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {notes.length} notes saved
                  </p>
                </div>
                <Button
                  onClick={handleAddNotes}
                  size="icon"
                  variant="outline"
                  aria-label="Create note">
                  <Plus className="size-4" />
                </Button>
              </div>

              <div className="relative mt-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search notes..."
                  className="h-10 pl-10"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {filteredNotes.length > 0 ? (
                <div className="space-y-2">
                  {filteredNotes.map((note) => (
                    <button
                      key={note.id}
                      type="button"
                      onClick={() => setSelectedNotes(note)}
                      className={`w-full rounded-lg border p-3 text-left transition-colors ${
                        selectedNotes?.id === note.id
                          ? "border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/40"
                          : "border-slate-200 bg-slate-50 hover:border-violet-200 hover:bg-violet-50/60 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-violet-900 dark:hover:bg-violet-950/20"
                      }`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {note.title || "Untitled Note"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {formatDate(note.date)}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                          {note.category || "None"}
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {stripHtml(note.content) || "No content yet"}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyNotes onCreate={handleAddNotes} />
              )}
            </div>
          </aside>

          <section
            className={`${selectedNotes ? "flex" : "hidden lg:flex"} min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900`}>
            {selectedNotes ? (
              <>
                <div className="border-b border-slate-200 p-3 dark:border-slate-800 sm:p-4">
                  <div className="mb-3 flex items-center justify-between gap-3 lg:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedNotes(null)}>
                      <ArrowLeft className="size-4" />
                      Notes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteNote(selectedNotes.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200">
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                  </div>

                  <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                    <Input
                      type="text"
                      value={selectedNotes.title || ""}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        updateSelectedNote({ title: newTitle });
                        handleTitleChange(selectedNotes.id, newTitle);
                      }}
                      className="h-11 border-transparent bg-slate-50 text-lg font-bold shadow-none focus-visible:border-violet-300 dark:bg-slate-950 dark:focus-visible:border-violet-800 sm:text-xl"
                      placeholder="Note title..."
                    />

                    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex sm:items-center">
                      <Select
                        value={selectedNotes.category || "None"}
                        onValueChange={handleCategoryChange}>
                        <SelectTrigger className="h-11 w-full sm:w-40">
                          <Folder className="size-4 text-slate-400" />
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        onClick={() => handleDeleteNote(selectedNotes.id)}
                        className="hidden text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200 lg:inline-flex">
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  <p className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <FileText className="size-3.5" />
                    Last opened from {formatDate(selectedNotes.date)}
                  </p>
                </div>

                <Card className="min-h-0 flex-1 rounded-none border-0 bg-white py-0 shadow-none dark:bg-slate-900">
                  <CardContent className="h-full p-0">
                    <TiptapEditor
                      key={selectedNotes.id}
                      content={selectedNotes.content}
                      onChange={(html) => {
                        updateSelectedNote({ content: html });
                        handleContentChange(selectedNotes.id, html);
                      }}
                      minHeight="100%"
                      className="h-full"
                    />
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="flex h-full items-center justify-center p-6">
                <EmptyNotes onCreate={handleAddNotes} />
              </div>
            )}
          </section>
        </section>
      </section>
    </motion.main>
  );
}
