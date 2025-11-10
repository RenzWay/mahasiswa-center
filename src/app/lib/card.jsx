"use client";

import {Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {CalendarDays, GripVertical, Trash2} from "lucide-react";
import {EditTaskDialog} from "@/app/lib/edit";
import {Checkbox} from "@/components/ui/checkbox";
import {Reorder} from "framer-motion";
import {formatDate} from "@/app/lib/formatdate";

export function CardQuickDashboard({title, description, content, className}) {
    return (
        <Card
            className={`shadow-3d hover:shadow-3d-pressed transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 text-slate-800 dark:text-white border border-indigo-200 dark:border-slate-700 ${className}`}
        >
            <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {title}
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    {description}
                </p>
            </CardHeader>
            <CardContent className="pt-0">{content}</CardContent>
        </Card>
    );
}


export function CardScheduleMini({schedule = []}) {
    return (
        <Card
            className="  mb-4 shadow-3d hover:shadow-3d-pressed hover:glow-green hover:-translate-y-1  transition-all duration-300  bg-gradient-to-br from-emerald-50 to-teal-100  dark:from-slate-900 dark:to-stone-900  border border-emerald-200 dark:border-slate-700"
        >
            <CardHeader className="pb-2">
                <CardTitle className="text-slate-700 dark:text-emerald-200 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                    {schedule.title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                    <CalendarDays
                        size={16}
                        className="text-emerald-600 dark:text-emerald-400"
                    />
                    <p>
                        {new Date(schedule.date).toLocaleDateString("en-EN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export function CardNoteMini({notes = []}) {
    return (
        <div className="space-y-2">
            <div
                className="  flex flex-col p-4 rounded-xl border border-indigo-200 dark:border-slate-700  shadow-3d hover:shadow-3d-pressed hover:glow-purple hover:translate-x-1  transition-all duration-300 mb-4  bg-gradient-to-br from-indigo-50 to-purple-100  dark:from-slate-950 dark:to-neutral-950"
            >
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-indigo-100 truncate">
                        {notes.title || "Untitled Note"}
                    </h4>
                    <div className="w-2 h-2 rounded-full bg-purple-500"/>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-2">
                    <CalendarDays
                        size={12}
                        className="text-purple-600 dark:text-purple-400"
                    />
                    {formatDate(notes.date)}
                </div>

                <p
                    className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2"
                    dangerouslySetInnerHTML={{__html: notes.content}}
                />
            </div>
        </div>
    );
}


export function CardNoteList({note, onSelect, isSelected, handleDelete}) {
    return (
        <Card
            onClick={() => onSelect(note)}
            className={`
    cursor-pointer transition-all duration-300 h-fit rounded-xl
    ${isSelected
                ? "border-indigo-400 bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/30 dark:to-slate-900"
                : "border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500/60"}
    mb-4 shadow-sm hover:shadow-lg
  `}
        >

            <CardHeader className="p-4 pb-1">
                <h4 className="truncate font-semibold text-slate-800 dark:text-slate-100">
                    {note.title || "Untitled Note"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(note.date)}
                </p>
            </CardHeader>

            <CardContent className="p-4 pt-2">
                <div
                    className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 mb-2"
                    dangerouslySetInnerHTML={{__html: note.content}}
                />
                {note.category && (
                    <Badge
                        className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 text-xs mt-1">
                        {note.category}
                    </Badge>
                )}
            </CardContent>

            <CardFooter>
                <CardAction>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(note.id);
                        }}
                        variant="destructive"
                    >
                        <Trash2/> Delete
                    </Button>

                </CardAction>
            </CardFooter>
        </Card>
    );
}

export function CardTaskReorder({task, onComplete, setTask, onDelete}) {
    return (
        <Reorder.Item value={task} className="mb-3 sm:mb-4">
            <Card
                className={`transition-all w-full max-w-[1000px] border rounded-2xl ${task.complete ? "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-emerald-900/60 dark:to-green-950 border-emerald-400 dark:border-emerald-700" : "bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/80 dark:to-slate-900/60 border-slate-200 dark:border-slate-700 hover:shadow-lg hover:shadow-slate-200/40 dark:hover:shadow-slate-800/50"}`}
            >

                <CardContent className="p-3 sm:p-4">
                    {/* === MOBILE VIEW (default) === */}
                    <div className="flex flex-col gap-2 sm:hidden">
                        {/* Top Row: Checkbox + Title */}
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={task.complete}
                                onCheckedChange={onComplete}
                                className="h-5 w-5 flex-shrink-0"
                            />
                            <h3
                                className={`text-sm font-medium break-words whitespace-pre-wrap ${
                                    task.complete ? "line-through text-gray-500" : ""
                                }`}
                            >
                                {task.title}
                            </h3>
                        </div>

                        {/* Middle Row: Status + Date */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <Badge
                                variant={task.complete ? "secondary" : "outline"}
                                className="text-[10px] px-2 py-0.5"
                            >
                                {task.complete ? "Complete" : "Active"}
                            </Badge>
                            <div className="flex items-center gap-1">
                                <CalendarDays size={12}/>
                                <span>{formatDate(task.date)}</span>
                            </div>
                        </div>

                        {/* Bottom Row: Actions */}
                        <div className="flex justify-end gap-2 mt-1">
                            <EditTaskDialog
                                task={task}
                                onSave={(taskId, newData) => {
                                    setTask(prev =>
                                        prev.map(t => (t.id === taskId ? {...t, ...newData} : t))
                                    );
                                }}
                            />
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={onDelete}
                                className="text-xs px-2 py-1"
                            >
                                <Trash2 size={12}/>
                                Delete
                            </Button>
                        </div>
                    </div>

                    {/* === DESKTOP VIEW === */}
                    <div className="hidden sm:flex items-center gap-3">
                        <GripVertical
                            size={24}
                            className="text-gray-400 cursor-grab active:cursor-grabbing"
                        />
                        <Checkbox
                            checked={task.complete}
                            onCheckedChange={onComplete}
                            className="h-6 w-6 rounded-md flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                                <h3
                                    className={`text-base font-medium break-words whitespace-pre-wrap ${
                                        task.complete ? "line-through text-gray-500" : ""
                                    }`}
                                >
                                    {task.title}
                                </h3>
                                <Badge
                                    variant={task.complete ? "secondary" : "outline"}
                                    className="flex-shrink-0"
                                >
                                    {task.complete ? "Completed" : "Active"}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <CalendarDays size={14}/>
                                    <span>{formatDate(task.date)}</span>
                                </div>
                                <div className="flex gap-2">
                                    <EditTaskDialog
                                        task={task}
                                        onSave={(taskId, newData) => {
                                            setTask(prev =>
                                                prev.map(t => (t.id === taskId ? {...t, ...newData} : t))
                                            );
                                        }}
                                    />
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={onDelete}
                                        className="flex items-center gap-1"
                                    >
                                        <Trash2 size={14}/>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Reorder.Item>
    );
}