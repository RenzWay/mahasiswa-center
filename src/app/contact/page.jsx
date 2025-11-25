"use client"
import {useState} from "react";
import {Menu, X} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function ContactPage() {
    const [open, setOpen] = useState(false);

    return (
        <>
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
                                <Link href="/" className="hover:text-blue-500 transition">
                                    About
                                </Link>
                            </li>
                        </ul>
                        <Link href="/auth/register">
                            <Button variant="secondary" className="text-sm sm:text-base px-4 py-2 sm:px-6">
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
                                <Button variant="secondary" className="text-sm px-4 py-2">Start for free</Button>
                            </Link>
                        </nav>
                    </div>
                )}
            </header>
            
            <section className="max-w-xl mx-auto p-6 space-y-4">
                <h1 className="text-3xl font-semibold">Contact</h1>
                <p className="text-muted-foreground">
                    If you have any questions, feedback, or just want to reach out, feel free to contact me anytime.
                </p>

                <div className="space-y-2">
                    <p className="text-sm">Email:</p>
                    <h1>Comming soon</h1>
                    {/*<a*/}
                    {/*    href="mailto:narendradikaprasoca10@gmail.com"*/}
                    {/*    className="text-blue-500 underline"*/}
                    {/*>*/}
                    {/*    narendradikaprasoca10@gmail.com*/}
                    {/*</a>*/}
                </div>

                <div className="space-y-2">
                    <p className="text-sm">Social:</p>
                    <ul className="list-disc ml-5 space-y-1">
                        {/*<li>*/}
                        {/*    <a href="#" className="text-blue-500 underline">*/}
                        {/*        Instagram*/}
                        {/*    </a>*/}
                        {/*</li>*/}
                        <li>
                            <a target="_blank" href="https://github.com/RenzWay" className="text-blue-500 underline">
                                GitHub
                            </a>
                        </li>
                    </ul>
                </div>
            </section>
        </>
    );
}
