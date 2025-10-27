"use client"
import {motion} from "framer-motion";
import {BookIcon, CalendarDays, ClockIcon, NotebookPen} from "lucide-react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import ModelFirestore from "@/app/model/model";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Checkbox} from "@/components/ui/checkbox";
import {formatDate} from "@/app/lib/formatdate";

const Model = new ModelFirestore()
export default function DashboardPage() {
    const [taskLength, setTaskLength] = useState(0);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const tasks = await Model.getAllTask();
            setTaskLength(tasks.length);
            setTasks(tasks.slice(0, 3));
        };
        fetchTasks();
    }, []);

    const dashboardMiniTv = [
        {
            name: "Pending Task",
            icon: BookIcon,
            handle: taskLength, // Pakai state
            color: "text-blue-500",
        },
        {
            name: "Event Today",
            icon: ClockIcon,
            handle: 4,
            color: "text-green-500",
        },
        {
            name: "Total Notes",
            icon: NotebookPen,
            handle: 10,
            color: "text-purple-500",
        },
    ];
    return (
        <motion.section
            initial={{opacity: 0, x: -100}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, y: 100}}
            transition={{duration: 0.6, ease: "easeInOut"}}
            className="mx-4 mt-4"
        >
            {/* Judul Dashboard */}
            <header className="mb-6">
                <h3 className="dark:text-blue-200 text-blue-600 font-bold">
                    Dashboard
                </h3>
            </header>

            {/* Grid Card */}
            <section role="main">
                <header className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {dashboardMiniTv.map((row, i) => (
                        <Card
                            key={i}
                            className="hover:shadow-md dark:shadow-white transition-shadow duration-300 border border-border"
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className={`text-sm font-medium ${row.color}`}>
                                    {row.name}
                                </CardTitle>
                                <row.icon className={`h-5 w-5 ${row.color}`}/>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-3xl font-bold ${row.color}`}>{row.handle}</div>
                            </CardContent>
                        </Card>
                    ))}
                </header>

                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
                    {/* === Task dashboard menu view page === */}
                    <Card
                        className="hover:shadow-md dark:shadow-white transition-shadow duration-300 border border-border">
                        <CardHeader>
                            <CardTitle>Upcoming Task</CardTitle>
                            <CardDescription>You have {taskLength} task due soon</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {tasks.length > 0 ? (
                                tasks.map((task, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                                    >
                                        <Checkbox
                                            checked={task.complete}
                                            className="h-4 w-4"
                                        />
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${task.complete ? 'line-through text-muted-foreground' : ''}`}>
                                                {task.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                <CalendarDays size={12}/>
                                                {formatDate(task.date)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No task now</p>
                            )}
                        </CardContent>
                        <CardFooter className="pt-4"> {/* ✅ Hapus padding default */}
                            <Link href="/task" className="w-full"> {/* ✅ Link dibungkus w-full */}
                                <Button className="w-full" variant="outline">
                                    See Your Task? →
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    {/* === Schedule dashboard menu view page === */}
                    <Card
                        className="hover:shadow-md dark:shadow-white transition-shadow duration-300 border border-border">
                        <CardHeader>
                            <CardTitle>Schedule Today</CardTitle>
                            <CardDescription>Your agenda today's</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <span>Matematika</span>
                        </CardContent>
                    </Card>

                    {/* === Notes dashboard menu viewer*/}
                    <Card
                        className="hover:shadow-md dark:shadow-white transition-shadow duration-300 border border-border">
                        <CardHeader>
                            <CardTitle>
                                Recent Notes
                            </CardTitle>
                            <CardDescription>Your most recent notes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            bujank
                        </CardContent>
                    </Card>
                </section>
            </section>
        </motion.section>
    );
}
