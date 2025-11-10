"use client";

import {useEffect, useState} from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import ModelFirestore from "@/model/model";
import {Input} from "@/components/ui/input";
import {Calendar28} from "@/app/lib/Calendar28";
import {Label} from "@/components/ui/label";
import {EmptyTask} from "@/app/lib/empty";
import {FileXIcon, Loader2} from "lucide-react";
import {Reorder} from "framer-motion";
import {CardTaskReorder} from "@/app/lib/card";

const Task = new ModelFirestore();

export default function TaskPage() {
    const [open, setOpen] = useState(false);
    const [task, setTask] = useState([]);
    const [complete, setComplete] = useState(false);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const getTheTasks = async () => {
            setLoading(true);
            try {
                const data = await Task.getAllTask()
                setTask(data)
            } catch (e) {
                console.error("Error while launch server: ", e)
                setLoading(false);
            } finally {
                setLoading(false)
            }
        }
        getTheTasks();
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        setComplete(false);
        setSubmitting(true);

        try {
            const taskData = {
                title: title,
                complete: complete,
                date: date,
            }

            const newTask = await Task.addTask(taskData);
            setTask((prev) => [...prev, newTask]);
            setOpen(false);
            setTitle("");
        } catch (e) {
            console.error(e);
            throw e
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(id) {
        try {
            await Task.deleteTask(id);
            setTask(prev => prev.filter(t => t.id !== id));
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    const handleComplete = async (id) => {
        try {
            const current = task.find(t => t.id === id);
            if (!current) return;

            const newStatus = !current.complete;
            await Task.updateTask(id, {complete: newStatus});

            setTask(prev =>
                prev.map(t =>
                    t.id === id ? {...t, complete: newStatus} : t
                )
            );
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    if (loading) {
        return (
            <section className="mx-4">
                <header className="flex justify-between items-center px-8 mb-8 border-b py-4">
                    <h4 className="text-2xl font-semibold">Task Page</h4>
                </header>
                <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500"/>
                    <p className="text-gray-500">Loading your tasks...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="mx-4">
            {/* Header */}
            <header
                className="flex justify-between items-center px-8 mb-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 shadow-sm border border-indigo-100 dark:border-slate-700">
                <h4 className="text-2xl font-bold text-slate-800 dark:text-white">Task Page</h4>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    + Add Task
                                </Button>
                            </DialogTrigger>

                            <DialogContent
                                className="sm:max-w-[425px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-semibold text-slate-800 dark:text-white">Add
                                        Your Task</DialogTitle>
                                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                                        What do you need to get done? Add it to your list.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                    <Label htmlFor="title" className="text-slate-700 dark:text-slate-300">Task</Label>
                                    <Input
                                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"/>
                                    <Calendar28 setDate={setDate} title="Due Date"/>
                                    <Button type="submit" className="w-full">
                                        {submitting ?
                                            <Loader2 className="animate-spin  mr-3 size-5"/> : "Save Task"}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </TooltipTrigger>

                    <TooltipContent>
                        <p className="text-slate-700 dark:text-slate-200">Add your task now</p>
                    </TooltipContent>
                </Tooltip>
            </header>

            {/* Main Tabs */}
            <section className="mx-4 bg-white dark:bg-slate-900 min-h-screen rounded-2xl p-6 shadow-inner" role="main">
                <Tabs defaultValue="all">
                    <TabsList className="bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                        <TabsTrigger
                            value="all"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white text-slate-700 dark:text-slate-300 rounded-lg transition-all">
                            All
                        </TabsTrigger>
                        <TabsTrigger
                            value="active"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-slate-700 dark:text-slate-300 rounded-lg transition-all">
                            Active
                        </TabsTrigger>
                        <TabsTrigger
                            value="complete"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-slate-700 dark:text-slate-300 rounded-lg transition-all">
                            Complete
                        </TabsTrigger>
                    </TabsList>


                    {/* ✅ Tab All - Wrap dengan Reorder.Group */}
                    <TabsContent value="all" className="px-4 pt-4">
                        {task.length === 0 ? (
                            <EmptyTask
                                title="There no task"
                                icon={<FileXIcon/>}
                                description="Please add some task since no empty"
                                onHandle={() => setOpen(true)}
                            />
                        ) : (
                            <Reorder.Group axis="y" values={task} onReorder={setTask} className="space-y-3">
                                {task.map((item) => (
                                    <CardTaskReorder
                                        key={item.id}
                                        task={item}
                                        onComplete={() => handleComplete(item.id)}
                                        setTask={setTask}
                                        onDelete={() => handleDelete(item.id)}
                                    />
                                ))}
                            </Reorder.Group>
                        )}
                    </TabsContent>

                    {/* ✅ Tab Active */}
                    <TabsContent value="active" className="px-4 pt-4">
                        {task.filter(t => !t.complete).length === 0 ? (
                            <EmptyTask
                                title="There no active task"
                                icon={<FileXIcon/>}
                                description="Please add your task to add it"
                                onHandle={() => setOpen(true)}
                            />
                        ) : (
                            <Reorder.Group
                                axis="y"
                                values={task.filter(t => !t.complete)}
                                onReorder={(newOrder) => {
                                    const completed = task.filter(t => t.complete);
                                    setTask([...newOrder, ...completed]);
                                }}
                                className="space-y-3"
                            >
                                {task.filter(t => !t.complete).map((item) => (
                                    <CardTaskReorder
                                        key={item.id}
                                        task={item}
                                        onComplete={() => handleComplete(item.id)}
                                        setTask={setTask}
                                        onDelete={() => handleDelete(item.id)}
                                    />
                                ))}
                            </Reorder.Group>
                        )}
                    </TabsContent>

                    {/* ✅ Tab Complete */}
                    <TabsContent value="complete" className="px-4 pt-4">
                        {task.filter(t => t.complete).length === 0 ? (
                            <EmptyTask
                                title="There no complete task"
                                icon={<FileXIcon/>}
                                description="Add some task or complete your task"
                                onHandle={() => setOpen(true)}
                            />
                        ) : (
                            <Reorder.Group
                                axis="y"
                                values={task.filter(t => t.complete)}
                                onReorder={(newOrder) => {
                                    const active = task.filter(t => !t.complete);
                                    setTask([...active, ...newOrder]);
                                }}
                                className="space-y-3"
                            >
                                {task.filter(t => t.complete).map((item) => (
                                    <CardTaskReorder
                                        key={item.id}
                                        task={item}
                                        onComplete={() => handleComplete(item.id)}
                                        setTask={setTask}
                                        onDelete={() => handleDelete(item.id)}
                                    />
                                ))}
                            </Reorder.Group>
                        )}
                    </TabsContent>
                </Tabs>
            </section>
        </section>
    );
}