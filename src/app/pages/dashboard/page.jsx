"use client";

import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {onAuthStateChanged} from "firebase/auth";
import {motion} from "framer-motion";
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    CheckSquare,
    Clock3,
    LayoutDashboard,
    NotebookPen,
    Plus,
    Sparkles,
} from "lucide-react";
import {auth} from "@/firebase/firebase";
import ModelFirestore from "@/model/model";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Checkbox} from "@/components/ui/checkbox";
import {formatDate} from "@/app/lib/formatdate";
import {LoadingDashboard} from "@/app/lib/loading";

const Model = new ModelFirestore();

const cardMotion = {
    initial: {opacity: 0, y: 16},
    animate: {opacity: 1, y: 0},
};

function EmptyState({label}) {
    return (
        <div className="flex min-h-28 items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
            {label}
        </div>
    );
}

function SectionCard({title, description, href, action, children}) {
    return (
        <Card className="rounded-lg border-slate-200 bg-white py-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:py-6">
            <CardHeader className="flex flex-col items-start justify-between gap-3 px-4 pb-2 sm:flex-row sm:gap-4 sm:px-6 sm:pb-3">
                <div className="min-w-0">
                    <CardTitle className="text-base font-bold text-slate-950 dark:text-slate-50">
                        {title}
                    </CardTitle>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
                </div>
                <Button asChild size="sm" variant="outline" className="w-full shrink-0 sm:w-auto">
                    <Link href={href}>
                        {action}
                        <ArrowRight className="size-3.5"/>
                    </Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-3 px-4 sm:px-6">{children}</CardContent>
        </Card>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                setUser(null);
                setLoading(false);
                router.push("/auth/login");
                return;
            }

            setUser(currentUser);
            try {
                const [tasksRes, notesRes, scheduleRes] = await Promise.all([
                    Model.getAllTask(),
                    Model.getAllNotes(),
                    Model.getAllSchedule(),
                ]);

                setTasks(tasksRes);
                setNotes(notesRes);
                setSchedule(scheduleRes);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        });

        return () => unsub();
    }, [router]);

    const formattedDate = dateTime.toLocaleString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const formattedTime = dateTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    const activeTasks = useMemo(() => tasks.filter((task) => !task.complete), [tasks]);
    const completedTasks = useMemo(() => tasks.filter((task) => task.complete), [tasks]);
    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

    const todaySchedule = useMemo(() => {
        const today = new Date().toDateString();
        return schedule.filter((item) => new Date(item.date).toDateString() === today);
    }, [schedule]);

    const metricCards = [
        {
            label: "Active Tasks",
            value: activeTasks.length,
            helper: `${completedTasks.length} completed`,
            icon: CheckSquare,
            color: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/70 dark:bg-sky-950/40 dark:text-sky-300",
        },
        {
            label: "Today Schedule",
            value: todaySchedule.length,
            helper: `${schedule.length} total agenda`,
            icon: CalendarDays,
            color: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300",
        },
        {
            label: "Notes",
            value: notes.length,
            helper: "study archive",
            icon: NotebookPen,
            color: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/70 dark:bg-violet-950/40 dark:text-violet-300",
        },
    ];

    if (loading) {
        return <LoadingDashboard/>;
    }

    if (!user) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center text-slate-600 dark:text-slate-300">
                Redirecting to login...
            </main>
        );
    }

    return (
        <motion.main
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.35, ease: "easeOut"}}
            className="min-h-screen overflow-x-hidden bg-slate-50 px-2 py-3 text-slate-950 dark:bg-slate-950 dark:text-slate-50 sm:px-6 sm:py-5 lg:px-8"
        >
            <section className="mx-auto w-full max-w-7xl min-w-0 space-y-4 sm:space-y-6">
                <header className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="grid gap-4 p-3 sm:p-5 md:grid-cols-[minmax(0,1fr)_auto] md:p-6">
                        <div className="min-w-0">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-sky-100 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300 sm:text-sm">
                                <LayoutDashboard className="size-4"/>
                                Dashboard
                            </div>
                            <h1 className="break-words text-xl font-bold tracking-tight sm:text-3xl">
                                Selamat datang, {user.displayName || user.email}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                                Lihat tugas yang aktif, agenda hari ini, dan catatan terbaru tanpa pindah halaman dulu.
                            </p>
                        </div>

                        <div className="flex min-w-0 flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 sm:p-4 md:w-72">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                                    <Clock3 className="size-5"/>
                                </div>
                                <div className="min-w-0">
                                    <p className="break-words text-sm font-medium text-slate-500 dark:text-slate-400">{formattedDate}</p>
                                    <p className="text-2xl font-bold tabular-nums">{formattedTime}</p>
                                </div>
                            </div>
                            <Button asChild className="h-9">
                                <Link href="/task">
                                    <Plus className="size-4"/>
                                    Add Task
                                </Link>
                            </Button>
                        </div>
                    </div>
                </header>

                <section className="hidden gap-4 md:grid md:grid-cols-3">
                    {metricCards.map((card, index) => (
                        <motion.div
                            key={card.label}
                            variants={cardMotion}
                            initial="initial"
                            animate="animate"
                            transition={{duration: 0.35, delay: index * 0.06}}
                        >
                            <Card className="rounded-lg border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
                        </motion.div>
                    ))}
                </section>

                <section className="grid gap-4 sm:gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <Card className="rounded-lg border-slate-200 bg-white py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:py-6">
                        <CardHeader className="px-4 sm:px-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <CardTitle className="text-base font-bold">Today Focus</CardTitle>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Progress kecil yang penting buat hari ini.
                                    </p>
                                </div>
                                <Sparkles className="size-5 text-amber-500 dark:text-amber-300"/>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6">
                            <div className="mb-4 sm:mb-5">
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="font-medium text-slate-600 dark:text-slate-300">Task completion</span>
                                    <span className="font-bold">{completionRate}%</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div
                                        className="h-full rounded-full bg-sky-600 transition-all dark:bg-sky-400"
                                        style={{width: `${completionRate}%`}}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 sm:p-4">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Next task</p>
                                    <p className="mt-2 line-clamp-2 font-semibold">
                                        {activeTasks[0]?.title || "No active task"}
                                    </p>
                                </div>
                                <div className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 sm:p-4">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Next agenda</p>
                                    <p className="mt-2 line-clamp-2 font-semibold">
                                        {todaySchedule[0]?.title || "No agenda today"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <SectionCard
                        title="Upcoming Tasks"
                        description={`${activeTasks.length} task masih aktif`}
                        href="/task"
                        action="Open"
                    >
                        {tasks.slice(0, 4).length > 0 ? (
                            tasks.slice(0, 4).map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900 sm:items-center"
                                >
                                    <Checkbox checked={task.complete} className="mt-0.5 size-5 shrink-0 sm:mt-0"/>
                                    <div className="min-w-0 flex-1">
                                        <p className={`truncate text-sm font-semibold ${task.complete ? "text-slate-400 line-through" : "text-slate-800 dark:text-slate-100"}`}>
                                            {task.title}
                                        </p>
                                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                            <CalendarDays className="size-3"/>
                                            {formatDate(task.date)}
                                        </p>
                                    </div>
                                    {task.complete && <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500 sm:mt-0"/>}
                                </div>
                            ))
                        ) : (
                            <EmptyState label="No task yet"/>
                        )}
                    </SectionCard>
                </section>

                <section className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                    <SectionCard
                        title="Schedule Today"
                        description="Agenda yang perlu kamu lihat sekarang"
                        href="/schedule"
                        action="Schedule"
                    >
                        {todaySchedule.slice(0, 3).length > 0 ? (
                            todaySchedule.slice(0, 3).map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-md border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900/70 dark:bg-emerald-950/30 sm:p-4"
                                >
                                    <p className="font-semibold text-emerald-950 dark:text-emerald-100">{item.title}</p>
                                    <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                                        {formatDate(item.date)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <EmptyState label="No schedule today"/>
                        )}
                    </SectionCard>

                    <SectionCard
                        title="Recent Notes"
                        description="Catatan terakhir yang kamu buat"
                        href="/note"
                        action="Notes"
                    >
                        {notes.slice(0, 3).length > 0 ? (
                            notes.slice(0, 3).map((note) => (
                                <article
                                    key={note.id}
                                    className="rounded-md border border-violet-100 bg-violet-50 p-3 dark:border-violet-900/70 dark:bg-violet-950/30 sm:p-4"
                                >
                                    <p className="font-semibold text-violet-950 dark:text-violet-100">
                                        {note.title || "Untitled Note"}
                                    </p>
                                    <div
                                        className="mt-2 line-clamp-2 text-sm text-violet-700 dark:text-violet-300"
                                        dangerouslySetInnerHTML={{__html: note.content || ""}}
                                    />
                                </article>
                            ))
                        ) : (
                            <EmptyState label="No notes yet"/>
                        )}
                    </SectionCard>
                </section>
            </section>
        </motion.main>
    );
}
