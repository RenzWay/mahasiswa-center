"use client";

import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {onAuthStateChanged} from "firebase/auth";
import {motion, Reorder} from "framer-motion";
import {
    CalendarDays,
    CheckCircle2,
    CheckSquare,
    Clock3,
    FileX,
    Loader2,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";
import {auth} from "@/firebase/firebase";
import ModelFirestore from "@/model/model";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Calendar28} from "@/app/lib/Calendar28";
import {formatDate} from "@/app/lib/formatdate";

const Task = new ModelFirestore();

function toDate(value) {
    if (!value) return null;
    if (typeof value.toDate === "function") return value.toDate();
    if (value instanceof Date) return value;

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function isToday(value) {
    const date = toDate(value);
    if (!date) return false;
    return date.toDateString() === new Date().toDateString();
}

function isOverdue(task) {
    const date = toDate(task.date);
    if (!date || task.complete) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
}

function EmptyTasks({title, description, onCreate}) {
    return (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-5 text-center dark:border-slate-800 dark:bg-slate-950">
            <FileX className="mb-4 size-10 text-slate-400 dark:text-slate-500"/>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                {description}
            </p>
            <Button onClick={onCreate} className="mt-5">
                <Plus className="size-4"/>
                Add Task
            </Button>
        </div>
    );
}

function TaskDialog({
    open,
    onOpenChange,
    mode,
    title,
    setTitle,
    setDate,
    submitting,
    onSubmit,
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Edit task" : "Create task"}</DialogTitle>
                    <DialogDescription>
                        {mode === "edit"
                            ? "Update the task title or due date."
                            : "Add one clear thing you want to finish."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor={`${mode}-task-title`}>Task title</Label>
                        <Input
                            id={`${mode}-task-title`}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Example: Finish database assignment"
                            className="h-11"
                            autoFocus
                        />
                    </div>

                    <Calendar28 setDate={setDate} title="Due date"/>

                    <Button type="submit" disabled={submitting || !title.trim()} className="h-11 w-full">
                        {submitting ? <Loader2 className="size-4 animate-spin"/> : null}
                        {mode === "edit" ? "Save Changes" : "Save Task"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function TaskCard({task, onComplete, onEdit, onDelete}) {
    const overdue = isOverdue(task);

    return (
        <Reorder.Item value={task} className="list-none">
            <article
                className={`rounded-lg border p-4 shadow-sm transition-colors ${
                    task.complete
                        ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/70 dark:bg-emerald-950/30"
                        : overdue
                            ? "border-red-200 bg-red-50 dark:border-red-900/70 dark:bg-red-950/30"
                            : "border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-900 dark:hover:bg-sky-950/20"
                }`}
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-3">
                        <Checkbox
                            checked={task.complete}
                            onCheckedChange={onComplete}
                            className="mt-1 size-5 shrink-0"
                        />
                        <div className="min-w-0">
                            <h2
                                className={`break-words text-sm font-semibold sm:text-base ${
                                    task.complete
                                        ? "text-emerald-800 line-through dark:text-emerald-200"
                                        : "text-slate-900 dark:text-slate-100"
                                }`}
                            >
                                {task.title}
                            </h2>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 dark:border-slate-800 dark:bg-slate-950">
                                    <CalendarDays className="size-3.5"/>
                                    {formatDate(task.date)}
                                </span>
                                {task.complete && (
                                    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-100 px-2 py-1 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                                        <CheckCircle2 className="size-3.5"/>
                                        Completed
                                    </span>
                                )}
                                {overdue && (
                                    <span className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-100 px-2 py-1 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                                        <Clock3 className="size-3.5"/>
                                        Overdue
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
                        <Button type="button" size="sm" variant="outline" onClick={onEdit} className="w-full sm:w-auto">
                            <Pencil className="size-4"/>
                            Edit
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={onDelete}
                            className="w-full text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200 sm:w-auto"
                        >
                            <Trash2 className="size-4"/>
                            Delete
                        </Button>
                    </div>
                </div>
            </article>
        </Reorder.Item>
    );
}

export default function TaskPage() {
    const router = useRouter();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(new Date());
    const [editTitle, setEditTitle] = useState("");
    const [editDate, setEditDate] = useState(new Date());
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                setLoading(false);
                router.push("/auth/login");
                return;
            }

            try {
                const data = await Task.getAllTask();
                setTasks(data);
            } catch (e) {
                console.error("Error while loading tasks: ", e);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    const activeTasks = useMemo(() => tasks.filter((item) => !item.complete), [tasks]);
    const completedTasks = useMemo(() => tasks.filter((item) => item.complete), [tasks]);
    const todayTasks = useMemo(() => tasks.filter((item) => isToday(item.date)), [tasks]);
    const overdueTasks = useMemo(() => tasks.filter((item) => isOverdue(item)), [tasks]);
    const completionRate = tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

    const metricCards = [
        {
            label: "Active",
            value: activeTasks.length,
            helper: "tasks in progress",
            icon: CheckSquare,
            color: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300",
        },
        {
            label: "Due Today",
            value: todayTasks.length,
            helper: "scheduled for today",
            icon: CalendarDays,
            color: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300",
        },
        {
            label: "Overdue",
            value: overdueTasks.length,
            helper: "need attention",
            icon: Clock3,
            color: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
        },
    ];

    const resetCreateForm = () => {
        setTitle("");
        setDate(new Date());
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!title.trim()) return;

        setSubmitting(true);
        try {
            const taskData = {
                title: title.trim(),
                complete: false,
                date,
            };

            const newTask = await Task.addTask(taskData);
            setTasks((prev) => [newTask, ...prev]);
            setOpen(false);
            resetCreateForm();
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    const openEditDialog = (task) => {
        setEditingTask(task);
        setEditTitle(task.title || "");
        setEditDate(toDate(task.date) || new Date());
        setEditOpen(true);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        if (!editingTask || !editTitle.trim()) return;

        setSubmitting(true);
        try {
            const payload = {
                title: editTitle.trim(),
                date: editDate,
            };

            await Task.updateTask(editingTask.id, payload);
            setTasks((prev) =>
                prev.map((item) => (item.id === editingTask.id ? {...item, ...payload} : item)),
            );
            setEditOpen(false);
            setEditingTask(null);
        } catch (e) {
            console.error("Error updating task:", e);
        } finally {
            setSubmitting(false);
        }
    };

    async function handleDelete(id) {
        try {
            await Task.deleteTask(id);
            setTasks((prev) => prev.filter((item) => item.id !== id));
        } catch (e) {
            console.error(e);
        }
    }

    const handleComplete = async (id) => {
        try {
            const current = tasks.find((item) => item.id === id);
            if (!current) return;

            const newStatus = !current.complete;
            await Task.updateTask(id, {complete: newStatus});
            setTasks((prev) =>
                prev.map((item) => (item.id === id ? {...item, complete: newStatus} : item)),
            );
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleReorder = (items, scope) => {
        if (scope === "active") {
            setTasks([...items, ...completedTasks]);
            return;
        }

        if (scope === "complete") {
            setTasks([...activeTasks, ...items]);
            return;
        }

        setTasks(items);
    };

    const renderTaskList = (items, scope, emptyTitle, emptyDescription) => {
        if (items.length === 0) {
            return <EmptyTasks title={emptyTitle} description={emptyDescription} onCreate={() => setOpen(true)}/>;
        }

        return (
            <Reorder.Group axis="y" values={items} onReorder={(newOrder) => handleReorder(newOrder, scope)} className="space-y-3">
                {items.map((item) => (
                    <TaskCard
                        key={item.id}
                        task={item}
                        onComplete={() => handleComplete(item.id)}
                        onEdit={() => openEditDialog(item)}
                        onDelete={() => handleDelete(item.id)}
                    />
                ))}
            </Reorder.Group>
        );
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="size-10 animate-spin text-sky-600 dark:text-sky-300"/>
                    <p className="text-sm font-medium">Loading your tasks...</p>
                </div>
            </main>
        );
    }

    return (
        <motion.main
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.35, ease: "easeOut"}}
            className="min-h-screen bg-slate-50 px-3 py-4 text-slate-950 dark:bg-slate-950 dark:text-slate-50 sm:px-6 sm:py-5 lg:px-8"
        >
            <section className="mx-auto max-w-7xl space-y-6">
                <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-sky-100 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300">
                                <CheckSquare className="size-4"/>
                                Tasks
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Organize your work queue</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                                Track assignments, deadlines, and small wins without making the workspace feel heavy.
                            </p>
                        </div>

                        <Button onClick={() => setOpen(true)} className="h-10 w-full lg:w-auto">
                            <Plus className="size-4"/>
                            Add Task
                        </Button>
                    </div>
                </header>

                <section className="hidden gap-4 lg:grid lg:grid-cols-3">
                    {metricCards.map((card) => (
                        <Card key={card.label} className="rounded-lg border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <CardContent className="flex items-center justify-between gap-4 p-4 sm:p-5">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                                    <p className="mt-2 text-4xl font-bold tracking-tight">{card.value}</p>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{card.helper}</p>
                                </div>
                                <div className={`flex size-12 shrink-0 items-center justify-center rounded-md border ${card.color}`}>
                                    <card.icon className="size-6"/>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                    <Card className="rounded-lg border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">Progress</CardTitle>
                            <p className="text-sm text-slate-500 dark:text-slate-400">A quick pulse on your task list.</p>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-5">
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="font-medium text-slate-600 dark:text-slate-300">Completion</span>
                                    <span className="font-bold">{completionRate}%</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div
                                        className="h-full rounded-full bg-sky-600 transition-all dark:bg-sky-400"
                                        style={{width: `${completionRate}%`}}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Next active task</p>
                                    <p className="mt-2 line-clamp-2 font-semibold">
                                        {activeTasks[0]?.title || "No active task"}
                                    </p>
                                </div>
                                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Today</p>
                                    <p className="mt-2 font-semibold">{todayTasks.length} task due today</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <CardHeader className="gap-4">
                            <div>
                                <CardTitle className="text-base font-bold">Task List</CardTitle>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Drag to reorder locally, check off what is done.
                                </p>
                            </div>
                            <Tabs defaultValue="all" className="w-full">
                                <TabsList className="grid h-auto w-full grid-cols-3 rounded-md bg-slate-100 p-1 dark:bg-slate-950">
                                    <TabsTrigger value="all" className="rounded-sm">All</TabsTrigger>
                                    <TabsTrigger value="active" className="rounded-sm">Active</TabsTrigger>
                                    <TabsTrigger value="complete" className="rounded-sm">Done</TabsTrigger>
                                </TabsList>

                                <TabsContent value="all" className="mt-4">
                                    {renderTaskList(tasks, "all", "No task yet", "Add your first assignment or daily focus item.")}
                                </TabsContent>
                                <TabsContent value="active" className="mt-4">
                                    {renderTaskList(activeTasks, "active", "No active task", "Everything is clear for now. Add a new task when something comes up.")}
                                </TabsContent>
                                <TabsContent value="complete" className="mt-4">
                                    {renderTaskList(completedTasks, "complete", "No completed task", "Complete a task and it will show up here.")}
                                </TabsContent>
                            </Tabs>
                        </CardHeader>
                    </Card>
                </section>
            </section>

            <TaskDialog
                open={open}
                onOpenChange={setOpen}
                mode="create"
                title={title}
                setTitle={setTitle}
                setDate={setDate}
                submitting={submitting}
                onSubmit={handleSubmit}
            />

            <TaskDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                mode="edit"
                title={editTitle}
                setTitle={setEditTitle}
                setDate={setEditDate}
                submitting={submitting}
                onSubmit={handleEditSubmit}
            />
        </motion.main>
    );
}
 
