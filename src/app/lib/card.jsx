"use client";

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {CalendarDays, GripVertical, Trash2} from "lucide-react";
import {EditTaskDialog} from "@/app/lib/edit";
import {Checkbox} from "@/components/ui/checkbox";
import {Reorder} from "framer-motion";
import {formatDate} from "@/app/lib/formatdate";

export function CardTaskReorder({task, onComplete, setTask, onDelete}) {
    return (
        <Reorder.Item value={task} className="mb-4">
            <Card
                className={`w-full transition-all ${
                    task.complete
                        ? "border-green-500/50 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 hover:shadow-md"
                }`}
            >
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        {/* Drag Handle - Vertical Center */}
                        <div className="flex items-center">
                            <GripVertical
                                size={24}
                                className="text-gray-400 cursor-grab active:cursor-grabbing"
                            />
                        </div>

                        {/* Checkbox - Vertical Center */}
                        <Checkbox
                            checked={task.complete}
                            onCheckedChange={onComplete}
                            className="h-6 w-6 rounded-md flex-shrink-0"
                        />

                        {/* Content Area */}
                        <div className="flex-1 min-w-0">
                            {/* Title and Badge */}
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <h3
                                    className={`text-base font-medium truncate ${
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

                            {/* Date and Actions */}
                            <div className="flex items-center justify-between gap-4">
                                {/* Date - Left */}
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <CalendarDays size={14}/>
                                    <span>{formatDate(task.date)}</span>
                                </div>

                                {/* Actions - Right */}
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

export function CardTask({id, title, date, complete, onComplete, setTask, onDelete}) {
    return (
        <Card
            className={`w-full p-4 transition-all ${
                complete
                    ? "border-green-500/50 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-300 hover:shadow-md"
            }`}
        >
            <CardHeader>
                <div className="flex items-center gap-4">
                    {/* ✅ Checkbox lebih besar */}
                    <Checkbox
                        checked={complete}
                        onCheckedChange={onComplete}
                        className="h-5 w-5 rounded-md"
                    />

                    <div className="flex-1 flex justify-between items-center">
                        <CardTitle>
                            <h3
                                className={`text-lg font-medium ${
                                    complete ? "line-through text-gray-500" : ""
                                }`}
                            >
                                {title}
                            </h3>
                        </CardTitle>

                        <Badge variant={complete ? "secondary" : "outline"}>
                            {complete ? "Completed" : "Active"}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex items-center gap-2 text-sm text-gray-500 ml-11">
                <CalendarDays size={16}/>
                <span>
                    {formatDate(date)}
                </span>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 pt-2">
                <EditTaskDialog
                    task={{id, title, date, complete}}
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
                    <Trash2 size={16}/>
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
}

export function CardReorder({item}) { // ✅ Terima full object
    return (
        <Reorder.Item value={item}> {/* ✅ Pass item langsung */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>{item.date}</div>
                </CardContent>
            </Card>
        </Reorder.Item>
    );
}