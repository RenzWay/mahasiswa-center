"use client";

import { motion } from "framer-motion";
import { NoteEditor } from "@/components/note/NoteEditor";
import { NoteHeader } from "@/components/note/NoteHeader";
import { NoteLibrary } from "@/components/note/NoteLibrary";
import { NoteLoading } from "@/components/note/NoteLoading";
import { useNote } from "@/hooks/useNote";

export default function NotePage() {
  const {
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
  } = useNote();

  if (loading) return <NoteLoading />;

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen w-full min-w-0 max-w-full overflow-x-hidden bg-slate-50 px-3 py-4 text-slate-950 dark:bg-slate-950 dark:text-slate-50 sm:px-6 sm:py-5 lg:px-8"
    >
      <section className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full min-w-0 max-w-7xl flex-col gap-4 lg:h-[calc(100vh-2.5rem)] lg:min-h-0 lg:gap-5">
        <NoteHeader
          hasSelection={Boolean(selectedNote)}
          onCreate={createNote}
        />
        <section className="grid min-h-[72dvh] min-w-0 flex-1 gap-5 lg:min-h-0 lg:grid-cols-[340px_minmax(0,1fr)]">
          <NoteLibrary
            notes={notes}
            filteredNotes={filteredNotes}
            selectedNote={selectedNote}
            search={search}
            onSearchChange={setSearch}
            onSelect={setSelectedNote}
            onCreate={createNote}
          />
          <NoteEditor
            note={selectedNote}
            onBack={() => setSelectedNote(null)}
            onDelete={deleteNote}
            onTitleChange={changeTitle}
            onCategoryChange={changeCategory}
            onContentChange={changeContent}
            onCreate={createNote}
          />
        </section>
      </section>
    </motion.main>
  );
}
