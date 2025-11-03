"use client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "@/firebase/firebase";
import {Button} from "@/components/ui/button";
import {ArrowBigRight, Menu, X} from "lucide-react";
import Image from "next/image";
import {motion} from "framer-motion"
import Link from "next/link";

const cardService = [
    {
        title: "Collect Your Tasks",
        description: "Easily manage and keep track of your college assignments with priority tags.",
        color: "bg-red-300",
        img: "/ss/task.png"
    },
    {
        title: "Schedule Your Days",
        description: "Plan your schedule for tomorrow and never miss a class or task again.",
        color: "bg-sky-300",
        img: "/ss/schedule.png"
    },
    {
        title: "Personal Notes",
        description: "Write and organize your own study notes effectively and efficiently.",
        color: "bg-lime-300",
        img: "/ss/note.png"
    }
]

export default function LandingHome() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoading(true);
                setTimeout(() => {
                    router.push("/pages/dashboard");
                }, 800);
            } else {
                setIsLoading(false);
            }
        });
        return () => unsub();
    }, [router]);

    if (isLoading) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
                <div className="flex flex-col items-center">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"/>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                        Loading your services...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <>
            <main className="h-auto bg-gradient-to-tl from-sky-900 to-sky-950 text-white">
                {/* NAVBAR */}
                <header
                    className="sticky top-0 z-50 bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm border-b border-white/30 dark:border-gray-700/40">
                    <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
                        <h3 className="font-extrabold text-lg sm:text-xl">
                            Mahasiswa Center
                        </h3>

                        {/* Tombol menu untuk mobile */}
                        <button
                            className="sm:hidden p-2 rounded-md focus:outline-none"
                            onClick={() => setOpen(!open)}
                            aria-label="Toggle menu"
                        >
                            {open ? <X size={22}/> : <Menu size={22}/>}
                        </button>

                        {/* Menu untuk layar besar */}
                        <nav className="hidden sm:flex items-center gap-6">
                            <ul className="flex gap-6 text-sm sm:text-base">
                                <li>
                                    <Link href="/" className="hover:text-blue-500 transition">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="hover:text-blue-500 transition">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="hover:text-blue-500 transition">
                                        About
                                    </Link>
                                </li>
                            </ul>
                            <Link href="/auth/register">
                                <Button className="text-sm sm:text-base px-4 py-2 sm:px-6">
                                    Start for free
                                </Button>
                            </Link>
                        </nav>
                    </div>

                    {/* Menu mobile */}
                    {open && (
                        <div
                            className="sm:hidden border-t border-white/20 dark:border-gray-700/40 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md">
                            <nav className="flex flex-col items-center gap-4 py-4">
                                <Link
                                    href="/"
                                    className="hover:text-blue-500 transition"
                                    onClick={() => setOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/contact"
                                    className="hover:text-blue-500 transition"
                                    onClick={() => setOpen(false)}
                                >
                                    Contact
                                </Link>
                                <Link
                                    href="/about"
                                    className="hover:text-blue-500 transition"
                                    onClick={() => setOpen(false)}
                                >
                                    About
                                </Link>
                                <Link href="/auth/register" onClick={() => setOpen(false)}>
                                    <Button className="text-sm px-4 py-2">Start for free</Button>
                                </Link>
                            </nav>
                        </div>
                    )}
                </header>

                {/* HERO SECTION */}
                <section
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-12 items-center text-center md:text-left">
                    <motion.div
                        initial={{opacity: 0, x: -50}}
                        whileInView={{opacity: 1, x: 0}}
                        viewport={{amount: 0.2}}
                        transition={{duration: 0.6, delay: 0.2}}
                    >
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                            Schedule Your Time <br/> And Note It
                        </h1>
                        <p className="text-gray-200 mb-6">
                            Easily record, manage, and schedule your college assignments — all in one convenient place
                            to support your day.
                        </p>
                        <Link href="/auth/register">
                            <button
                                className="flex mx-auto md:mx-0 items-center gap-2 bg-sky-400 hover:bg-sky-800 text-white font-semibold px-5 py-3 rounded-lg transition-all duration-200">
                                Get For Free
                                <ArrowBigRight className="w-5 h-5"/>
                            </button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, x: 50}}
                        whileInView={{opacity: 1, x: 0}}
                        viewport={{amount: 0.2}}
                        transition={{duration: 0.6, delay: 0.2}}
                        className="hidden md:block"
                    >
                        <Image src="/student.svg" alt="gambar" width={500} height={500}
                               className="mx-auto w-[80%] md:w-[500px]"/>
                    </motion.div>
                </section>

                {/* CARD SECTION */}
                <section className="bg-white w-full text-black pb-10">
                    <motion.header
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{amount: 0.2}}
                        transition={{duration: 0.6, delay: 0.2}}
                        className="flex flex-col items-center justify-center p-6 text-center"
                    >
                        <p className="text-blue-600 font-bold">What you'll get</p>
                        <p className="text-2xl font-bold">Enjoy all the services included in Mahasiswa Center</p>
                        <p className="text-gray-700">Everything you need to manage your academic life in one place</p>
                    </motion.header>

                    <section className="flex flex-wrap justify-center gap-6 px-4">
                        {cardService.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{opacity: 0, y: 50}}
                                whileInView={{opacity: 1, y: 0}}
                                viewport={{amount: 0.2}}
                                transition={{duration: 0.6, delay: index * 0.2}}
                                className={`flex flex-col items-center p-6 sm:p-8 h-auto sm:h-[400px] ${item.color} rounded-md w-[90%] sm:w-[300px]`}
                            >
                                <Image className="mb-6 rounded" src={item.img} alt="gambar" width={250} height={250}/>
                                <h3 className="text-center font-semibold text-lg mb-2">{item.title}</h3>
                                <p className="text-center text-sm">{item.description}</p>
                            </motion.div>
                        ))}
                    </section>
                </section>

                {/* ABOUT SECTION */}
                <section className="pt-8 pb-20 bg-sky-200 text-black">
                    <motion.header
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{amount: 0.2}}
                        transition={{duration: 0.6, delay: 0.2}}
                        className="flex flex-col items-center px-4"
                    >
                        <div className="bg-sky-400 p-6 sm:p-10 rounded-xl shadow-lg w-full sm:w-[600px] md:w-[800px]">
                            <Image src="/Education.png" alt="claim photo" width={800} height={800}
                                   className="mx-auto rounded-lg w-full"/>
                        </div>
                    </motion.header>

                    <section className="p-6 sm:p-10 text-center sm:text-left">
                        <motion.p
                            initial={{opacity: 0, y: 50}}
                            whileInView={{opacity: 1, y: 0}}
                            transition={{duration: 0.6, delay: 0.2}}
                            className="text-blue-600 font-bold text-md"
                        >
                            About us
                        </motion.p>
                        <motion.h1
                            initial={{opacity: 0, y: 50}}
                            whileInView={{opacity: 1, y: 0}}
                            transition={{duration: 0.6, delay: 0.3}}
                            className="text-2xl sm:text-4xl font-bold mt-2"
                        >
                            About Mahasiswa Center
                        </motion.h1>
                        <motion.p
                            initial={{opacity: 0, y: 50}}
                            whileInView={{opacity: 1, y: 0}}
                            transition={{duration: 0.6, delay: 0.4}}
                            className="max-w-[600px] mx-auto sm:mx-0 mt-4 text-gray-700"
                        >
                            Mahasiswa Center is a platform designed to help college students manage their daily academic
                            activities easily...
                        </motion.p>
                    </section>
                </section>
            </main>

            {/* FOOTER */}
            <footer
                className="bg-white/10 backdrop-blur-md border-t border-white/20 text-gray-200 px-6 py-10 text-center sm:text-left">
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-white">Mahasiswa Center</h3>
                        <p className="text-sm mt-2 text-gray-300">
                            Manage your academic life easily — notes, schedules, and tasks in one place.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h4 className="text-white font-semibold mb-2">Quick Links</h4>
                        <a href="#" className="hover:text-sky-400 transition-colors">Home</a>
                        <a href="#" className="hover:text-sky-400 transition-colors">About</a>
                        <a href="#" className="hover:text-sky-400 transition-colors">Contact</a>
                    </div>
                    <div className="flex flex-col gap-3 items-center md:items-end">
                        <div className="flex gap-4 justify-center md:justify-end">
                            <a href="#" className="hover:text-sky-400 transition-colors">Twitter</a>
                            <a href="#" className="hover:text-sky-400 transition-colors">Instagram</a>
                            <a href="#" className="hover:text-sky-400 transition-colors">LinkedIn</a>
                        </div>
                        <p className="text-sm text-gray-400 mt-4">
                            © {new Date().getFullYear()} Mahasiswa Center. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
