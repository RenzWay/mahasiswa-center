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

const Model = new ModelFirestore();

export default function DashboardPage() {
    // === State Management ===
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [schedule, setSchedule] = useState([]);

    // === Derived Data ===
    const taskLength = tasks.length;
    const noteLength = notes.length;
    const scheduleLength = schedule.length;

    // === Router Syntax ===
    const router = useRouter();

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
                <p className="text-center py-10">Loading dashboard...</p>
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
            color: "text-blue-500 border-b-blue-500",
        },
        {
            name: "Event Today",
            icon: CalendarDays,
            handle: scheduleLength,
            color: "text-green-500 border-b-green-500",
        },
        {
            name: "Total Notes",
            icon: NotebookPen,
            handle: noteLength,
            color: "text-purple-500 border-b-purple-500",
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
                                className="flex items-center gap-3 p-3 mb-4 rounded-lg border border-border hover:bg-accent transition-colors"
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
                            <Button className="w-full" variant="outline">
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
                            <Button className="w-full" variant="outline">
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
                            <Button className="w-full" variant="outline">
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
            <header className="mb-6">
                <h3 className="dark:text-blue-200 text-blue-600 font-bold">Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                    Welcome back, {user.displayName || user.email}
                </p>
            </header>

            {/* === Top Summary Cards === */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardMiniTv.map((row, i) => (
                    <Card
                        key={i}
                        className={`hover:shadow-md dark:shadow-white transition-shadow duration-300 border-b-[4px] ${row.color}`}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className={`text-sm font-medium ${row.color.split(" ")[0]}`}>
                                {row.name}
                            </CardTitle>
                            <row.icon className={`h-5 w-5 ${row.color.split(" ")[0]}`}/>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-bold ${row.color.split(" ")[0]}`}>
                                {row.handle}
                            </div>
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
                        className="hover:shadow-md dark:shadow-white transition-shadow duration-300"
                    />
                ))}
            </section>
        </motion.section>
    );
}
