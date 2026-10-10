import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type MetricCard = {
  label: string;
  value: number;
  helper: string;
  icon: LucideIcon;
  color: string;
};

const cardMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function DashboardMetrics({ cards }: { cards: MetricCard[] }) {
  return (
    <section className="hidden gap-4 md:grid md:grid-cols-3">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          variants={cardMotion}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.35, delay: index * 0.06 }}
        >
          <Card className="rounded-lg border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="flex items-center justify-between gap-4 p-4 sm:p-5">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.label}
                </p>
                <p className="mt-2 text-4xl font-bold tracking-tight">
                  {card.value}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {card.helper}
                </p>
              </div>
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-md border ${card.color}`}
              >
                <card.icon className="size-6" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </section>
  );
}
