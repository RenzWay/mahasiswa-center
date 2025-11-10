"use client";
import {motion} from "framer-motion";
import {BookIcon, CalendarDays, NotebookPen} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import Link from "next/link";
import {useEffect, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "@/firebase/firebase";
import ModelFirestore from "@/model/model";
import {CardNoteMini, CardQuickDashboard, CardScheduleMini} from "@/app/lib/card";
import {formatDate} from "@/app/lib/formatdate";
import {useRouter} from "next/navigation";
import {LoadingDashboard} from "@/app/lib/loading";
import Image from "next/image";

const Model = new ModelFirestore();

export default function DashboardPage() {
    // === State Management ===
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [schedule, setSchedule] = useState([]);

    // === State Length Dashboard ===
    // === Derived Data ===
    const [taskLength, setTaskLength] = useState([]);
    const [notesLength, setNotesLength] = useState([])
    const [scheduleLength, setScheduleLength] = useState([])

    // === State DateTime ===
    const [dateTime, setDateTime] = useState(new Date());

    // === Router Syntax ===
    const router = useRouter();

    // === DateTime ===
    useEffect(() => {
        const interval = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatted = dateTime.toLocaleString("en-EN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formattedTime = dateTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

    // === Auth Listener & Data Fetch ===
    useEffect(() => {
        Model.loginFirst((path) => router.push(path));
        const unsub = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            setUser(currentUser);
            try {
                const [tasksRes, notesRes, scheduleRes] = await Promise.all([
                    Model.getAllTask(),
                    Model.getAllNotes(),
                    Model.getAllSchedule(),
                ]);

                setTaskLength(tasksRes.length);
                setNotesLength(notesRes.length);
                setScheduleLength(scheduleRes.length);

                setTasks(tasksRes.slice(0, 3));
                setNotes(notesRes.slice(0, 3));
                setSchedule(scheduleRes.slice(0, 3));
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        });

        return () => unsub();
    }, []);

    // === Loading / No Login ===
    if (loading) {
        return (
            <div className="h-screen">
                <LoadingDashboard/>
            </div>
        )
    }
    if (!user) return <p className="text-center py-10">Please login to access your dashboard.</p>;

    // === Dashboard Card Data ===
    const dashboardMiniTv = [
        {
            name: "Pending Task",
            icon: BookIcon,
            handle: taskLength,
            color: "text-blue-600 border-b-blue-400",
        },
        {
            name: "Event Today",
            icon: CalendarDays,
            handle: scheduleLength,
            color: "text-green-600 border-b-green-400 ",
        },
        {
            name: "Total Notes",
            icon: NotebookPen,
            handle: notesLength,
            color: "text-purple-600 border-b-purple-400",
        },
    ];


    const quickDashboard = [
        {
            title: "Upcoming Task",
            description: `You have ${taskLength} task due soon`,
            content: (
                <>
                    {tasks.length > 0 ? (
                        tasks.map((task, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 mb-4 rounded-lg border border-border hover:bg-accent dark:hover:text-slate-200 hover:text-black transition-colors"
                            >
                                <Checkbox checked={task.complete} className="h-4 w-4"/>
                                <div className="flex-1">
                                    <p
                                        className={`text-sm font-medium ${
                                            task.complete ? "line-through text-muted-foreground" : ""
                                        }`}
                                    >
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
                    <div className="pt-4">
                        <Link href="/task" className="w-full">
                            <Button
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-3d hover:shadow-3d-pressed transition-all duration-300">
                                See Your Task →
                            </Button>
                        </Link>
                    </div>
                </>
            ),
        },
        {
            title: "Schedule Today",
            description: "Your agenda today",
            content: (
                <>
                    {schedule.length > 0 ? (
                        schedule.map((item, index) => <CardScheduleMini key={index} schedule={item}/>)
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No schedule today</p>
                    )}
                    <div className="pt-4">
                        <Link href="/schedule" className="w-full">
                            <Button
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-3d hover:shadow-3d-pressed transition-all duration-300">
                                See Your Schedule →
                            </Button>
                        </Link>
                    </div>
                </>
            ),
        },
        {
            title: "Recent Notes",
            description: "Your most recent notes",
            content: (
                <>
                    {notes.length > 0 ? (
                        notes.map((item, i) => <CardNoteMini key={i} notes={item}/>)
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No notes yet</p>
                    )}
                    <div className="pt-4">
                        <Link href="/note" className="w-full">
                            <Button
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-3d hover:shadow-3d-pressed transition-all duration-300">
                                See Your Notes →
                            </Button>
                        </Link>
                    </div>
                </>
            ),
        },
    ];

    // === Main Render ===
    return (
        <motion.section
            initial={{opacity: 0, x: -100}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, y: 100}}
            transition={{duration: 0.6, ease: "easeInOut"}}
            className="mx-4 mt-4"
        >
            {/* === Header === */}
            <header
                className="mb-6 p-6 rounded-2xl shadow-3d bg-gradient-to-br from-blue-50 via-indigo-100 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border border-indigo-200 dark:border-white/10 text-slate-800 dark:text-white transition-all duration-500"
            >
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-white">
                            Dashboard
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                            Welcome back, {user.displayName || user.email}
                        </p>
                    </div>

                    <div className="ml-auto flex flex-col items-end text-right gap-2">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {formatted}
                        </p>
                        <div
                            className="flex items-center gap-3 bg-white/50 dark:bg-white/5 px-4 py-2 rounded-xl shadow-3d-pressed backdrop-blur-sm">
                            <Image src={`/clock.png`} alt="clock icon" width={30} height={30}/>
                            <span
                                className="text-xl font-bold tracking-widest text-slate-800 dark:text-slate-100">{formattedTime}
                            </span>
                        </div>
                    </div>
                </div>
            </header>


            {/* === Top Summary Cards === */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardMiniTv.map((row, i) => (
                    <Card
                        key={i}
                        className={`shadow-3d hover:shadow-3d-pressed hover:-translate-y-1 transition-all duration-300 border-b-4 ${row.color} bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900/90 dark:to-gray-800/90 border border-indigo-200 dark:border-white/10`}
                    >

                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className={`text-sm font-medium ${row.color.split(" ")[0]}`}>
                                {row.name}
                            </CardTitle>
                            <row.icon className={`h-6 w-6 ${row.color.split(" ")[0]}`}/>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-4xl font-bold ${row.color.split(" ")[0]}`}>
                                {row.handle}
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Total items</p>
                        </CardContent>
                    </Card>
                ))}
            </section>

            {/* === Quick Dashboard Cards === */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
                {quickDashboard.map((item, index) => (
                    <CardQuickDashboard
                        key={index}
                        title={item.title}
                        description={item.description}
                        content={item.content}
                        // className={`shadow-3d hover:shadow-3d-pressed transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-100  dark:from-sky-200 dark:to-blue-100  text-slate-800 dark:text-slate-800 border border-indigo-200 dark:border-blue-300 ${className}`}
                    />
                ))}
            </section>
        </motion.section>
    );
}
