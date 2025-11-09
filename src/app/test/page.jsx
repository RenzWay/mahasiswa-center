"use client"
import React, {useRef} from 'react';
import {useInView} from "framer-motion"
// import {LoadingDashboard} from "@/app/lib/loading";

export default function TestPage() {
    const ref = useRef(null);
    const inView = useInView(ref, {once: true});

    return (
        <section className="flex justify-center items-center h-screen">
            <div
                className="backdrop-blur-md bg-[#23284a]/70 border border-white/10 shadow-[8px_8px_16px_#141730,_-8px_-8px_16px_#2b3160] p-6 rounded-lg w-fit">
                ...
            </div>
        </section>
    )
}