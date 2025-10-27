"use client"
import React, {useState} from 'react';
import {Calendar, Edit, Plus, Search, StickyNote, Trash2} from 'lucide-react';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';

export default function TestPage() {
    const [notes, setNotes] = useState([
        {
            id: 1,
            title: "Meeting Notes",
            content: "Discussed project timeline and deliverables. Need to follow up with team about the design mockups.",
            date: new Date('2025-10-25'),
            category: "Work"
        },
        {
            id: 2,
            title: "Grocery List",
            content: "Milk, Eggs, Bread, Chicken, Vegetables, Fruits, Coffee beans",
            date: new Date('2025-10-26'),
            category: "Personal"
        },
        {
            id: 3,
            title: "Book Ideas",
            content: "Story about a programmer who discovers their code is actually magic spells. Each bug fix changes reality.",
            date: new Date('2025-10-24'),
            category: "Creative"
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNote, setSelectedNote] = useState(null);

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (date) => {
        const options = {year: 'numeric', month: 'short', day: 'numeric'};
        return new Date(date).toLocaleDateString('en-US', options);
    };

    const handleDelete = (id) => {
        setNotes(notes.filter(note => note.id !== id));
        if (selectedNote?.id === id) setSelectedNote(null);
    };

    const handleCreateNew = () => {
        const newNote = {
            id: Date.now(),
            title: "Untitled Note",
            content: "",
            date: new Date(),
            category: "Personal"
        };
        setNotes([newNote, ...notes]);
        setSelectedNote(newNote);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar - Notes List */}
            <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <StickyNote className="text-blue-500"/>
                            Notes
                        </h1>
                        <Button onClick={handleCreateNew} size="sm" className="gap-1">
                            <Plus size={16}/>
                            New
                        </Button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18}/>
                        <Input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Notes List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredNotes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <StickyNote size={48} className="mb-2"/>
                            <p>No notes found</p>
                        </div>
                    ) : (
                        <div className="p-2">
                            {filteredNotes.map(note => (
                                <Card
                                    key={note.id}
                                    className={`mb-2 cursor-pointer transition-all hover:shadow-md ${
                                        selectedNote?.id === note.id ? 'border-blue-500 bg-blue-50' : ''
                                    }`}
                                    onClick={() => setSelectedNote(note)}
                                >
                                    <CardContent className="p-3">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="font-semibold text-sm line-clamp-1">{note.title}</h3>
                                            <Badge variant="outline" className="text-xs flex-shrink-0">
                                                {note.category}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                            {note.content || "No content"}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Calendar size={12}/>
                                                <span>{formatDate(note.date)}</span>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(note.id);
                                                }}
                                                className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                                            >
                                                <Trash2 size={14}/>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Stats */}
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <p className="text-xs text-gray-500 text-center">
                        {notes.length} {notes.length === 1 ? 'note' : 'notes'} total
                    </p>
                </div>
            </div>

            {/* Main Content - Note Editor */}
            <div className="flex-1 flex flex-col">
                {selectedNote ? (
                    <>
                        {/* Editor Header */}
                        <div className="p-6 border-b border-gray-200 bg-white">
                            <Input
                                type="text"
                                value={selectedNote.title}
                                onChange={(e) => {
                                    const updated = notes.map(n =>
                                        n.id === selectedNote.id ? {...n, title: e.target.value} : n
                                    );
                                    setNotes(updated);
                                    setSelectedNote({...selectedNote, title: e.target.value});
                                }}
                                className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 p-0"
                                placeholder="Note title..."
                            />
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Calendar size={14}/>
                                    <span>{formatDate(selectedNote.date)}</span>
                                </div>
                                <Badge variant="outline">{selectedNote.category}</Badge>
                            </div>
                        </div>

                        {/* Editor Content */}
                        <div className="flex-1 p-6 overflow-y-auto">
              <textarea
                  value={selectedNote.content}
                  onChange={(e) => {
                      const updated = notes.map(n =>
                          n.id === selectedNote.id ? {...n, content: e.target.value} : n
                      );
                      setNotes(updated);
                      setSelectedNote({...selectedNote, content: e.target.value});
                  }}
                  className="w-full h-full resize-none border-none focus:outline-none text-gray-700"
                  placeholder="Start writing your note..."
              />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <Edit size={64} className="mb-4"/>
                        <h2 className="text-xl font-semibold mb-2">No Note Selected</h2>
                        <p className="text-sm">Select a note from the list or create a new one</p>
                    </div>
                )}
            </div>
        </div>
    );
}