"use client"
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {useCallback, useEffect, useState} from "react";
import {TiptapEditor} from "@/app/lib/tiptap";
import {ArrowLeft} from "lucide-react";
import {Input} from "@/components/ui/input";
import ModelFirestore from "@/model/model";
import {CardNoteList} from "@/app/lib/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const Notes = new ModelFirestore();

function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

export default function NotePage() {
    const [notes, setNotes] = useState([])
    const [selectedNotes, setSelectedNotes] = useState(null)

    useEffect(() => {
        const getNote = async () => {
            try {
                const data = await Notes.getAllNotes()
                setNotes(data)
            } catch (error) {
                console.error(error)
            }
        }
        getNote()
    }, []);

    const handleTitleChange = useCallback(debounce(async (id, newTitle) => {
        if (!id) return;
        await Notes.updateNote(id, {title: newTitle});
    }, 600), []);

    const handleContentChange = useCallback(debounce(async (id, html) => {
        if (!id) return;
        await Notes.updateNote(id, {content: html});
    }, 800), []);


    const handleAddNotes = async () => {
        const newNotes = {
            title: "Untitled Notes",
            content: "Write here...",
            date: new Date(),
            category: "None"
        }
        const fireNotes = await Notes.addNote(newNotes);
        setNotes((prev) => [...prev, fireNotes])
        setSelectedNotes(fireNotes)
    }

    const handleDeleteNote = async (id) => {
        try {
            await Notes.deleteNote(id);
            setNotes(prev => prev.filter(n => n.id !== id));
            if (selectedNotes?.id === id) setSelectedNotes(null);
        } catch (err) {
            console.error("Gagal menghapus note:", err);
        }
    };


    return (
        <motion.section
            initial={{y: -100, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            exit={{y: -100, opacity: 0}}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.6
            }}
            className="h-screen flex flex-col">

            {/* Header - Desktop only */}
            <header
                className="
    hidden md:flex items-center justify-between
    mx-4 mt-2 mb-3 px-6 py-4
    rounded-2xl border border-white/20
    bg-gradient-to-r from-blue-100/70 via-indigo-100/70 to-purple-100/70
    dark:from-slate-800/60 dark:via-slate-900/60 dark:to-gray-800/60
    backdrop-blur-md shadow-md
    transition-all duration-300
  "
            >
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text">
                        📝 Note your day
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Write. Organize. Remember everything.
                    </p>
                </div>

                <Button
                    onClick={handleAddNotes}
                    className="  bg-gradient-to-r from-blue-500 to-indigo-500 text-white  hover:from-indigo-500 hover:to-blue-500  shadow-md hover:shadow-lg transition-all"
                >
                    + New Note
                </Button>
            </header>


            {/* Mobile Header - Show in list view */}
            {!selectedNotes && (
                <header className="md:hidden flex mx-4 justify-between border-b py-4">
                    <h2 className="text-xl font-semibold">Note your day (mobile)</h2>
                    <Button onClick={handleAddNotes} size="sm">+ Note</Button>
                </header>
            )}

            {/* Mobile Back Button - Show in editor view */}
            {selectedNotes && (
                <header className="md:hidden flex items-center gap-2 mx-4 border-b py-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedNotes(null)}
                        className="flex items-center gap-1"
                    >
                        <ArrowLeft size={16}/>
                        Back
                    </Button>
                    <Input onChange={(e) => {
                        const newTitle = e.target.value;
                        const updated = notes.map(n =>
                            n.id === selectedNotes.id ? {...n, title: newTitle} : n
                        );
                        setNotes(updated);
                        setSelectedNotes({...selectedNotes, title: newTitle});
                        handleTitleChange(selectedNotes.id, newTitle);
                    }}
                           value={selectedNotes.title}/>

                    <Select
                        value={selectedNotes.category || ""}
                        onValueChange={async (newCategory) => {
                            const updatedNote = {...selectedNotes, category: newCategory};
                            setSelectedNotes(updatedNote);
                            setNotes(notes.map(n => n.id === selectedNotes.id ? updatedNote : n));
                            await Notes.updateNote(selectedNotes.id, {category: newCategory});
                        }}
                    >
                        <SelectTrigger className="w-[130px] text-sm">
                            <SelectValue placeholder="No category"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="None">No category</SelectItem>
                            <SelectItem value="Work">Work</SelectItem>
                            <SelectItem value="Personal">Personal</SelectItem>
                            <SelectItem value="Study">Study</SelectItem>
                            <SelectItem value="Ideas">Ideas</SelectItem>
                        </SelectContent>
                    </Select>
                </header>
            )}

            <section className="flex gap-2 flex-2 overflow-hidden">
                {/* Sidebar - Hide on mobile when note selected */}
                <section
                    className={`${selectedNotes ? 'hidden md:flex md:flex-col' : 'grid md:flex md:flex-col'} gap-2 md:gap-0 flex-1 md:border-r border-gray-200 overflow-y-auto p-4`}>
                    {notes.map((note, i) => (
                        <CardNoteList
                            key={i}
                            note={note}
                            onSelect={setSelectedNotes}
                            isSelected={selectedNotes?.id === note.id}
                            handleDelete={handleDeleteNote}
                        />

                    ))}
                </section>

                {/* Editor - Show on mobile when note selected, always show on desktop */}
                <section className={`
                    ${selectedNotes ? 'flex' : 'hidden md:flex'}
                    flex-[2] flex-col overflow-hidden
                `}>
                    {selectedNotes ? (
                        <div className="flex flex-col h-full">
                            {/* Title Input - Desktop only (mobile ada di header) */}
                            <div className="hidden md:flex items-center gap-3 p-4 border-b">
                                <input
                                    type="text"
                                    value={selectedNotes.title}
                                    onChange={(e) => {
                                        const newTitle = e.target.value;
                                        const updated = notes.map(n =>
                                            n.id === selectedNotes.id ? {...n, title: newTitle} : n
                                        );
                                        setNotes(updated);
                                        setSelectedNotes({...selectedNotes, title: newTitle});
                                        handleTitleChange(selectedNotes.id, newTitle);
                                    }}
                                    className="flex-1 text-2xl font-bold border-none outline-none bg-transparent"
                                    placeholder="Note title..."
                                />

                                <Select
                                    value={selectedNotes.category || ""}
                                    onValueChange={async (newCategory) => {
                                        const updatedNote = {...selectedNotes, category: newCategory};
                                        setSelectedNotes(updatedNote);
                                        setNotes(notes.map(n => n.id === selectedNotes.id ? updatedNote : n));
                                        await Notes.updateNote(selectedNotes.id, {category: newCategory});
                                    }}
                                >
                                    <SelectTrigger className="w-[130px] text-sm">
                                        <SelectValue placeholder="No category"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="None">No category</SelectItem>
                                        <SelectItem value="Work">Work</SelectItem>
                                        <SelectItem value="Personal">Personal</SelectItem>
                                        <SelectItem value="Study">Study</SelectItem>
                                        <SelectItem value="Ideas">Ideas</SelectItem>
                                    </SelectContent>
                                </Select>

                            </div>

                            {/* Editor */}
                            <div className="flex-1 overflow-hidden">
                                <TiptapEditor
                                    key={selectedNotes.id}
                                    content={selectedNotes.content}
                                    onChange={(html) => {
                                        const updatedNotes = notes.map(n =>
                                            n.id === selectedNotes.id ? {...n, content: html} : n
                                        );
                                        setNotes(updatedNotes);
                                        setSelectedNotes({...selectedNotes, content: html});
                                        handleContentChange(selectedNotes.id, html);
                                    }}
                                    minHeight="100%"
                                    className="h-full"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <p>Please choose your note first to see</p>
                        </div>
                    )}
                </section>
            </section>
        </motion.section>
    )
}