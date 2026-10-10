import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SectionCardProps = {
  title: string;
  description: string;
  href: string;
  action: string;
  children: ReactNode;
};

export function SectionCard({
  title,
  description,
  href,
  action,
  children,
}: SectionCardProps) {
  return (
    <Card className="w-full min-w-0 max-w-full rounded-lg border-slate-200 bg-white py-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:py-6">
      <CardHeader className="flex min-w-0 flex-col items-start justify-between gap-3 px-4 pb-2 sm:flex-row sm:gap-4 sm:px-6 sm:pb-3">
        <div className="min-w-0">
          <CardTitle className="text-base font-bold text-slate-950 dark:text-slate-50">
            {title}
          </CardTitle>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="w-full shrink-0 sm:w-auto"
        >
          <Link href={href}>
            {action}
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="w-full min-w-0 max-w-full space-y-3 overflow-hidden px-4 sm:px-6">
        {children}
      </CardContent>
    </Card>
  );
}
