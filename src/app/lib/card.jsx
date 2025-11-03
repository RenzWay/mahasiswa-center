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
        <Card className={className}>
            <CardHeader>
                <CardTitle>
                    <h3>
                        {title}
                    </h3>
                </CardTitle>
                <CardContent>{description}</CardContent>
            </CardHeader>
            <CardContent>
                {content}
            </CardContent>
        </Card>
    )
}

export function CardScheduleMini({schedule = []}) {
    const schedDate = (date) => {
        const d = formatDate(date)
        return d.toLocaleString("en-EN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }
    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>{schedule.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{new Date(schedule.date).toLocaleDateString("en-En", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}</p>
            </CardContent>
        </Card>
    )
}

export function CardNoteList({note, onSelect, isSelected, handleDelete}) {
    return (
        <Card
            onClick={() => onSelect(note)}
            className={`
        cursor-pointer transition-all border h-fit
        ${isSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-border hover:shadow-md"}
        dark:hover:shadow-white mb-4
      `}
        >
            <CardHeader className="p-4 pb-1">
                <h4 className=" truncate">
                    {note.title || "Untitled Note"}
                </h4>
                <p className="text-xs text-muted-foreground">{formatDate(note.date)}</p>
            </CardHeader>

            <CardContent className="p-4 pt-2">
                {/* Preview content (max 2 lines) */}
                <div
                    className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2"
                    dangerouslySetInnerHTML={{__html: note.content}}
                />
                {/* Category */}
                {note.category && (
                    <Badge className="text-xs mt-1">{note.category}</Badge>
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

export function CardNoteMini({notes = []}) {
    return (
        <div className="space-y-2">
            <div
                className="flex flex-col p-3 rounded-lg border border-border hover:bg-accent transition-colors mb-4"
            >
                <h4 className="text-sm font-medium truncate">
                    {notes.title || "Untitled Note"}
                </h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <CalendarDays size={12}/>
                    {formatDate(notes.date)}
                </div>
                <p
                    className="text-xs text-muted-foreground mt-1 line-clamp-2"
                    dangerouslySetInnerHTML={{__html: notes.content}}
                />
            </div>
        </div>
    );
}

export function CardTaskReorder({task, onComplete, setTask, onDelete}) {
    return (
        <Reorder.Item value={task} className="mb-3 sm:mb-4">
            <Card
                className={`transition-all w-full ${
                    task.complete
                        ? "border-green-500/50 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 hover:shadow-md"
                }`}
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