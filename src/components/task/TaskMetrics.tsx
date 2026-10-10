import { Card, CardContent } from "@/components/ui/card";
import type { TaskMetric } from "@/hooks/useTask";

export function TaskMetrics({ cards }: { cards: TaskMetric[] }) {
  return (
    <section className="hidden gap-4 lg:grid lg:grid-cols-3">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="rounded-lg border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
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
      ))}
    </section>
  );
}
