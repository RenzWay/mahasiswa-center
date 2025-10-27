"use client"
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {useCallback, useEffect, useState} from "react";
import {formatDate} from "@/app/lib/formatdate";
import {TiptapEditor} from "@/app/lib/tiptap";
import {ArrowLeft} from "lucide-react";
import {Input} from "@/components/ui/input";
import ModelFirestore from "@/app/model/model";

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
            content: "",
            date: new Date(),
            category: "Work"
        }
        const fireNotes = await Notes.addNote(newNotes);
        setNotes((prev) => [...prev, fireNotes])
        setSelectedNotes(fireNotes)
    }

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
            <header className="hidden md:flex mx-4 justify-between border-b py-4">
                <h2 className="text-xl font-semibold">Note your day</h2>
                <Button onClick={handleAddNotes}>+ Note</Button>
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
                </header>
            )}

            <section className="flex gap-2 flex-1 overflow-hidden">
                {/* Sidebar - Hide on mobile when note selected */}
                <section
                    className={`${selectedNotes ? 'hidden md:flex md:flex-col' : 'grid md:flex md:flex-col'} grid-cols-2 gap-2 md:gap-0 flex-1 md:border-r border-gray-200 overflow-y-auto p-4`}>
                    {notes.map((note, i) => (
                        <div
                            onClick={() => setSelectedNotes(note)}
                            className={`bg-white dark:bg-gray-950 border rounded-lg p-4 cursor-pointer md:mb-2 hover:shadow-md transition-shadow 
                            ${selectedNotes?.id === note.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} h-fit`}
                            key={i}
                        >
                            <p className="font-semibold mb-1 truncate">{note.title}</p>
                            <p className="text-xs text-gray-500 mb-2">{formatDate(note.date)}</p>
                            <p className="text-sm text-gray-600 line-clamp-2"
                               dangerouslySetInnerHTML={{__html: note.content}}/>
                            <p className="text-xs text-gray-500 mt-2">{note.category}</p>
                        </div>
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
                            <div className="hidden md:block p-4 border-b">
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
                                    className="w-full text-2xl font-bold border-none outline-none"
                                    placeholder="Note title..."
                                />
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
                            <p>Silahkan dipilih dulu</p>
                        </div>
                    )}
                </section>
            </section>
        </motion.section>
    )
}