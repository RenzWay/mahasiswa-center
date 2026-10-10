import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingCallToAction() {
  return (
    <section id="start" className="bg-slate-950 px-5 py-16 text-white lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase text-sky-300">
            Mulai dari hal kecil
          </p>
          <h2 className="mt-2 max-w-2xl text-3xl font-bold">
            Buka dashboard, tambah tugas pertama, lalu rapikan jadwal hari ini.
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
  );
}
