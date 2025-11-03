"use client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "@/firebase/firebase";
import {Button} from "@/components/ui/button";
import {ArrowBigRight} from "lucide-react";
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
            <main className="h-auto bg-gradient-to-tl from-sky-900 to-sky-950">
                <header
                    className="sticky top-0 z-50 flex justify-between items-center p-4 bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm  border-b border-white/30 dark:border-gray-700/40"
                >
                    <h3 className="font-extrabold">Mahasiswa Center</h3>
                    <nav className="flex items-center gap-8">
                        <ul className="flex gap-4">
                            <li>Home</li>
                            <li>Contact</li>
                            <li>About</li>
                        </ul>
                        <Link href="/auth/register">
                            <Button>Start for free</Button>
                        </Link>
                    </nav>
                </header>

                <section className="grid grid-cols-2 gap-8 p-8 items-center justify-center">
                    <motion.div initial={{opacity: 0, x: -50}}
                                whileInView={{opacity: 1, x: 0}}
                                viewport={{amount: 0.2}}
                                transition={{duration: 0.6, delay: 0.2}}>
                        <h1>
                            Schedule Your Time <br/>
                            And Note It
                        </h1>
                        <p>Easily record, manage, and schedule your
                            college assignments — <br/>
                            all in one convenient place to support your day.
                        </p>
                        <Link href="/auth/register">
                            <button
                                className="flex items-center gap-2 bg-sky-400 hover:bg-sky-800 text-white font-semibold p-4 rounded-lg transition-all duration-200">
                                Get For Free
                                <ArrowBigRight className="w-5 h-5"/>
                            </button>
                        </Link>
                    </motion.div>
                    <motion.div initial={{opacity: 0, x: 50}}
                                whileInView={{opacity: 1, x: 0}}
                                viewport={{amount: 0.2}}
                                transition={{duration: 0.6, delay: 0.2}}>
                        <Image src="/student.svg" alt="gambar" width={500} height={500}/>
                    </motion.div>
                </section>
                <section className="bg-white w-full text-black pb-10">
                    <motion.header initial={{opacity: 0, y: 50}}
                                   whileInView={{opacity: 1, y: 0}}
                                   viewport={{amount: 0.2}}
                                   transition={{duration: 0.6, delay: 0.2}}
                                   className="flex flex-col items-center justify-center p-6">
                        <p className="text-blue-600 font-bold">What you'll get</p>
                        <p className="text-2xl font-bold m-0 p-0">Enjoy all the services included in Mahasiswa
                            Center</p>
                        <p>Everything you need to manage your academic life in one place</p>
                    </motion.header>
                    <section className={`flex gap-4 px-4`}>
                        {cardService.map((item, index) => (
                            <motion.div key={index}
                                        initial={{opacity: 0, y: 50}}
                                        whileInView={{opacity: 1, y: 0}}
                                        viewport={{amount: 0.2}}
                                        transition={{duration: 0.6, delay: index * 0.2}}
                                        exit={{opacity: 0, y: 50}}
                                        className={`flex flex-col items-center  p-8 h-[400px] ${item.color} w-fit rounded-md`}>
                                <Image className="mb-8" src={item.img} alt="gambar" width={300} height={300}/>
                                <h3 className={`text-center`}>{item.title}</h3>
                                <p className={`text-center`}>{item.description}</p>
                            </motion.div>
                        ))}
                    </section>
                </section>
                <section className="pt-8 pb-20 bg-sky-200">
                    <motion.header initial={{opacity: 0, y: 50}}
                                   whileInView={{opacity: 1, y: 0}}
                                   viewport={{amount: 0.2}}
                                   transition={{duration: 0.6, delay: 0.2}}
                                   className=" flex flex-col items-center">
                        <div className="bg-sky-400 p-14 rounded-xl shadow-lg w-[800px]">
                            <Image
                                src="/Education.png"
                                alt="claim photo"
                                width={800}
                                height={800}
                                className="mx-auto rounded-lg"
                            />
                        </div>
                    </motion.header>
                    <section className={'p-14 text-black'}>
                        <motion.p initial={{opacity: 0, y: 50}}
                                  whileInView={{opacity: 1, y: 0}}
                                  viewport={{amount: 0.2}}
                                  transition={{duration: 0.6, delay: 0.2}}
                                  className="text-blue-600 font-bold text-md">About us
                        </motion.p>
                        <motion.h1 initial={{opacity: 0, y: 50}}
                                   whileInView={{opacity: 1, y: 0}}
                                   viewport={{amount: 0.2}}
                                   transition={{duration: 0.6, delay: 0.3}}>About Mahasiswa Center
                        </motion.h1>
                        <motion.p initial={{opacity: 0, y: 50}}
                                  whileInView={{opacity: 1, y: 0}}
                                  viewport={{amount: 0.2}}
                                  transition={{duration: 0.6, delay: 0.4}}
                                  className="w-[600px]">Mahasiswa Center is a platform designed to help college students
                            manage
                            their daily academic
                            activities easily. From scheduling classes to keeping personal notes, our goal is to make
                            your study journey smoother and more organized.
                            We understand the challenges students face in managing multiple courses, assignments, and
                            deadlines. That's why we created an all-in-one solution that simplifies academic life.
                        </motion.p>
                    </section>
                </section>
            </main>

            <footer
                className=" bg-white/10 backdrop-blur-md  border-t border-white/20  text-gray-200  px-8 py-10">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-bold text-white">Mahasiswa Center</h3>
                        <p className="text-sm mt-2 text-gray-300">
                            Manage your academic life easily — notes, schedules, and tasks in one place.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col gap-2">
                        <h4 className="text-white font-semibold mb-2">Quick Links</h4>
                        <a href="#" className="hover:text-sky-400 transition-colors">Home</a>
                        <a href="#" className="hover:text-sky-400 transition-colors">About</a>
                        <a href="#" className="hover:text-sky-400 transition-colors">Contact</a>
                    </div>

                    {/* Social / Copyright */}
                    <div className="flex flex-col gap-3 items-start md:items-end justify-between">
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-sky-400 transition-colors">Twitter</a>
                            <a href="#" className="hover:text-sky-400 transition-colors">Instagram</a>
                            <a href="#" className="hover:text-sky-400 transition-colors">LinkedIn</a>
                        </div>
                        <p className="text-sm text-gray-400 mt-4 md:mt-0">
                            © {new Date().getFullYear()} Mahasiswa Center. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
