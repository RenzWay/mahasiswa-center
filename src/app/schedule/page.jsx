"use client";

import {useEffect, useState} from "react";
import {Calendar} from "@/components/ui/calendar";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {PlusCircle, Trash2} from "lucide-react";
import {motion} from "framer-motion";
import ModelFirestore from "@/model/model";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "@/firebase/firebase";

const Model = new ModelFirestore();

export default function SchedulePage() {
    const [date, setDate] = useState(new Date());
    const [schedule, setSchedule] = useState([]);
    const [newTitle, setNewTitle] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                console.warn("Belum login, arahkan ke halaman login");
                // contoh redirect manual (kalau pakai next/navigation)
                window.location.href = "/auth/login";
                return;
            }

            try {
                const data = await Model.getAllSchedule();
                setSchedule(data);
            } catch (err) {
                console.error("Error fetching schedule:", err);
            }
        });

        return () => unsubscribe();
    }, []);


    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !date) return;

        const newItem = {
            title: newTitle.trim(),
            date: date.toISOString(),
        };

        const id = await Model.addSchedule(newItem);
        setSchedule((prev) => [...prev, {...newItem, id}]);
        setNewTitle("");
    };

    const handleDelete = async (id) => {
        await Model.deleteSchedule(id);
        setSchedule((prev) => prev.filter((item) => item.id !== id));
    };

    const selectedSchedule = schedule.filter(
        (item) => new Date(item.date).toDateString() === date?.toDateString()
    );

    return (
        <motion.section
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4}}
            className="mx-auto mt-4 w-full max-w-5xl px-4 space-y-5"
        >
            <header className="text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    📆 Schedule Days
                </h1>
                <p className="text-sm text-muted-foreground">
                    Chose your schedule and add your activity
                </p>
            </header>

            {/* layout utama: kolom di mobile, flex di desktop */}
            <section className="flex flex-col md:flex-row gap-6">
                {/* Kalender */}
                <div className="rounded-lg border p-3 shadow-sm bg-card md:w-1/3">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="w-full"
                    />
                </div>

                {/* Daftar jadwal & input */}
                <div className="rounded-lg border p-3 shadow-sm bg-card space-y-3 flex-1">
                    <form onSubmit={handleAdd} className="flex items-center gap-2">
                        <Input
                            placeholder="Tambah jadwal..."
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="text-sm"
                        />
                        <Button size="sm">
                            <PlusCircle className="w-4 h-4 mr-1"/>
                            Add
                        </Button>
                    </form>

                    {date ? (
                        <>
                            <p className="text-sm font-semibold mt-3">
                                📅{" "}
                                {date.toLocaleDateString("en-EN", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>

                            {selectedSchedule.length > 0 ? (
                                <div className="space-y-2 mt-2">
                                    {selectedSchedule.map((item) => (
                                        <Card
                                            key={item.id}
                                            className="border border-muted shadow-sm hover:shadow-md transition-all"
                                        >
                                            <CardHeader className="flex flex-row justify-between items-center p-3">
                                                <CardTitle className="text-sm font-medium truncate">
                                                    {item.title}
                                                </CardTitle>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500"/>
                                                </Button>
                                            </CardHeader>
                                            <CardContent className="p-3 pt-0">
                                                <p className="text-xs text-muted-foreground">
                                                    Important Schedule 🚀
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground mt-2 text-center">
                                    You haven't schedule right now 😴
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center">
                            Chose your date first.
                        </p>
                    )}
                </div>
            </section>
        </motion.section>
    );
}
