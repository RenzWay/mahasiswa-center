import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, CheckSquare, NotebookPen } from "lucide-react";

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

export function LandingFeatures() {
  return (
    <section id="features" className="border-y border-slate-200 bg-white py-16">
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
              className="overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
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
                  className={`mb-4 inline-flex size-10 items-center justify-center rounded-md border ${feature.color}`}
                >
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
  );
}
