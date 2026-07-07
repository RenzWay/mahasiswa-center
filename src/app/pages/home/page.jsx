"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  Menu,
  NotebookPen,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    title: "Collect Your Tasks",
    icon: CheckSquare,
    description:
      "Easily manage and keep track of your college assignments with priority tags.",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    img: "/ss/task.png",
  },
  {
    title: "Schedule Your Days",
    icon: CalendarDays,
    description:
      "Plan your schedule for tomorrow and never miss a class or task again.",
    color: "text-sky-600 bg-sky-50 border-sky-100",
    img: "/ss/schedule.png",
  },
  {
    title: "Personal Notes",
    icon: NotebookPen,
    description:
      "Write and organize your own study notes effectively and efficiently.",
    color: "text-violet-600 bg-violet-50 border-violet-100",
    img: "/ss/note.png",
  },
];

const stats = [
  { label: "Workspace", value: "3" },
  { label: "Simple tools", value: "1" },
  { label: "Daily focus", value: "24h" },
];

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
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4" />
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            Loading your services...
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-md bg-slate-950 text-white">
                <LayoutDashboard className="size-4" />
              </span>
              <span className="text-base font-bold">Mahasiswa Center</span>
            </Link>

            <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
              <a href="#features" className="hover:text-slate-950">
                Fitur
              </a>
              <a href="#preview" className="hover:text-slate-950">
                Preview
              </a>
              <a href="#start" className="hover:text-slate-950">
                Mulai
              </a>
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              <Button asChild variant="ghost">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">
                  Mulai Gratis
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 md:hidden"
              aria-label="Toggle menu"
              onClick={() => setOpen((value) => !value)}>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          {open && (
            <div className="border-t border-slate-200 bg-white px-5 py-4 md:hidden">
              <nav className="flex flex-col gap-4 text-sm font-medium text-slate-700">
                <a href="#features" onClick={() => setOpen(false)}>
                  Fitur
                </a>
                <a href="#preview" onClick={() => setOpen(false)}>
                  Preview
                </a>
                <a href="#start" onClick={() => setOpen(false)}>
                  Mulai
                </a>
                <Button asChild className="mt-2">
                  <Link href="/auth/register">Mulai Gratis</Link>
                </Button>
              </nav>
            </div>
          )}
        </header>

        <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-20 lg:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-sky-100 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
              <Sparkles className="size-4" />
              Ruang kerja ringan buat mahasiswa
            </div>
            <h1 className="max-w-xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Jadwal, tugas, dan catatan dalam satu tempat.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Mahasiswa Center bantu kamu melihat apa yang harus dikerjakan hari
              ini, apa yang sudah selesai, dan apa yang perlu dicatat sebelum
              lupa.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/auth/register">
                  Coba Sekarang
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/login">Masuk ke Akun</Link>
              </Button>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-md border border-slate-200 bg-white p-4">
                  <dt className="text-xs font-medium text-slate-500">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-2xl font-bold text-slate-950">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
            id="preview">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-300/50">
              <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                <span className="size-2.5 rounded-full bg-rose-400" />
                <span className="size-2.5 rounded-full bg-amber-400" />
                <span className="size-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-medium text-slate-500">
                  Dashboard preview
                </span>
              </div>
              <Image
                src="/ss/dashboard.png"
                alt="Preview dashboard Mahasiswa Center"
                width={1200}
                height={760}
                priority
                className="h-auto w-full"
              />
            </div>
          </motion.div>
        </section>

        <section
          id="features"
          className="border-y border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-bold uppercase text-sky-600">
                Fitur utama
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                Simple, tapi cukup buat dipakai harian.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {features.map((feature, index) => (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <div className="aspect-16/10 overflow-hidden border-b border-slate-200 bg-slate-100">
                    <Image
                      src={feature.img}
                      alt={`Preview ${feature.title}`}
                      width={720}
                      height={450}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="p-5">
                    <div
                      className={`mb-4 inline-flex size-10 items-center justify-center rounded-md border ${feature.color}`}>
                      <feature.icon className="size-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-950">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="start"
          className="bg-slate-950 px-5 py-16 text-white lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold uppercase text-sky-300">
                Mulai dari hal kecil
              </p>
              <h2 className="mt-2 max-w-2xl text-3xl font-bold">
                Buka dashboard, tambah tugas pertama, lalu rapikan jadwal hari
                ini.
              </h2>
            </div>
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth/register">
                Buat Akun
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
