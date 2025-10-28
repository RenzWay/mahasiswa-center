"use client"
import React, {useRef} from 'react';
import {motion, useInView} from "framer-motion"

const notes = [
    {id: 1, title: "Belajar React"},
    {id: 2, title: "Belajar Tailwind"},
    {id: 3, title: "Belajar Firebase"},
    {id: 4, title: "Belajar Motion"},
    {id: 5, title: "Belajar Animasi"},
    {id: 5, title: "Belajar Animasi"},
    {id: 5, title: "Belajar Animasi"},
];


export default function TestPage() {
    const ref = useRef(null);
    const inView = useInView(ref, {once: true});

    return (
        <section className="">
            {notes.map((note, i) => (
                <motion.div
                    key={i}
                    initial={{opacity: 0, y: 40}}       // posisi awal
                    whileInView={{opacity: 1, y: 0}}     // animasi saat muncul di viewport
                    viewport={{amount: 0.2}}
                    transition={{duration: 0.6, delay: i * 0.1}}
                    className="h-32 bg-blue-500/20 border border-blue-400 rounded-xl flex items-center justify-center text-lg mb-[10em]"
                >
                    {note.title}
                </motion.div>
            ))}
        </section>
    )
}