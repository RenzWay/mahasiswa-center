"use client"
import {motion} from "framer-motion";
import {BookIcon, CalendarDays, NotebookPen} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import ModelFirestore from "@/model/model";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Checkbox} from "@/components/ui/checkbox";
import {CardNoteMini, CardQuickDashboard, CardScheduleMini} from "@/app/lib/card";
import {formatDate} from "@/app/lib/formatdate";

const Model = new ModelFirestore()
export default function DashboardPage() {
    const [taskLength, setTaskLength] = useState(0);
    const [tasks, setTasks] = useState([]);
    const [noteLength, setNoteLength] = useState(0);
    const [notes, setNotes] = useState([]);
    const [scheduleLength, setScheduleLength] = useState(0);
    const [schedule, setSchedule] = useState([]);

    const dashboardMiniTv = [
        {
            name: "Pending Task",
            icon: BookIcon,
            handle: taskLength,
            color: "blue",
        },
        {
            name: "Event Today",
            icon: CalendarDays,
            handle: scheduleLength,
            color: "green",
        },
        {
            name: "Total Notes",
            icon: NotebookPen,
            handle: noteLength,
            color: "purple",
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
                                        {
                                            formatDate(task.date)
                                        }
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No task now
                        </p>
                    )}
                    <div className="pt-4">
                        <Link href="/task" className="w-full">
                            <Button className="w-full" variant="outline">
                                See Your Task? →
                            </Button>
                        </Link>
                    </div>
                </>
            ),
        },
        {
            title: "Schedule Today",
            description: "Your agenda today's",
            content:
                <>
                    {schedule.map((schedule, index) => (
                        <CardScheduleMini key={index} schedule={schedule}/>
                    ))}
                    <div className="pt-4">
                        <Link href="/schedule" className="w-full">
                            <Button className="w-full" variant="outline">
                                See Your Schedule? →
                            </Button>
                        </Link>
                    </div>
                </>
        },
        {
            title: "Recent Notes",
            description: "Your most recent notes",
            content:
                <>
                    {notes.map((item, i) => (
                        <CardNoteMini key={i} notes={item}/>
                    ))}
                    <div className="pt-4">
                        <Link href="/note" className="w-full">
                            <Button className="w-full" variant="outline">
                                See Your Note? →
                            </Button>
                        </Link>
                    </div>
                </>,
        },
    ];

    useEffect(() => {
        const fetchTasks = async () => {
            const tasks = await Model.getAllTask();
            setTaskLength(tasks.length);
            setTasks(tasks.slice(0, 3));
        };

        const fetchNotes = async () => {
            try {
                const note = await Model.getAllNotes()
                setNoteLength(note.length);
                setNotes(note.slice(0, 3));
            } catch (e) {
                console.error(e);
            }
        }

        const fetchSchedules = async () => {
            try {
                const sched = await Model.getAllSchedule();
                setScheduleLength(sched.length);
                setSchedule(sched.slice(0, 3));
            } catch (err) {
                console.error(err);
            }
        }
        fetchNotes()
        fetchTasks();
        fetchSchedules();
    }, []);

    return (
        <motion.section
            initial={{opacity: 0, x: -100}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, y: 100}}
            transition={{duration: 0.6, ease: "easeInOut"}}
            className="mx-4 mt-4"
        >
            {/* Title Dashboard */}
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
                            className={`hover:shadow-md dark:shadow-white transition-shadow duration-300 border-b-[4px] border-b-${row.color}-500`}
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className={`text-sm font-medium text-${row.color}-500`}>
                                    {row.name}
                                </CardTitle>
                                <row.icon className={`h-5 w-5 text-${row.color}-500`}/>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-3xl font-bold text-${row.color}-500`}>{row.handle}</div>
                            </CardContent>
                        </Card>
                    ))}
                </header>

                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
                    {/* === Task dashboard menu view page === */}
                    {
                        quickDashboard.map((item, index) => (
                            <CardQuickDashboard
                                key={index}
                                title={item.title}
                                description={item.description}
                                content={item.content}
                                className={"hover:shadow-md dark:shadow-white transition-shadow duration-300 "}
                            />
                        ))
                    }
                </section>
            </section>
        </motion.section>
    );
}
