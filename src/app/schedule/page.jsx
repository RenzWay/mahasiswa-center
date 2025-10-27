"use client";

import {useState} from "react";
import {Calendar} from "@/components/ui/calendar";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default function SchedulePage() {
    const [date, setDate] = useState(new Date());

    // dummy data
    const [schedule] = useState([
        {id: 1, title: "Belajar React", date: new Date(2025, 9, 26)},
        {id: 2, title: "Ngopi santai", date: new Date(2025, 9, 27)},
        {id: 3, title: "Ngerjain tugas", date: new Date(2025, 9, 26)},
    ]);

    // filter jadwal sesuai tanggal yang dipilih
    const selectedSchedule = schedule.filter(
        (item) =>
            item.date.toDateString() === date?.toDateString()
    );

    return (
        <section className="ml-4">
            <header className="mb-4">
                <h1 className="text-2xl font-semibold">Schedule Page</h1>
            </header>

            <section role="main" className="space-y-4">
                <Calendar mode="single" selected={date} onSelect={setDate}/>

                <div className="p-3 rounded-md border">
                    {date ? (
                        <>
                            <p className="mb-2">
                                📅 <span className="font-semibold">
                                {date.toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                            </p>

                            {selectedSchedule.length > 0 ? (
                                <div className="space-y-2">
                                    {selectedSchedule.map((item) => (
                                        <Card key={item.id}>
                                            <CardHeader>
                                                <CardTitle>{item.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground">
                                                    Jadwal penting 🚀
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">
                                    Belum ada jadwal di tanggal ini 😴
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="text-muted-foreground">
                            Klik tanggal di kalender untuk melihat jadwalnya.
                        </p>
                    )}
                </div>
            </section>
        </section>
    );
}
